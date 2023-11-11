// import { ToDoList } from "./todo-list";
import "./style.css";
import { ToDo } from "./todo";
import { nextDay, lastDayOfMonth } from "date-fns";
import headerIconImgSrc from './icons/format-list-bulleted.svg';
// todo import prioritizedIconImgSrc from './icons/';
import overDueIconImgSrc from './icons/layers-triple-outline.svg';
import todayIconSrc from './icons/calendar-today.svg';
import thisWeekIconSrc from './icons/calendar-range.svg';
import upcomingIconSrc from './icons/arrow-top-right.svg'

function createImg(src, alt="") {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    return img;
}

const headerIconImg = createImg(headerIconImgSrc);
const todayIconImg = createImg(todayIconSrc);
const upcomingIconImg = createImg(upcomingIconSrc);
const thisWeekIconImg = createImg(thisWeekIconSrc);
const overDueIconImg = createImg(overDueIconImgSrc);
const prioritizedIconImg = createImg(upcomingIconSrc);

document.querySelector('.header-icon-container').appendChild(headerIconImg);
document.querySelector('.icon-overdue').appendChild(overDueIconImg);
document.querySelector('.icon-today').appendChild(todayIconImg);
document.querySelector('.icon-seven-days').appendChild(thisWeekIconImg);
document.querySelector('.icon-today').appendChild(todayIconImg);
document.querySelector('.icon-prioritized').appendChild(prioritizedIconImg); //todo: change to exclamation point svg
document.querySelector('.icon-upcoming').appendChild(upcomingIconImg);






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