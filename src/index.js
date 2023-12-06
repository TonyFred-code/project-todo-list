import "./style.css";
import { ToDo } from "./todo";
import {
  nextDay,
  lastDayOfMonth,
  lightFormat,
  daysInWeek,
  intlFormat,
  isSameYear,
  isToday,
  isYesterday,
  isTomorrow,
} from "date-fns";
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

function titleCase(sentence) {
  if (typeof sentence !== "string" || sentence.trim() === "") {
    throw new Error("Invalid input type: input must be a sentence");
  }

  let words = sentence.trim().split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  let titleCasedSentence = words.join(" ");
  return titleCasedSentence;
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

const renameListDialog = document.querySelector(
  "dialog.rename-list-item-dialog"
);
const renameListForm = renameListDialog.querySelector("form");
const openRenameListBtn = document.querySelector(".rename-list");
const cancelRenameListBtn = renameListDialog.querySelector(".cancel");
const renameListBtn = renameListDialog.querySelector(".rename");

const createTodoDialog = document.querySelector(".create-todo-item");
const createTodoForm = createTodoDialog.querySelector("form");
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
openCreateTodoBtn.addEventListener("click", (e) => {
  const listsSelect = createTodoForm.elements["lists"];
  const activeListId = document.querySelector(".current-screen").dataset.listId;
  const listsCreated = TODO.lists;
  listsSelect.textContent = "";
  listsCreated.forEach((list) => {
    const listName = titleCase(list.name);
    const optElm = document.createElement("option");
    optElm.value = list.id;
    if (Number(list.id) === Number(activeListId)) {
      optElm.selected = true;
    }
    optElm.textContent = listName;
    listsSelect.appendChild(optElm);
  });
  openDialog(e);
});
cancelCreateTodoBtn.addEventListener("click", closeDialog);
cancelTodoDelete.addEventListener("click", closeDialog);
openRenameListBtn.addEventListener("click", (e) => {
  let screen = document.querySelector(".current-screen");
  let activeListId = Number(screen.dataset.listId);
  if (Number.isNaN(activeListId)) return;
  let listName = TODO.getListById(activeListId).name;
  console.log(listName);
  let newNameInput = renameListForm.elements["new-title"];
  newNameInput.value = listName;
  openDialog(e);
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
    renderTodoItems(listId);
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
  screenCreateToDoBtn.dataset.activeListId = "none";
  const todoItemContainer = screen.querySelector(".todo-items");
  todoItemContainer.textContent = "";
  const emptyScreen = document.querySelector(".empty-screen");
  emptyScreen.classList.remove("hidden");
}

// deleting the current list displayed on the screen
function deleteList(e) {
  const screen = document.querySelector(".current-screen");
  let currentListId = document.querySelector(".current-screen").dataset.listId;
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

// CREATING TODO ITEM
createTodoDialog.addEventListener("close", (e) => {
  const todoTitle = createTodoForm.elements["title"];
  todoTitle.value = "";
  const todoPriority = createTodoForm.elements["priority"];
  for (let node of todoPriority) {
    node.checked = false;
  }
  todoPriority.value = "";
  const todoNotes = createTodoForm.elements["notes"];
  todoNotes.value = "";
  const todoDueDate = createTodoForm.elements["due-date"];
  todoDueDate.value = "";
  const todoDueDateText = createTodoForm.querySelector(".due-date-text");
  todoDueDateText.textContent = "Set Due Date";
});

createTodoForm.addEventListener("submit", createTodoItem);
const todoTitle = createTodoForm.elements["title"];
todoTitle.addEventListener("input", (e) => {
  let title = todoTitle.value;

  // validate form input;
  if (title.trim() === "") {
    todoTitle.setCustomValidity("Input a valid title");
  } else if (title.length >= 20) {
    todoTitle.setCustomValidity("Title is too long");
  } else {
    todoTitle.setCustomValidity("");
  }
});

const todoDueDate = createTodoForm.elements["due-date"];

todoDueDate.addEventListener("change", (e) => {
  let value = todoDueDate.value;
  if (value === "") return;

  const labelText = createTodoForm.querySelector(".due-date-text");
  let date = new Date(value);
  if (isToday(date)) {
    labelText.textContent = "Today";
  } else if (isTomorrow(date)) {
    labelText.textContent = "Tomorrow";
  } else if (isYesterday(date)) {
    labelText.textContent = "Yesterday";
  } else {
    labelText.textContent = intlFormat(date, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }
});

function createTodoItem(e) {
  e.preventDefault();
  const screen = document.querySelector(".current-screen");
  let form = e.currentTarget;
  const todoTitle = form.elements["title"];
  const todoTitleValue = todoTitle.value;
  console.log(todoTitle, todoTitle.value);
  const todoPriority = form.elements["priority"];
  let todoPriorityValue = todoPriority.value;
  console.log(todoPriority, todoPriority.value);
  const todoDueDate = form.elements["due-date"];
  let todoDueDateValue =
    todoDueDate.value === "" ? "none" : `${todoDueDate.value}`;
  console.log(todoDueDate, todoDueDate.value);
  const todoItemList = form.elements["lists"];
  const todoItemListValue = todoItemList.value;
  console.log(todoItemList, todoItemList.value);
  const todoNotes = form.elements["notes"];
  const todoNotesValue = todoNotes.value;
  console.log(todoNotes, todoNotes.value);

  if (todoTitleValue.trim() === "") {
    todoTitle.setCustomValidity("Input a valid title");
    todoTitle.reportValidity();
    return;
  }

  if (todoPriorityValue === "") {
    todoPriorityValue = "none";
  }

  const activeListId = Number(todoItemListValue);

  const todoId = TODO.createToDo(
    activeListId,
    todoTitleValue,
    todoNotesValue,
    todoDueDateValue,
    todoPriorityValue,
    []
  );

  let shownListId = Number(screen.dataset.listId);

  renderTodoItems(shownListId);

  createTodoDialog.close();
}

function renderTodoItems(listId) {
  let list = TODO.getListById(Number(listId));
  let listTodo = TODO.getListToDo(Number(listId));

  if (listTodo.length === 0) {
    createEmptyScreen();
    return;
  }
  console.log(list);
  console.log(listTodo);

  const todoItemsContainer = document.querySelector(".todo-items");
  todoItemsContainer.textContent = "";

  for (let todoItem of listTodo) {
    console.log(todoItem);
    const todoPriority = todoItem.priority;
    const todoItemLi = document.createElement("li");
    todoItemLi.classList.add("todo-item");
    todoItemLi.dataset.priority = todoPriority;
    // marker-label-container div and its content
    const div1 = document.createElement("div");
    div1.classList.add("marker-label-container");
    const label = document.createElement("label");
    label.classList.add("marker-container");
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.dataset.todoId = todoItem.id;
    checkBox.addEventListener("change", changeTodoDoneStat);
    const marker = document.createElement("span");
    marker.classList.add("marker");
    marker.dataset.done = "false";
    label.appendChild(checkBox);
    label.appendChild(marker);
    div1.appendChild(label);

    // todo-details-overview div and its content
    const div2 = document.createElement("div");
    div2.classList.add("todo-details-overview");
    const todoTitleDiv = document.createElement("div");
    todoTitleDiv.classList.add("todo-title");
    todoTitleDiv.textContent = todoItem.title;
    // date-subtask-view div
    const div3 = document.createElement("div");
    div3.classList.add("date-subtask-view");
    const span1 = document.createElement("span");
    span1.classList.add("todo-date-view");

    if (todoItem.dueDate === "none") {
      span1.textContent = "NO DUE DATE";
    } else {
      let date = new Date(todoItem.dueDate);
      if (isToday(date)) {
        span1.textContent = "DUE TODAY";
      } else if (isYesterday(date)) {
        span1.textContent = "DUE YESTERDAY";
      } else if (isTomorrow(date)) {
        span1.textContent = "DUE TOMORROW";
      } else {
        span1.textContent = `Due ${intlFormat(date, {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "2-digit",
        })}`;
      }
    }
    div3.appendChild(span1);

    div2.appendChild(todoTitleDiv);
    div2.appendChild(div3);

    // buttons
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-todo");
    deleteBtn.dataset.targetDialog = "todo-delete-confirm";
    deleteBtn.dataset.todoId = todoItem.id;
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (e) => {
      confirmTodoDelete.dataset.todoId = e.currentTarget.dataset.todoId;

      openDialog(e);
    });
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.classList.add("edit-todo");
    editBtn.dataset.targetDialog = "edit-todo-item";
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", (e) => {
      openDialog(e);
    });

    todoItemLi.appendChild(div1);
    todoItemLi.appendChild(div2);
    todoItemLi.appendChild(deleteBtn);
    todoItemLi.appendChild(editBtn);
    todoItemsContainer.appendChild(todoItemLi);
  }
}

// DELETING A TODO ITEM
confirmTodoDelete.addEventListener("click", deleteTodo);

function deleteTodo(e) {
  const currentListId = Number(
    document.querySelector(".current-screen").dataset.listId
  );
  let elm = e.currentTarget;
  const todoId = Number(elm.dataset.todoId);
  TODO.deleteTodoItem(currentListId, todoId);

  renderTodoItems(currentListId);
  todoDeleteConfirmDialog.close();
}

function changeTodoDoneStat(e) {
  const currentListId = Number(
    document.querySelector(".current-screen").dataset.listId
  );
  let elm = e.currentTarget;
  let state = elm.checked;
  const todoId = Number(elm.dataset.todoId);

  TODO.changeTodoDoneStatus(state, todoId, currentListId);
}
