import { ToDoItem } from "./todo-item";

// a full todo list;
// each todo list item must have
//  - a title value;
// #title;
// #notes;
// #dueDate;
// #priority;
// #subTasks = [];
// #done = false;
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

    createToDo(title, notes, dueDate, priority, done) {
        let todoItem = new ToDoItem();
        todoItem.done = done;
        todoItem.title = title;
        todoItem.note = notes;
        todoItem.dueDate = dueDate;
        todoItem.priority = priority;
        this.#todoList.push(todoItem);
        return todoItem;
    }

}