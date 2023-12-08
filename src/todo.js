import { ToDoList } from "./todo-list";
import {
  toDate,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
} from "date-fns";

export class ToDo {
  #lists = []; // all created tasks
  #dueToday = []; // only tasks due today
  #dueNextSevenDays = []; // only tasks due this particular week;
  #prioritized = []; // tasks with a priority flag not 'none';
  #today = Date.now();

  get lists() {
    return this.#lists;
  }

  getListById(id) {
    if (this.#lists.length === 0) {
      throw new Error("Create a list first.");
    }

    let lists = this.#lists;

    for (let list of lists) {
      if (list.id === id) {
        return list;
      }
    }

    throw new Error("Item not found");
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

  getListToDo(listId) {
    if (this.#lists.length === 0) {
      throw new Error("Create a list first.");
    }

    let list = this.getListById(listId);

    let listTodoItems = list.todoItems;
    return listTodoItems;
  }

  getListTodoItem(todoId, listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    let todo;

    try {
      todo = list.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    return todo;
  }

  getListPrioritizedTodoItems(listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    let prioritizedItems = list.prioritized;
    return prioritizedItems;
  }

  getListOverdueTodoItems(listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    let overdueItems = list.overdue;
    return overdueItems;
  }

  getListTodoDueToday(listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    let dueToday = list.dueToday;
    return dueToday;
  }

  getListTodoDueThisWeek(listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    let dueThisWeek = list.dueThisWeek;
    return dueThisWeek;
  }

  createList(title) {
    let list = new ToDoList(title);
    this.#lists.push(list);
    return list.id;
  }

  renameList(id, newName) {
    let list = this.getListById(id);
    if (!list) {
      throw new Error("Cannot get item");
    }

    list.name = newName;
  }

  deleteList(id) {
    let list = this.getListById(id);
    if (!list) {
      throw new Error("Cannot get item");
    }
    let pos = this.#lists.indexOf(list);

    this.#lists.splice(pos, 1);
  }

  deleteTodoItem(listId, todoId) {
    let list = this.getListById(listId);

    list.deleteToDo(todoId);
  }

  createToDo(
    listId,
    todoTitle,
    todoNotes,
    todoDueDate,
    todoPriority,
    [...subtasks],
    todoDone = false
  ) {
    let list;

    try {
      list = this.getListById(listId);
    } catch (error) {
      console.log(error);
    }

    let todoId = list.createToDo(
      todoTitle,
      todoNotes,
      todoDueDate,
      todoPriority,
      [...subtasks],
      todoDone
    );

    return todoId;
  }

  reassignTodoItem(todoId, currentListId, targetListId) {
    let currentList;
    try {
      currentList = this.getListById(currentListId);
    } catch (err) {
      throw err;
    }
    let targetList;
    try {
      targetList = this.getListById(targetListId);
    } catch (err) {
      throw err;
    }
    let todoItem;

    try {
      todoItem = currentList.getTodoById(todoId);
    } catch (err) {
      throw err;
    }

    targetList.createToDo(
      todoItem.title,
      todoItem.notes,
      todoItem.dueDate,
      todoItem.priority,
      todoItem.subtasks,
      todoItem.done
    );

    currentList.deleteTodo(todoId);
  }

  changeTodoDoneStatus(newState, todoId, listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    try {
      list.changeTodoDoneStatus(todoId, newState);
    } catch (err) {
      throw err;
    }
  }

  changeTodoTitle(newTitle, todoId, listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    try {
      list.changeTodoTitle(todoId, newTitle);
    } catch (err) {
      throw err;
    }
  }

  changeTodoPriority(newPriority, todoId, listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    try {
      list.changeTodoPriority(todoId, newPriority);
    } catch (err) {
      throw err;
    }
  }

  changeTodoDueDate(newDueDate, todoId, listId) {
    let list;
    try {
      list = this.getListById(listId);
    } catch (err) {
      throw err;
    }

    try {
      list.changeTodoDueDate(todoId, newDueDate);
    } catch (err) {
      throw err;
    }
  }

//   get dueToday() {
//     let lists = this.#lists;
//     if (lists.length === 0) {
//       throw new Error("Create lists first");
//     }
//     // console.log(lists);

//     // for (let i = 0; i < lists.length; i++) {
//     //   let list = lists[i];
//     //   let toDoList = list.todoList;
//     //   if (toDoList.length === 0) {
//     //     continue;
//     //   }
//     // }

//     lists.forEach((list) => {
//       list.todoList.forEach((toDo) => {
//         if (isToday(toDo.dueDate)) {
//           this.#dueToday.push(toDo);
//         }
//       });
//     });

//     return this.#dueToday;
//   }

//   get dueNextSevenDays() {
//     let today = Date.now();
//     let list = this.#lists;
//     for (let j = 0; j < 7; j++) {
//       let day = addDays(today, j);
//       list.forEach((list) => {
//         list.todoList.forEach((toDo) => {
//           if (isSameDay(day, toDo.dueDate)) {
//             this.#dueNextSevenDays.push(toDo);
//           }
//         });
//       });
//     }

//     return this.#dueNextSevenDays;
//   }

//   get prioritized() {
//     let list = this.#lists;

//     list.forEach((list) => {
//       list.todoList.forEach((toDo) => {
//         if (toDo.priority !== "none") {
//           this.#prioritized.push(toDo);
//         }
//       });
//     });

//     return this.#prioritized;
//   }
}
