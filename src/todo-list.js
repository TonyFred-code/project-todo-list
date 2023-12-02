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

  #createId() {
    return Date.now();
  }

  constructor(name) {
    this.name = name;
    this.id = this.#createId();
  }

  get todoList() {
    return this.#todoList;
  }

  createToDo(title, notes, dueDate, priority, [...subtasks], done = false) {
    let todoItem = new ToDoItem();
    todoItem.done = done;
    todoItem.title = title;
    todoItem.note = notes;
    todoItem.dueDate = dueDate;
    todoItem.priority = priority;

    for (let i = 0; i < subtasks.length; i++) {
        todoItem.addSubtask(subtasks[i]);
    }
    this.#todoList.push(todoItem);
    return todoItem;
  }
}
