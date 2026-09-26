let arr: number[] = [1, 2, 3, 4, 5]; 

arr.forEach((value: number) => {
    console.log(value * value);
});
const names = ["Ahmed", "Ali", "Mohamed", "Abd elghany"];
names.forEach((name: string) => {
    console.log(name);
});

let myMap = new Map<string, number>();
myMap.set('one', 1);
myMap.set('two', 2);
myMap.set('three', 3);

myMap.forEach((value, key) => {
  console.log(`Key: ${key}, Value: ${value}`);
});

