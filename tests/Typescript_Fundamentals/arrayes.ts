const tags = ["Smoke", "Regression"];
console.log(tags.indexOf("Smoke"));
tags.push("Sanity");

console.log(tags);
console.log(tags.indexOf("Sanity"));

const removedElements = tags.pop();
console.log(removedElements);

console.log(tags);

console.log(tags.splice(0, 0));

tags.push("Abd elghany");

console.log(tags);


let arr1: number[] = [11, 89, 23, 7, 98];


 let removed: number[] = arr1.splice(2, 0, 11);


 console.log(removed);
console.log("Modified array :"+arr1);

let fact = 1;
for (let i = 1; i <= 5; i++) {
    console.log(i);
    fact *= i;

}

console.log(fact);