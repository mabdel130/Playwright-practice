const testBrowsers = ["chrome", "Mozilla", "Safari"];

import { array } from "stream/iter";

for (let index = 0; index < testBrowsers.length; index++) {
  console.log(index, testBrowsers[index]);
}

for (const x of testBrowsers) {
  console.log(`Run smoke test in ${x}`);
}

let environments = ["Testing","production","Staging"];

for (let Environment of environments) {
  console.log(`Element: ${Environment}`);
}
