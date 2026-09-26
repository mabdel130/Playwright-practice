let username: string = "Abdo";
const count = 5;

const stringWithConcat = "logging as " + username + " with " + count;
const stringWithTemplate = `logging as ${username} with ${count}`;

console.log(stringWithTemplate);

const price = 100;
const quantity = 3;
console.log(`Total price: ${price * quantity}`);
const time=10;
console.log(`Time: ${time}`);

const multiLineMessage = `Hello ${username},
Your order contains ${quantity} items.
Total: ${price * quantity} EGP`;
console.log(multiLineMessage);

function getGreeting(name: string): string {
  return `Welcome, ${name}!`;
}
console.log(`Message: ${getGreeting(username)}`);

const isPremium = true;
console.log(`User status: ${isPremium ? `Premium (${count} orders)` : "Regular"}`);

const age = 20;
const accessMessage = age >= 18 ? "Access granted" : "Access denied";
console.log(accessMessage);

let accessMessageLong: string;
if (age >= 18) {
  accessMessageLong = "Access granted";
} else {
  accessMessageLong = "Access denied";
}

const score = 75;
const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 50 ? "C" : "F";
console.log(`Grade: ${grade}`);

console.log(`Access: ${age >= 18 ? "Allowed" : "Denied"}`);
