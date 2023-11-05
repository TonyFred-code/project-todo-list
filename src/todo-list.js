import { ToDoItem } from "./todo-item";

// a full todo list;
// each todo list item must have
//  - a title value;

/*

creating new todos, setting todos as complete, changing todo priority

*/
export class ToDoList {
    #todoList = [];

    constructor(name) {
        this.name = name;
    }

    get todoList() {
        return this.#todoList;
    }

    createToDo() {
        let todoItem = new ToDoItem();
        this.#todoList.push(todoItem);
        return todoItem;
    }

}