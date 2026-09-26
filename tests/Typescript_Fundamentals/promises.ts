const simplePromise = new Promise<string>((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Operation completed successfully");
  } else {
    reject(new Error("Operation failed"));
  }
});

simplePromise
  .then((result) => console.log("Result:", result))
  .catch((error) => console.log("Error:", error.message));

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchUserData(userId: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: `User_${userId}` });
      } else {
        reject(new Error(`Invalid userId: ${userId}`));
      }
    }, 500);
  });
}

fetchUserData(1)
  .then((user) => console.log("Fetched user:", user))
  .catch((err) => console.log("Fetch failed:", err.message));

fetchUserData(2)
  .then((user) => {
    console.log("Step 1 - got user:", user.name);
    return user.id;
  })
  .then((id) => {
    console.log("Step 2 - got id from previous step:", id);
  })
  .catch((err) => {
    console.log("Something went wrong:", err.message);
  })
  .finally(() => {
    console.log("Finally - runs regardless of success or failure");
  });

async function getUserName(userId: number): Promise<string> {
  try {
    const user = await fetchUserData(userId);
    return user.name;
  } catch (error) {
    console.log("Error inside async function:", (error as Error).message);
    return "Unknown";
  }
}

getUserName(3).then((name) => console.log("Async/await result:", name));

async function fetchMultipleUsers(ids: number[]) {
  const users = await Promise.all(ids.map((id) => fetchUserData(id)));
  console.log("All users fetched in parallel:", users);
  return users;
}
fetchMultipleUsers([4, 5, 6]);

async function fetchUsersSafely(ids: number[]) {
  const results = await Promise.allSettled(ids.map((id) => fetchUserData(id)));
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`User ${ids[index]}: success ->`, result.value);
    } else {
      console.log(`User ${ids[index]}: failed ->`, result.reason.message);
    }
  });
}
fetchUsersSafely([7, -1, 8]);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

withTimeout(fetchUserData(9), 200)
  .then((user) => console.log("Got user before timeout:", user))
  .catch((err) => console.log("Race result:", err.message));

async function fetchFromFirstAvailableSource() {
  const sources = [
    fetchUserData(-1),
    delay(100).then(() => fetchUserData(10)),
  ];
  try {
    const firstSuccess = await Promise.any(sources);
    console.log("First successful source:", firstSuccess);
  } catch (error) {
    console.log("All sources failed:", error);
  }
}
fetchFromFirstAvailableSource();

interface Locator {
  isVisible: () => Promise<boolean>;
  click: () => Promise<void>;
  textContent: () => Promise<string | null>;
}

interface Page {
  goto: (url: string) => Promise<void>;
  locator: (selector: string) => Locator;
  waitForSelector: (selector: string, options?: { timeout?: number }) => Promise<void>;
}

async function retryAction<T>(
  action: () => Promise<T>,
  retries: number,
  delayMs: number = 500
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await action();
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${(error as Error).message}`);
      if (attempt === retries) throw error;
      await delay(delayMs);
    }
  }
  throw new Error("Unreachable");
}

async function clickWithRetry(locator: Locator, maxRetries: number = 3): Promise<void> {
  await retryAction(async () => {
    const visible = await locator.isVisible();
    if (!visible) throw new Error("Element not visible yet");
    await locator.click();
  }, maxRetries);
}

async function verifyPageElements(page: Page) {
  const [isHeaderVisible, isFooterVisible, isNavVisible] = await Promise.all([
    page.locator("header").isVisible(),
    page.locator("footer").isVisible(),
    page.locator("nav").isVisible(),
  ]);
  console.log({ isHeaderVisible, isFooterVisible, isNavVisible });
}

async function loginFlow(page: Page, username: string, password: string): Promise<boolean> {
  try {
    await page.goto("https://example.com/login");
    await page.waitForSelector("#username", { timeout: 5000 });

    const usernameField = page.locator("#username");
    const passwordField = page.locator("#password");
    const loginButton = page.locator("#login-button");

    await clickWithRetry(usernameField);
    await clickWithRetry(passwordField);
    await clickWithRetry(loginButton);

    const welcomeText = await page.locator("#welcome-message").textContent();
    console.log("Login successful, welcome message:", welcomeText);
    return true;
  } catch (error) {
    console.log("Login flow failed:", (error as Error).message);
    return false;
  }
}
