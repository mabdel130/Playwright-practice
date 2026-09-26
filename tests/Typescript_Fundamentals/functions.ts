function buildLoginMessage(username: string, success: boolean, timestamp?: Date): string {
  return success ? `${username} signed in successfully${timestamp ? ` at ${timestamp.toISOString()}`
   : ""}` : `${username} could not sign in${timestamp ? ` 
    at ${timestamp.toISOString()}` : ""}`;
}

console.log(buildLoginMessage("Abdo", true, new Date()));
console.log(buildLoginMessage("Abdo", false, new Date()));

function buildOrderMessage(username: string, orderId?: string): string {
  return orderId ? `${username}'s order #${orderId} is ready` : `${username} has no active order`;
}
console.log(buildOrderMessage("Sara"));
console.log(buildOrderMessage("Sara", "A123"));
