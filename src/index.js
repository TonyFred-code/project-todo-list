// import { ToDoList } from "./todo-list";
import "./style.css";
import { ToDo } from "./todo";

const toDo = new ToDo();
toDo.createList("Project");
console.log(toDo.lists);
// const todo1 = new ToDoList("Project");
// const work = new ToDoList("Work");

// console.log(work === todo1)
// todo1.title = "Wash the car";
// todo1.note = "This is  some notes that i figured should be useful";
// todo1.dueDate = "2023";
// todo1.priority = "none";
// console.log(todo1);
// todo1.addSubtask("wash the tires");
// todo1.addSubtask("wash the car mats");
// todo1.addSubtask("wash the cup holder area carefully");
// console.log(todo1.subtasks)
// for (let subtask of todo1.subtasks) {
//     console.log(subtask);
// }

// let item1 = todo1.createToDo();
// item1.note = "This is  some notes that i figured should be useful";
// item1.markDone();

// let item2 = todo1.createToDo();
// item2.priority = "high";

// console.log(todo1.todoList[0]);