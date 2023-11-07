// import { ToDoList } from "./todo-list";
import "./style.css";
import { ToDo } from "./todo";
import { nextDay, lastDayOfMonth } from "date-fns";

const toDo = new ToDo();
// create a list
toDo.createList("Project");
// create another list;
toDo.createList("Tutorial");
let title1 = "Wash the car";
let note1 = "This is  some notes that i figured should be useful";
let dueDate1 = lastDayOfMonth(Date.now());
let priority1 = "none";
// create a toDo item in a particular list; ('PROJECT')
// toDo.createToDo(0, title1, note1, dueDate1, priority1);
// get toDo items in a particular list;
console.log(toDo.getListToDo(0));

let title2 = "Using The App";
let note2 = "Complete the below toDos";
let dueDate2 = Date.now();
let priority2 = "high";
// create a toDo item in another list;
// toDo.createToDo(1, title2, note2, dueDate2, priority2, false)

console.log(toDo.lists); // get the lists created
console.log(toDo.dueToday)

// create a list;
// create toDo item(s) in a list;
// can edit, delete, and view toDo item(s) in a list;

// can create multiple lists