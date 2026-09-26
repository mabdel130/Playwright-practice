class ToDoPage {
    public title = "Ahmed"
    private id = 1
    readonly description = "This is a todo items";
    readonly createdBy = "Mohamed GH";

    constructor(title: string) {
        this.title = title;
    }

    ShowID(): void {
        this.id = 2;
        console.log(this.id);
    }

    public addToTitle(newTitle: string): void {
        console.log(`Welcome to ${newTitle}`);
    }
}

const todo = new ToDoPage("Initial Title");
console.log(todo.title);
todo.ShowID();
todo.addToTitle("our website");
