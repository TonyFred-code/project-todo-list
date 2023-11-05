import { ToDoItem } from "./todo-item";
// import { isValid } from "date-fns";

const todo1 = new ToDoItem();
todo1.title = "Wash the car";
todo1.note = "This is  some notes that i figured should be useful";
todo1.dueDate = "2023";
todo1.priority = "none";
console.log(todo1);