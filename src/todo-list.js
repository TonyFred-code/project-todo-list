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
  #todoItems = [];

  #createId() {
    return Date.now();
  }

  constructor(name) {
    this.name = name;
    this.id = this.#createId();
  }

  get todoItems() {
    return this.#todoItems;
  }

  getTodoById(id) {
    if (this.#todoItems.length === 0) {
      throw new Error("Create a list first.");
    }

    let todoItems = this.#todoItems;

    for (let todoItem of todoItems) {
      if (todoItem.id === id) {
        return todoItem;
      }
    }

    throw new Error("To-do Item not found");
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
    this.#todoItems.push(todoItem);
    return todoItem.id;
  }

  deleteToDo(todoId) {
    let todo;
    try {
      todo = this.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    let pos = this.#todoItems.indexOf(todo);

    this.#todoItems.splice(pos, 1);
  }
}
