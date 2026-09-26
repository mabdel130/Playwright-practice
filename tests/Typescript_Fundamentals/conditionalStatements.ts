 const statusCode = 201;

if (statusCode >= 200 && statusCode < 300) {
  console.log("Request succeeded");
} else if (statusCode >= 400 && statusCode < 500) {
  console.log("Client error");
} else if (statusCode >= 500) {
  console.log("Server error");
} else {
  console.log("Inappropriate information");
}

const outcome = statusCode === 201 ? "created" : "not created";
console.log(outcome);


 function getStatusCategory(code: number): string {
  switch (true) {
    case code >= 200 && code < 300:
      return "Success";
    case code >= 400 && code < 500:
      return "Client error";
    case code >= 500:
      return "Server error";
    default:
      return "Unknown";
  }
}
console.log(getStatusCategory(404));


const isAuthenticated = true;
const isAdmin = false;

if (isAuthenticated && isAdmin) {
  console.log("Welcome, admin dashboard unlocked");
} else if (isAuthenticated && !isAdmin) {
  console.log("Welcome, limited access");
} else {
  console.log("Please log in");
}


interface ApiResponse {
  status: number;
  body: { success: boolean };
}

function assertResponse(response: ApiResponse): void {
  if (response.status === 200 && response.body.success) {
    console.log("Test passed: response is valid");
  } else if (response.status >= 400 && response.status < 500) {
    throw new Error(`Test failed: client error ${response.status}`);
  } else {
    throw new Error(`Test failed: unexpected response ${response.status}`);
  }
}

assertResponse({ status: 200, body: { success: true } });


 async function loginIfNeeded(page: { isVisible: (s: string) => Promise<boolean>; click: (s: string) => Promise<void>; }) {
  const isLoginButtonVisible = await page.isVisible("#login-button");

  if (isLoginButtonVisible) {
    await page.click("#login-button");
  } else {
    console.log("User already logged in, skipping login step");
  }
}
 const statusCode3 =100;
 if (statusCode3 >= 200 && statusCode3 < 300) {
  console.log("Request succeeded");
}
else if (statusCode3 > 300 && statusCode3 <= 400) {
  console.log("Redirection or client error");
} else if (statusCode3>400|| statusCode3<= 409) {
  console.log("Client error");
} else if (statusCode3 >= 500) {
  console.log("Server error");
} else {
  console.log("Unexpected status code");
}

const outPut=statusCode3==100 ? "created" : "not created";
console.log(outPut);
