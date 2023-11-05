// import { ToDoItem } from "./todo-item";
import { ToDoList } from "./todo-list";

const todo1 = new ToDoList();
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

let item1 = todo1.createToDo();
item1.note = "This is  some notes that i figured should be useful";
item1.markDone();

let item2 = todo1.createToDo();
item2.priority = "high";

console.log(item1);
console.log(todo1.todoList);

// console.log(item1.id === item2.id);