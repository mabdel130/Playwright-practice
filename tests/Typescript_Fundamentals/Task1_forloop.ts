
const browsersName = ["Webkit", "Edge","Safari", "chrome",];
const targetBrowserNumber = browsersName.length;

let foundForLoop: string | undefined = undefined;
for (let i = 0; i < browsersName.length; i++) {
  if (i + 1 === targetBrowserNumber) foundForLoop = browsersName[i];
}
console.log(`Browser number ${targetBrowserNumber}: ${foundForLoop ?? "Not found"}`);

let counter = 1;
let foundForOf: string | undefined = undefined;
for (let browser of browsersName) { 
  foundForOf = counter++ === targetBrowserNumber ? browser : foundForOf;
}
console.log(`Browser number ${targetBrowserNumber}: ${foundForOf ?? "Not found"}`);

