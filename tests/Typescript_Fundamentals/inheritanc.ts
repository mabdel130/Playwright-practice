class Parent {
    constructor(readonly name: string, readonly phoneNumber: number) { }
}
class Child extends Parent {
    constructor(name: string = "Ahmd", phoneNumber: number = 123458698, readonly address: string = "Test@yes@hlwan") {
        super(name, phoneNumber);
    }
}
const child = new Child();
console.log(child.name);
console.log(child.phoneNumber);
console.log(child.address);

class Parent2{
    open(): void {
        console.log("Parent2 Open");
    }
}
class Child2 extends Parent2 {
    open(): void {
        console.log("Child2 Open");
    }
}
console.log(new Child2().open());