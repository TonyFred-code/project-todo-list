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
let id = TODO.createList("Tutorial");
// const displayedList = [];

displayListItems();
changeScreen(id);

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

const renameListDialog = document.querySelector("dialog.rename-list-item-dialog");
const renameListForm = renameListDialog.querySelector("form");
const openRenameListBtn = document.querySelector(".rename-list");
const cancelRenameListBtn = renameListDialog.querySelector(".cancel");
const renameListBtn = renameListDialog.querySelector(".rename");

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
openRenameListBtn.addEventListener("click", (e) => {
  let screen = document.querySelector(".current-screen");
  let activeListId = Number(screen.dataset.listId);
  if (Number.isNaN(activeListId)) return;
  let listName = TODO.getListById(activeListId).name;
  console.log(listName);
  let newNameInput = renameListForm.elements['new-title'];
  newNameInput.value = listName;
  openDialog(e)
});
cancelRenameListBtn.addEventListener("click", closeDialog);

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
    let id = TODO.createList(title);
    displayListItems();
    changeScreen(id);
    createListDialog.close();
  }
}

// renameList
renameListForm.addEventListener("submit", renameList);
let newListTitle = createListForm.elements["list-title"];
newListTitle.addEventListener("input", (e) => {
  let title = newListTitle.value;

  // validate form input;
  if (title.trim() === "") {
    newListTitle.setCustomValidity("Input a valid title");
  } else if (title.length >= 20) {
    newListTitle.setCustomValidity("Title is too long");
  } else {
    newListTitle.setCustomValidity("");
  }
});

function renameList(e) {
  e.preventDefault();
  console.log("called");
  let form = e.currentTarget;
  let listTitle = form.elements["new-title"];
  let title = listTitle.value;

  if (title.trim() === "") {
    listTitle.setCustomValidity("Input a valid title");
    listTitle.reportValidity();
    return;
  }

  // validate form input
  if (listTitle.checkValidity()) {
    let screen = document.querySelector(".current-screen");
    let id = screen.dataset.listId;
    id = Number(id);
    TODO.renameList(id, title);
    displayListItems();
    changeScreen(id);
    renameListDialog.close();
  }
}

function displayListItems() {
  const lists = TODO.lists;
  const listsContainer = document.querySelector(".list-items");
  listsContainer.textContent = "";

  for (let i = 0; i < lists.length; i++) {
    let list = lists[i];
    let title = list.name;
    let listId = list.id;
    const listItemLi = document.createElement("li");
    listItemLi.classList.add("list-item", "title");
    listItemLi.dataset.listId = listId;

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
    `.list-item[data-list-id='${index}']`
  );
  newActiveScreenLi.classList.add("active");
}

function displayScreen(e) {
  let listContainer = e.currentTarget;
  let listId = listContainer.dataset.listId;
  console.log(listId);
  removeActiveListContainer();

  addActiveListContainer(listId);
  changeScreen(listId);
}

// create screen
function changeScreen(listId) {
  listId = Number(listId);
  let list;
  try {
    list = TODO.getListById(listId);
  } catch (error) {
    console.log(error);
    return;
  }

  const screen = document.querySelector(".current-screen");
  removeActiveListContainer();
  screen.classList.remove("hidden");
  const emptyScreen = document.querySelector(".empty-screen");
  emptyScreen.classList.add("hidden");
  screen.dataset.listId = listId;

  const listTodo = TODO.getListToDo(listId);

  if (listTodo.length === 0) {
    createEmptyScreen();
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
  screenCreateToDoBtn.dataset.activeListId = listId;
  titleContainer.textContent = list.name;
  addActiveListContainer(listId);
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
  screenCreateToDoBtn.dataset.activeListId = "none"
  const todoItemContainer = screen.querySelector(".todo-items");
  todoItemContainer.textContent = "";
  const emptyScreen = document.querySelector(".empty-screen");
  emptyScreen.classList.remove("hidden");
}

// deleting the current list displayed on the screen
function deleteList(e) {
  const screen = document.querySelector(".current-screen");
  let currentListId =
    document.querySelector(".current-screen").dataset.listId;
    currentListId = Number(currentListId);
    if (Number.isNaN(currentListId)) return;
  console.log(currentListId);
  const containingLi = document.querySelector(
    `.list-item[data-list-id='${currentListId}']`
  );
  const listsContainer = document.querySelector(".list-items");
  listsContainer.removeChild(containingLi);
  const lists = listsContainer.querySelectorAll(".list-item");
  if (lists.length === 0) {
    createEmptyListScreen();
    screen.dataset.listIndex = "none";
  } else {
    const lastList = lists.item(lists.length - 1);
    const lastListId = lastList.dataset.listId;
    changeScreen(lastListId);
  }


  TODO.deleteList(currentListId);
  // let pos = displayedList.indexOf(currentListId);
  // displayedList.splice(pos, 1);
  closeDialog(e);
}
