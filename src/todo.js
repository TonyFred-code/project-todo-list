import { ToDoList } from "./todo-list";
import { toDate, isToday } from "date-fns";

export class ToDo {
  #lists = [];
  #dueToday = [];
  #today = Date.now();

  get lists() {
    return this.#lists;
  }

  getList(index) {
    if (this.#lists.length === 0) {
      throw new Error("Create a list first.");
    }

    let listLength = this.#lists.length;
    if (index < 0 || index >= listLength) {
      throw new Error("Invalid index. Must be a zero based index access.");
    }

    let list = this.#lists[index];
    return list;
  }

  getListToDo(listIndex = 0) {
    if (this.#lists.length === 0) {
      throw new Error("Create a list first.");
    }

    let listLength = this.#lists.length;
    if (listIndex < 0 || listIndex >= listLength) {
      throw new Error("Invalid index. Must be a zero based index access.");
    }

    let list = this.#lists[listIndex];
    return list.todoList;
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

  createToDo(
    listIndex,
    todoTitle,
    todoNotes,
    todoDueDate,
    todoPriority,
    [...subtasks],
    todoDone  = false
  ) {
    if (
      typeof listIndex !== "number" ||
      listIndex < 0 ||
      listIndex >= this.#lists.length
    ) {
      throw new Error("Invalid index input");
    }

    let list = this.#lists[listIndex];
    list.createToDo(
      todoTitle,
      todoNotes,
      todoDueDate,
      todoPriority,
      [...subtasks],
      todoDone
      );
  }

  get dueToday() {
    let lists = this.#lists;
    if (lists.length === 0) {
      throw new Error("Create lists first");
    }
    // console.log(lists);

    // for (let i = 0; i < lists.length; i++) {
    //   let list = lists[i];
    //   let toDoList = list.todoList;
    //   if (toDoList.length === 0) {
    //     continue;
    //   }
    // }

    lists.forEach((list) => {


      list.todoList.forEach((toDo) => {
       if (isToday(toDo.dueDate)) {
        this.#dueToday.push(toDo);
       }
      })
    })

    return this.#dueToday;
  }
}

// create list
// get list
// get todos in a list
// rename list;
// delete list;

// create a todo in a list;
//