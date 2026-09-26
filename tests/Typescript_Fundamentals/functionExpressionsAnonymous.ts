const formatResults = function (name: string, passed: boolean): string {
  return `${name}: ${passed ? "PASS" : "FAILED"}`;
};

console.log(formatResults("Login test", true));
console.log(formatResults("Checkout test", false));

function formatResultsDeclared(name: string, passed: boolean): string {
  return `${name}: ${passed ? "PASS" : "FAILED"}`;
}

console.log(formatResultsDeclared("Signup test", true));

const runStep = function executeStep(stepName: string, action: () => void): void {
  console.log(`Running step: ${stepName}`);
  action();
};
runStep("Click login button", () => console.log("Clicked!"));

const testEnvironment = (function (): string {
  const env = "staging";
  console.log(`Test environment initialized: ${env}`);
  return env;
})();

interface TestResult {
  name: string;
  passed: boolean;
}

const buildTestReport = function (results: TestResult[]): string {
  return results.map((r) => formatResults(r.name, r.passed)).join("\n");
};

const suiteResults: TestResult[] = [
  { name: "Login test", passed: true },
  { name: "Checkout test", passed: false },
  { name: "Search test", passed: true },
];

console.log("---- Test Report ----");
console.log(buildTestReport(suiteResults));

interface FakeResponse {
  url: string;
  status: number;
}

function onResponse(callback: (response: FakeResponse) => void) {
  const fakeResponse: FakeResponse = { url: "/api/login", status: 200 };
  callback(fakeResponse);
}

onResponse(function (response) {
  console.log(`Intercepted: ${response.url} -> ${response.status}`);
});

function fetchUserCallback(userId: string, callback: (error: Error | null, user?: { id: string; name: string }) => void) {
  setTimeout(() => {
    if (userId) {
      callback(null, { id: userId, name: "Abd Elghany" });
    } else {
      callback(new Error("userId is required"));
    }
  }, 10);
}

fetchUserCallback("u1", function (error, user) {
  if (error) {
    console.error("Callback error:", error.message);
    return;
  }
  console.log(`Callback result: ${user?.name}`);
});

function fetchUserPromise(userId: string): Promise<{ id: string; name: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId) {
        resolve({ id: userId, name: "Abdo" });
      } else {
        reject(new Error("userId is required"));
      }
    }, 10);
  });
}

async function fetchUserAsync(userId: string) {
  try {
    const user = await fetchUserPromise(userId);
    console.log(`Async/await result: ${user.name}`);
  } catch (error) {
    console.error("Async/await error:", (error as Error).message);
  }
}
fetchUserAsync("u2");
