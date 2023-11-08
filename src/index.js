// import { ToDoList } from "./todo-list";
import "./style.css";
import { ToDo } from "./todo";
import { nextDay, lastDayOfMonth } from "date-fns";

const toDo = new ToDo();
// create a list;
toDo.createList("Tutorial");
// get lists created in each instance;
// console.log(toDo.lists);
// view list even if nothing was created in it;
// console.log(toDo.getListToDo(0));
// create toDo in a list;
let title1 = "Create a list by clicking on 'new list' button in the side bar";
let note1 = "Creating a list is essential to usage of this software.";
let priority1 = "high";
let done1 = false;
let dueDate1 = Date.now();
let subtasks = ["click a button", "click that button","fill the form that pops up", "click the done button and voila you have created a todo"]
// add getting due time;
toDo.createToDo(0,title1, note1, dueDate1, priority1,[...subtasks], done1);
console.log(toDo.getListToDo(0));
console.log(toDo.dueToday); // viewing due today;
console.log(toDo.dueNextSevenDays); // viewing tasks due over the next seven days;
console.log(toDo.prioritized);