import { ToDoList } from "./todo-list";

export class ToDo {
  #lists = [];

  get lists() {
    return this.#lists;
  }

  createList(title) {
    let list = new ToDoList(title);
    this.#lists.push(list);
  }

  renameList(index, newName) {
    let list = this.#lists[index];
    if (!list) {
        throw new Error("Cannot get item");
    }

    list.name = newName;
  }

  deleteList(index) {
    let list = this.#lists[index];
    if (!list) {
        throw new Error("Cannot get item");
    }

    this.#lists.splice(index, 1);
  }
}
