import { ToDoItem } from "./todo-item";
import { isToday, startOfDay, isBefore, isSameWeek } from "date-fns";

export class ToDoList {
  #todoItems = [];
  #id

  #createId() {
    return Date.now();
  }

  constructor(name) {
    this.name = name;
    this.#id = this.#createId();
  }

  get id() {
    return this.#id;
  }

  get todoItems() {
    return this.#todoItems;
  }

  get prioritized() {
    let todoItems = this.todoItems;
    let prioritizedItems = [];

    for (let todoItem of todoItems) {
      if (todoItem.priority === "medium" || todoItem.priority === "high") {
        prioritizedItems.push(todoItem);
      }
    }

    return prioritizedItems;
  }

  get overdue() {
    let todoItems = this.todoItems;
    let overdueItems = [];

    for (let todoItem of todoItems) {
      let dueDate = new Date(todoItem.dueDate);
      let today = startOfDay(Date.now());
      if (isBefore(dueDate, today)) {
        overdueItems.push(todoItem);
      }
    }
    return overdueItems;
  }

  get dueToday() {
    let todoItems = this.todoItems;
    let itemsDueToday = [];

    for (let todoItem of todoItems) {
      let dueDate = todoItem.dueDate;

      if (dueDate === "" || dueDate === "none") {
        continue;
      }

      if (isToday(new Date(dueDate))) {
        itemsDueToday.push(todoItem);
      }
    }
    return itemsDueToday;
  }

  get dueThisWeek() {
    let todoItems = this.todoItems;
    let itemsDueThisWeek = [];

    for (let todoItem of todoItems) {
      let dueDate = new Date(todoItem.dueDate);
      let today = Date.now()

      if (dueDate === "" || dueDate === "none") {
        continue;
      }

      if (isSameWeek(dueDate, today)) {
        itemsDueThisWeek.push(todoItem);
      }
    }
    return itemsDueThisWeek;
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

  createToDo(title, notes, dueDate, priority, done = false) {
    let todoItem = new ToDoItem();
    todoItem.done = done;
    todoItem.title = title;
    todoItem.note = notes;
    todoItem.dueDate = dueDate;
    todoItem.priority = priority;
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

  changeTodoTitle(todoId, newTitle) {
    let todo;
    try {
      todo = this.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    try {
      todo.title = newTitle;
    } catch (err) {
      throw err;
    }
  }

  changeTodoDoneStatus(todoId, newState) {
    let todo;
    try {
      todo = this.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    try {
      todo.done = newState;
    } catch (err) {
      throw err;
    }
  }

  changeTodoPriority(todoId, newPriority) {
    let todo;
    try {
      todo = this.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    try {
      todo.priority = newPriority;
    } catch (err) {
      throw err;
    }
  }

  changeTodoDueDate(todoId, newDate) {
    let todo;
    try {
      todo = this.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    try {
      todo.dueDate = newDate;
    } catch (err) {
      throw err;
    }
  }

  changeTodoNote(todoId, newNoteValue) {
    let todo;
    try {
      todo = this.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    try {
      todo.note = newNoteValue;
    } catch (err) {
      throw err;
    }
  }
}
