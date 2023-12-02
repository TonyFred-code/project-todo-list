import "./style.css";
import { ToDo } from "./todo";
// import {
//   nextDay,
//   lastDayOfMonth,
//   lightFormat,
//   daysInWeek,
//   intlFormat,
//   isSameYear,
// } from "date-fns";
import listIconSrc from "./icons/format-list-bulleted.svg";
// todo import prioritizedIconImgSrc from './icons/';
import overDueIconImgSrc from "./icons/layers-triple-outline.svg";
import todayIconSrc from "./icons/calendar-today.svg";
import allIconSrc from "./icons/calendar-month-outline.svg";
import upcomingIconSrc from "./icons/arrow-top-right.svg";
// import { ta } from "date-fns/locale";

const TODO = new ToDo();
// create default list - tutorial
let index = TODO.createList("Tutorial");
// const displayedList = [];

displayListItems();
changeScreen(index);

function createImg(src, alt = "") {
  const img = new Image();
  img.src = src;
  img.alt = alt;
  return img;
}

function iconCreations() {
  const allIconImg = createImg(allIconSrc);
  const todayIconImg = createImg(todayIconSrc);
  const upcomingIconImg = createImg(upcomingIconSrc);
  const overDueIconImg = createImg(overDueIconImgSrc);

  document.querySelector(".icon-all").appendChild(allIconImg);
  document.querySelector(".icon-today").appendChild(todayIconImg);
  document.querySelector(".icon-upcoming").appendChild(upcomingIconImg);
  document.querySelector(".icon-overdue").appendChild(overDueIconImg);
}

iconCreations();

// DIALOGS

const listDeleteConfirmDialog = document.querySelector(".list-delete-confirm");
const confirmListDelete =
  listDeleteConfirmDialog.querySelector("button.confirm");
const cancelListDelete = listDeleteConfirmDialog.querySelector("button.cancel");
const openListDeleteBtn = document.querySelector(
  ".current-screen button.delete-list"
);

const createListDialog = document.querySelector(".create-list-item-dialog");
const createListForm = createListDialog.querySelector("form");
const openCreateListBtn = document.querySelector(".create-list-item");
const cancelCreateListBtn = createListDialog.querySelector(".cancel");
const createListBtn = createListDialog.querySelector(".create");

const createTodoDialog = document.querySelector(".create-todo-item");
const openCreateTodoBtn = document.querySelector("button.add-task");
const cancelCreateTodoBtn = createTodoDialog.querySelector(".cancel");
const createToDoBtn = createTodoDialog.querySelector("button.submit");

const todoDeleteConfirmDialog = document.querySelector(".todo-delete-confirm");
const confirmTodoDelete =
  todoDeleteConfirmDialog.querySelector("button.confirm");
const cancelTodoDelete = todoDeleteConfirmDialog.querySelector("button.cancel");

cancelCreateListBtn.addEventListener("click", closeDialog);
openCreateListBtn.addEventListener("click", openDialog);
cancelListDelete.addEventListener("click", closeDialog);
openListDeleteBtn.addEventListener("click", openDialog);
openCreateTodoBtn.addEventListener("click", openDialog);
cancelCreateTodoBtn.addEventListener("click", closeDialog);
cancelTodoDelete.addEventListener("click", closeDialog);

function openDialog(e) {
  const elm = e.currentTarget;
  const targetDialog = elm.dataset.targetDialog;
  let dialog = document.querySelector(`dialog[data-name='${targetDialog}']`);
  dialog.showModal();
}

function closeDialog(e) {
  const elm = e.currentTarget;
  const targetDialog = elm.dataset.targetDialog;
  console.log("working", targetDialog);
  let dialog = document.querySelector(`dialog[data-name='${targetDialog}']`);
  dialog.close();
}

// LIST ITEM CREATION
createListDialog.addEventListener("close", () => {
  createListForm.elements["list-title"].value = "";
  console.log("closed list creation");
});

createListForm.addEventListener("submit", createList);
let listTitle = createListForm.elements["list-title"];
listTitle.addEventListener("input", (e) => {
  let title = listTitle.value;

  // validate form input;
  if (title.trim() === "") {
    listTitle.setCustomValidity("Input a valid title");
  } else if (title.length >= 20) {
    listTitle.setCustomValidity("Title is too long");
  } else {
    listTitle.setCustomValidity("");
  }
});

function createList(e) {
  e.preventDefault();
  console.log("called");
  let form = e.currentTarget;
  let listTitle = form.elements["list-title"];

  let title = listTitle.value;

  if (title.trim() === "") {
    listTitle.setCustomValidity("Input a valid title");
    listTitle.reportValidity();
    return;
  }

  // validate form input
  if (listTitle.checkValidity()) {
    console.log(title);
    let index = TODO.createList(title);
    displayListItems();
    changeScreen(index);
    createListDialog.close();
  }
}

function displayListItems() {
  const lists = TODO.lists;
  const listsContainer = document.querySelector(".list-items");
  listsContainer.textContent = "";

  for (let i = 0; i < lists.length; i++) {
    // if (displayedList.indexOf(i) !== -1) continue;

    // displayedList.push(i);
    let title = lists[i].name;
    const listItemLi = document.createElement("li");
    listItemLi.classList.add("list-item", "title");
    listItemLi.dataset.listName = title;
    listItemLi.dataset.listIndex = i;

    const iconContainer = document.createElement("span");
    const titleContainer = document.createElement("span");

    const listIconImg = createImg(listIconSrc);
    iconContainer.appendChild(listIconImg);
    iconContainer.classList.add("icon-container", "list-icon");

    titleContainer.textContent = title;
    titleContainer.classList.add("text");
    listItemLi.appendChild(iconContainer);
    listItemLi.appendChild(titleContainer);
    listItemLi.addEventListener("click", displayScreen);
    listsContainer.appendChild(listItemLi);
  }

  listsContainer.scrollTop = listsContainer.scrollHeight;
}

function removeActiveListContainer() {
  let listItems = document.querySelectorAll(".list-item");
  listItems.forEach((listItem) => {
    listItem.classList.remove("active");
  });
}

function addActiveListContainer(index) {
  let newActiveScreenLi = document.querySelector(
    `.list-item[data-list-index='${index}']`
  );
  newActiveScreenLi.classList.add("active");
}

function displayScreen(e) {
  let listContainer = e.currentTarget;
  let listIndex = listContainer.dataset.listIndex;
  removeActiveListContainer();

  addActiveListContainer(listIndex);
  changeScreen(listIndex);
}

// create screen
function changeScreen(listIndex) {
  let list;
  try {
    list = TODO.getList(listIndex);
  } catch (error) {
    console.log(error);
    return;
  }

  const screen = document.querySelector(".current-screen");
  removeActiveListContainer();
  screen.classList.remove("hidden");
  const emptyScreen = document.querySelector(".empty-screen");
  emptyScreen.classList.add("hidden");
  screen.dataset.listIndex = listIndex;

  const listTodo = TODO.getListToDo(listIndex);

  if (listTodo.length === 0) {
    createEmptyScreen();
    // return;
  } else {
    const todoItems = document.querySelectorAll(".todo-items li");
    // console.log(todoItems);
    todoItems.forEach((todoItem) => {
      let deleteTodoItem = todoItem.querySelector("button.delete-todo");
      deleteTodoItem.addEventListener("click", openDialog);
    });
  }

  const titleContainer = screen.querySelector(".current-screen-title");
  const screenCreateToDoBtn = screen.querySelector(".add-task");
  screenCreateToDoBtn.dataset.activeListIndex = listIndex;
  titleContainer.textContent = list.name;
  addActiveListContainer(listIndex);
  console.log(listTodo);
  console.log(list);
}

function createEmptyScreen() {
  const toDoContainer = document.querySelector(".todo-items");
  toDoContainer.textContent = "";
  const li = document.createElement("li");
  li.textContent = "Click the button below to create todo items for this list";

  toDoContainer.appendChild(li);
}

// deleting a list;
confirmListDelete.addEventListener("click", deleteList);

function createEmptyListScreen() {
  const screen = document.querySelector(".current-screen");
  screen.classList.add("hidden");
  const titleContainer = screen.querySelector(".current-screen-title");
  const screenCreateToDoBtn = screen.querySelector(".add-task");
  titleContainer.textContent = "";
  screenCreateToDoBtn.dataset.activeListIndex = "none"
  const todoItemContainer = screen.querySelector(".todo-items");
  todoItemContainer.textContent = "";
  const emptyScreen = document.querySelector(".empty-screen");
  emptyScreen.classList.remove("hidden");
}

// deleting the current list displayed on the screen
function deleteList(e) {
  const screen = document.querySelector(".current-screen");
  const currentListIndex =
    document.querySelector(".current-screen").dataset.listIndex;
  console.log(currentListIndex);
  const containingLi = document.querySelector(
    `.list-item[data-list-index='${currentListIndex}']`
  );
  const listsContainer = document.querySelector(".list-items");
  listsContainer.removeChild(containingLi);
  const lists = listsContainer.querySelectorAll(".list-item");
  if (lists.length === 0) {
    createEmptyListScreen();
    screen.dataset.listIndex = "none";
  } else {
    const lastList = lists.item(lists.length - 1);
    const lastListIndex = lastList.dataset.listIndex;
    changeScreen(lastListIndex);
  }


  TODO.deleteList(currentListIndex);
  // let pos = displayedList.indexOf(currentListIndex);
  // displayedList.splice(pos, 1);
  closeDialog(e);
}
