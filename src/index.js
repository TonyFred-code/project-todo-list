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
  isSameWeek,
} from "date-fns";
import listIconSrc from "./icons/format-list-bulleted.svg";
// todo import prioritizedIconImgSrc from './icons/';
import overDueIconImgSrc from "./icons/layers-triple-outline.svg";
import todayIconSrc from "./icons/calendar-today.svg";
import allIconSrc from "./icons/calendar-month-outline.svg";
import currentWeekIconSrc from "./icons/calendar-range.svg";
// import { ta } from "date-fns/locale";
// let today = Date.now();
// let date =  new Date("2023-12-05");
// console.log(new Date(date))
// console.log(new Date(today))
// console.log(isPast(date));
// console.log(isSameWeek(today, date));

const TODO = new ToDo();
// create default list - tutorial
// const displayedList = [];

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
  const currentWeekImg = createImg(currentWeekIconSrc);
  const overDueIconImg = createImg(overDueIconImgSrc);

  document.querySelector(".icon-all").appendChild(allIconImg);
  document.querySelector(".icon-today").appendChild(todayIconImg);
  document.querySelector(".icon-current-week").appendChild(currentWeekImg);
  document.querySelector(".icon-overdue").appendChild(overDueIconImg);
}

iconCreations();

// NAV OPERATION FOR SMALLER SCREENS
const openCloseNavBtn = document.querySelector(".open-close-nav");
const nav = document.querySelector("nav");
openCloseNavBtn.addEventListener("click", (e) => {
  let elm = e.currentTarget;
  let state = elm.dataset.state;
  if (state === "closed") {
    nav.classList.add("show");
    elm.dataset.state = "opened";
  } else {
    nav.classList.remove("show");
    elm.dataset.state = "closed";
  }
});

// SCREEN VIEW AND FILTERING
const screen = document.querySelector(".current-screen");
const filters = document.querySelector(".filters");
const viewAll = filters.querySelector("[data-show='all']");
const viewToday = filters.querySelector("[data-show='today']");
const viewCurrentWeek = filters.querySelector("[data-show='current-week']");
const viewOverdue = filters.querySelector("[data-show='overdue']");

viewAll.addEventListener("click", (e) => {
  removeActiveFilter();

  addActiveFilter(e);
  if (screen.classList.contains("hidden")) {
    createEmptyListScreen();
    return;
  }

  const listId = Number(screen.dataset.listId);
  renderTodoItems(listId, "all");
});

viewToday.addEventListener("click", (e) => {
  removeActiveFilter();

  addActiveFilter(e);

  if (screen.classList.contains("hidden")) {
    createEmptyListScreen();
    return;
  }

  const listId = Number(screen.dataset.listId);
  renderTodoItems(listId, "today");
});

viewCurrentWeek.addEventListener("click", (e) => {
  removeActiveFilter();

  addActiveFilter(e);

  if (screen.classList.contains("hidden")) {
    createEmptyListScreen();
    return;
  }

  const listId = Number(screen.dataset.listId);
  renderTodoItems(listId, "current-week");
});

viewOverdue.addEventListener("click", (e) => {
  removeActiveFilter();
  addActiveFilter(e);

  if (screen.classList.contains("hidden")) {
    createEmptyListScreen();
    return;
  }

  const listId = Number(screen.dataset.listId);
  renderTodoItems(listId, "overdue");
});

function removeActiveFilter() {
  const filterBtns = filters.querySelectorAll("button");
  filterBtns.forEach((filterBtn) => {
    filterBtn.classList.remove("active");
  });
}

function addActiveFilter(e) {
  let elm = e.currentTarget;
  let filter = elm.dataset.show;

  let filterBtn = filters.querySelector(`[data-show='${filter}']`);
  if (filterBtn === null) {
    throw new Error("Invalid assignment to null");
  }

  filterBtn.classList.add("active");
}

// DIALOGS

const editTodoItemDialog = document.querySelector(".edit-todo-item");
const editTodoItemForm = editTodoItemDialog.querySelector("form");
const submitTodoEditBtn = editTodoItemForm.querySelector(".submit");
const closeTodoItemEdit = editTodoItemDialog.querySelector(".cancel");
const discardCreateTodoChanges = document.querySelector(".discard-todo-create");
const discardCreateChanges = discardCreateTodoChanges.querySelector(".cancel");
const saveCreateChanges = discardCreateTodoChanges.querySelector(".confirm");

const confirmChangesDiscardDialog = document.querySelector(
  ".confirm-changes-discard"
);
const discardChangesBtn = confirmChangesDiscardDialog.querySelector(".cancel");
const saveChangesBtn = confirmChangesDiscardDialog.querySelector(".confirm");

const todoDetailsViewDialog = document.querySelector(".todo-details");
const closeDetailsView = todoDetailsViewDialog.querySelector(".close");

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

closeTodoItemEdit.addEventListener("click", (e) => {
  let modified = editTodoItemForm.dataset.modified;

  if (modified === "true") {
    confirmChangesDiscardDialog.showModal();
  } else {
    closeDialog(e);
  }
});
discardChangesBtn.addEventListener("click", (e) => {
  editTodoItemDialog.close();
  closeDialog(e);
});

discardCreateChanges.addEventListener("click", (e) => {
  createTodoDialog.close();
  closeDialog(e);
});
saveChangesBtn.addEventListener("click", (e) => {
  closeDialog(e);

  submitTodoEditBtn.click();
});
saveCreateChanges.addEventListener("click", (e) => {
  closeDialog(e);

  createToDoBtn.click();
});
closeDetailsView.addEventListener("click", closeDialog);
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
cancelCreateTodoBtn.addEventListener("click", (e) => {
  let modified = createTodoForm.dataset.modified;
  if (modified === "true") {
    discardCreateTodoChanges.showModal();
  } else {
    closeDialog(e);
  }
});
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
    updateLocalStorage();
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
    updateLocalStorage();
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

  renderTodoItems(listId, "all");

  removeActiveFilter();
  viewAll.classList.add("active");
  const titleContainer = screen.querySelector(".current-screen-title");
  const screenCreateToDoBtn = screen.querySelector(".add-task");
  screenCreateToDoBtn.dataset.activeListId = listId;
  titleContainer.textContent = list.name;
  addActiveListContainer(listId);
}

function createEmptyScreen(filterState = "all") {
  const toDoContainer = document.querySelector(".todo-items");
  toDoContainer.textContent = "";
  const li = document.createElement("li");

  switch (filterState) {
    case "all":
      li.textContent = `
      You have not created any todo items. Click the round button below to do so.`;
      break;

    case "today":
      li.textContent = `
        You have no todo items due today. Jolly is today.`;
      break;

    case "overdue":
      li.textContent = `
          You have no todo items that are overdue. Great Job!!!.`;
      break;

    case "current-week":
      li.textContent = `
        You have no todo items due this week. Armistice`;
      break;
    default:
      li.textContent += "Click the button below to create todo items";
      break;
  }

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
  updateLocalStorage();
  // let pos = displayedList.indexOf(currentListId);
  // displayedList.splice(pos, 1);
  closeDialog(e);
}

// CREATING TODO ITEM
createTodoDialog.addEventListener("close", (e) => {
  createTodoForm.dataset.modified = false;
  const todoTitle = createTodoForm.elements["title"];
  todoTitle.value = "";
  todoTitle.dataset.modified = "false";
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
  todoTitle.dataset.modified = "true";
  createTodoForm.dataset.modified = true;
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

const todoPriority = createTodoForm.elements["priority"];
todoPriority.forEach((todoPriorityElm) => {
  todoPriorityElm.addEventListener("input", (e) => {
    createTodoForm.dataset.modified = true;
  });
});
const todoDueDate = createTodoForm.elements["due-date"];

todoDueDate.addEventListener("change", (e) => {
  let value = todoDueDate.value;
  createTodoForm.dataset.modified = true;

  const labelText = createTodoForm.querySelector(".due-date-text");
  let date = new Date(value);
  if (value === "") {
    labelText.textContent = "Set due date";
  } else if (isToday(date)) {
    labelText.textContent = "Today";
  } else if (isTomorrow(date)) {
    labelText.textContent = "Tomorrow";
  } else if (isYesterday(date)) {
    labelText.textContent = "Yesterday";
  } else {
    labelText.textContent = intlFormat(date, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }
});

const todoListsSelect = createTodoForm.elements["lists"];
todoListsSelect.addEventListener("change", (e) => {
  createTodoForm.dataset.modified = true;
});

const todoNotes = createTodoForm.elements["notes"];
todoNotes.addEventListener("input", (e) => {
  createTodoForm.dataset.modified = true;
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

  TODO.createToDo(
    activeListId,
    todoTitleValue,
    todoNotesValue,
    todoDueDateValue,
    todoPriorityValue,
    []
  );

  let shownListId = Number(screen.dataset.listId);

  renderTodoItems(shownListId);
  updateLocalStorage();
  createTodoDialog.close();
}

function renderTodoItems(listId, filter = "all") {
  let listName = TODO.getListById(listId).name;
  let todoItems;

  removeActiveFilter();

  switch (filter) {
    case "all":
      todoItems = TODO.getListToDo(Number(listId));
      viewAll.classList.add("active");
      if (todoItems.length === 0) {
        createEmptyScreen(filter);
        return;
      }
      break;

    case "overdue":
      todoItems = TODO.getListOverdueTodoItems(Number(listId));
      viewOverdue.classList.add("active");
      if (todoItems.length === 0) {
        createEmptyScreen(filter);
        return;
      }
      break;

    case "today":
      todoItems = TODO.getListTodoDueToday(Number(listId));
      viewToday.classList.add("active");
      if (todoItems.length === 0) {
        createEmptyScreen(filter);
        return;
      }
      break;

    case "current-week":
      todoItems = TODO.getListTodoDueThisWeek(Number(listId));
      viewCurrentWeek.classList.add("active");
      if (todoItems.length === 0) {
        createEmptyScreen(filter);
        return;
      }
      break;

    default:
      todoItems = [];
      createEmptyScreen();
      return;
  }

  const todoItemsContainer = document.querySelector(".todo-items");
  todoItemsContainer.textContent = "";

  for (let todoItem of todoItems) {
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
    checkBox.checked = todoItem.done;
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
    div2.dataset.targetDialog = "todo-details";
    div2.dataset.todoId = todoItem.id;
    div2.addEventListener("click", (e) => {
      const currentListId = Number(
        document.querySelector(".current-screen").dataset.listId
      );
      const todoId = Number(e.currentTarget.dataset.todoId);
      let todo = TODO.getListTodoItem(todoId, currentListId);

      const todoTitleView =
        todoDetailsViewDialog.querySelector(".todo-title .value");
      todoTitleView.textContent = todo.title;
      const todoPriorityView = todoDetailsViewDialog.querySelector(
        ".todo-priority .value"
      );
      todoPriorityView.textContent = titleCase(todo.priority);
      const todoNotesView =
        todoDetailsViewDialog.querySelector(".todo-notes .value");
      todoNotesView.textContent =
        todo.note.trim() === "" ? "NO NOTES" : todo.note;
      const todoDueDateView = todoDetailsViewDialog.querySelector(
        ".todo-due-date .value"
      );
      if (todoItem.dueDate === "none") {
        todoDueDateView.textContent = "NO DUE DATE";
      } else {
        let date = new Date(todoItem.dueDate);
        if (isToday(date)) {
          todoDueDateView.textContent = "TODAY";
        } else if (isYesterday(date)) {
          todoDueDateView.textContent = "YESTERDAY";
        } else if (isTomorrow(date)) {
          todoDueDateView.textContent = "TOMORROW";
        } else {
          todoDueDateView.textContent = `${intlFormat(date, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}`;
        }
      }

      const todoDoneStatusView = todoDetailsViewDialog.querySelector(
        ".todo-done-status .value"
      );
      todoDoneStatusView.textContent = todo.done
        ? "COMPLETED"
        : "NOT COMPLETED";
      const todoListView =
        todoDetailsViewDialog.querySelector(".todo-list .value");
      todoListView.textContent = titleCase(listName);
      openDialog(e);
    });
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
          weekday: "short",
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
    deleteBtn.addEventListener("click", (e) => {
      confirmTodoDelete.dataset.todoId = e.currentTarget.dataset.todoId;

      openDialog(e);
    });
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.classList.add("edit-todo");
    editBtn.dataset.todoId = todoItem.id;
    editBtn.dataset.targetDialog = "edit-todo-item";

    editBtn.addEventListener("click", (e) => {
      let listId = Number(screen.dataset.listId);
      let todoId = Number(e.currentTarget.dataset.todoId);
      let todo = TODO.getListTodoItem(todoId, listId);

      const todoTitle = editTodoItemForm.elements["new-title"];
      todoTitle.value = todo.title;

      const todoPriority = editTodoItemForm.elements["new-priority"];

      if (todoItem.priority === "low") {
        todoPriority.value = "low";
      } else if (todoItem.priority === "medium") {
        todoPriority.value = "medium";
      } else if (todoItem.priority === "high") {
        todoPriority.value = "high";
      } else {
        todoPriority.value = "";
      }

      const todoDueDate = editTodoItemForm.elements["new-due-date"];

      if (todoItem.dueDate === "none") {
        todoDueDate.value = "";
      } else {
        todoDueDate.value = todoItem.dueDate;
      }

      const listsSelect = editTodoItemForm.elements["lists-created"];
      const activeListId = screen.dataset.listId;
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

      const todoDueDateEdit = editTodoItemForm.elements["new-due-date"];
      let value = todoDueDateEdit.value;

      const labelText = editTodoItemForm.querySelector(".new-due-date-text");
      let date = new Date(value);
      if (value === "") {
        labelText.textContent = "Set due date";
      } else if (isToday(date)) {
        labelText.textContent = "Today";
      } else if (isTomorrow(date)) {
        labelText.textContent = "Tomorrow";
      } else if (isYesterday(date)) {
        labelText.textContent = "Yesterday";
      } else {
        labelText.textContent = intlFormat(date, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
      }

      const todoNotes = editTodoItemForm.elements["new-notes"];
      if (todoItem.note === "" || todoItem.note === "none") {
        todoNotes.value = "";
      } else {
        todoNotes.value = todoItem.note;
      }

      editTodoItemForm.dataset.listId = listId;
      editTodoItemForm.dataset.todoId = todoId;
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
  updateLocalStorage();
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

// EDITING A TODO ITEM
editTodoItemDialog.addEventListener("close", (e) => {
  editTodoItemForm.dataset.modified = false;
  editTodoItemForm.dataset.todoId = "";
  editTodoItemForm.dataset.listId = "";

  const todoTitle = editTodoItemForm.elements["new-title"];
  todoTitle.value = "";
  todoTitle.modified = false;
  const todoPriority = editTodoItemForm.elements["new-priority"];
  for (let node of todoPriority) {
    node.checked = false;
    node.dataset.modified = false;
  }
  todoPriority.value = "";
  const todoDueDate = editTodoItemForm.elements["new-due-date"];
  todoDueDate.value = "";
  todoDueDate.dataset.modified = false;
  const todoNote = editTodoItemForm.elements["new-notes"];
  todoNote.value = "";
  todoNote.modified = false;

  const listEdit = editTodoItemForm.elements["lists-created"];
  listEdit.dataset.modified = false;
  listEdit.textContent = "";
});

editTodoItemForm.addEventListener("submit", submitTodoEdit);
const todoTitleEdit = editTodoItemForm.elements["new-title"];
todoTitleEdit.addEventListener("input", (e) => {
  editTodoItemForm.dataset.modified = true;
  todoTitleEdit.dataset.modified = true;
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

const todoPriorityEdit = editTodoItemForm.elements["new-priority"];
todoPriorityEdit.forEach((todoPriorityElm) => {
  todoPriorityElm.addEventListener("input", (e) => {
    todoPriorityElm.dataset.modified = true;
    editTodoItemForm.dataset.modified = true;
  });
});

const todoDueDateEdit = editTodoItemForm.elements["new-due-date"];
todoDueDateEdit.addEventListener("change", (e) => {
  todoDueDateEdit.dataset.modified = true;
  editTodoItemForm.dataset.modified = true;

  let value = todoDueDateEdit.value;

  const labelText = editTodoItemForm.querySelector(".new-due-date-text");
  let date = new Date(value);
  if (value === "") {
    labelText.textContent = "Set due date";
  } else if (isToday(date)) {
    labelText.textContent = "Today";
  } else if (isTomorrow(date)) {
    labelText.textContent = "Tomorrow";
  } else if (isYesterday(date)) {
    labelText.textContent = "Yesterday";
  } else {
    labelText.textContent = intlFormat(date, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }
});

const listEdit = editTodoItemForm.elements["lists-created"];
listEdit.addEventListener("change", (e) => {
  listEdit.dataset.modified = true;
  editTodoItemForm.dataset.modified = true;
});

const todoNoteEdit = editTodoItemForm.elements["new-notes"];
todoNoteEdit.addEventListener("input", (e) => {
  todoNoteEdit.dataset.modified = true;
  editTodoItemForm.dataset.modified = true;
});

function submitTodoEdit(e) {
  e.preventDefault();
  let form = e.currentTarget;

  let todoId, listId;

  if (form.dataset.todoId === "" || form.dataset.listId === "") {
    return;
  } else {
    todoId = Number(form.dataset.todoId);
    listId = Number(form.dataset.listId);
  }

  const todoTitle = form.elements["new-title"];
  const todoTitleValue = todoTitle.value;
  console.log(todoTitle, todoTitle.value);
  const todoPriority = form.elements["new-priority"];
  let todoPriorityValue = todoPriority.value;
  console.log(todoPriority, todoPriority.value);
  const todoDueDate = form.elements["new-due-date"];
  let todoDueDateValue =
    todoDueDate.value === "" ? "none" : `${todoDueDate.value}`;
  console.log(todoDueDate, todoDueDateValue);
  const todoItemList = form.elements["lists-created"];
  const todoItemListValue = Number(todoItemList.value);
  console.log(todoItemList, todoItemListValue);
  const todoNotes = form.elements["new-notes"];
  const todoNotesValue = todoNotes.value;
  console.log(todoNotes, todoNotesValue);

  if (todoTitleValue.trim() === "") {
    todoTitle.setCustomValidity("Input a valid title");
    todoTitle.reportValidity();
    return;
  }

  if (todoPriorityValue === "") {
    todoPriorityValue = "none";
  }

  if (todoTitle.dataset.modified === "true") {
    try {
      TODO.changeTodoTitle(todoTitleValue, todoId, listId);
    } catch (err) {
      console.log(err);
    }
  }

  for (let todoPriorityElm of todoPriority) {
    if (todoPriorityElm.dataset.modified === "true") {
      try {
        TODO.changeTodoPriority(todoPriorityValue, todoId, listId);
      } catch (err) {
        console.log(err);
      }
      break;
    }
  }

  if ((todoDueDate.dataset.modified = "true")) {
    try {
      TODO.changeTodoDueDate(todoDueDateValue, todoId, listId);
    } catch (err) {
      console.log(err);
    }
  }

  if (todoItemList.dataset.modified === "true") {
    if (listId !== todoItemListValue) {
      TODO.reassignTodoItem(todoId, listId, todoItemListValue);
    }
  }

  if ((todoNotes.dataset.modified = "true")) {
    try {
      TODO.changeTodoNote(todoNotesValue, todoId, listId);
    } catch (err) {
      console.log(err);
    }
  }

  renderTodoItems(listId);
  updateLocalStorage();
  editTodoItemDialog.close();
}

// LOCAL STORAGE
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function updateLocalStorage() {
  if (storageAvailable("localStorage")) {
    console.log("can use local storage");
    // localStorage.removeItem("visited");
    localStorage.clear();
    const lists = TODO.lists;
    for (let list of lists) {
      let listId = list.id;
      let name = list.name;
      let todoItems = list.todoItems;
      console.log(listId);
      const listObj = {
        name,
        todoItems: [],
      };

      for (let todoItem of todoItems) {
        let todoTitle = todoItem.title;
        let todoDueDate = todoItem.dueDate;
        let todoNotes = todoItem.note;
        let todoDoneStatus = todoItem.done;
        let todoPriority = todoItem.priority;
        let todo = {
          todoTitle,
          todoDueDate,
          todoNotes,
          todoDoneStatus,
          todoPriority,
        };
        listObj.todoItems.push(todo);
      }

      localStorage.setItem(listId, JSON.stringify(listObj));
    }

    localStorage.setItem("visited", "true");
  }
}

if (!localStorage.getItem("visited")) {
  createTutorial();
  updateLocalStorage();
} else {
  preLoadFromLocalStorage();
}

function createTutorial() {
  let id = TODO.createList("Tutorial");
  // extend text found in tutorial
  let todoItem1 = {
    name: "Using the todo app",
    priority: "high",
    dueDate: "none",
    notes: `
    Please follow through this tutorial to get an overview of this app's usage.`
  }

  let todoItem2 = {
    name: "Creating a list",
    priority: "high",
    dueDate: "none",
    notes: `
    Lists are groupings of todo items. Todo Items can only be created after creating a list item.
    Click on the "Add List" button in the nav to create a list. Click menu bar to open nav in mobile devices and tablets. `
  }

  let todoItem3 = {
    name: "Creating a todo item",
    priority: "high",
    dueDate: "none",
    notes: `
    Todo Items can have a due date, priority, title and a description. You can also mark as complete. To create one, click the plus button by the bottom right of the screen. You must create a list before being able to create a todo item.`
  }

  let todoItem4 = {
    name: "Deleting a list",
    priority: "high",
    dueDate: "none",
    notes: `
    Lists when deleted will be completely removed. It will also delete every todo item under it. Click the trash can icon next to the list name on the screen to delete the icon to delete the current list. After deleting a list, a new screen will be rendered using the lists you've previously created. If there are no lists left, an empty screen will be displayed. `
  }

 let todoItem5 = {
    name: "Deleting a todo item",
    priority: "high",
    dueDate: "none",
    notes: `
   Todo items can be deleted by clicking the trash icon next to it. Deleting a todo is non-reversible.`
  }

  let todoItem6 = {
    name: "Editing a todo item",
    priority: "high",
    dueDate: "none",
    notes: `
   Todo items can be edited by clicking the pen icon next to it.`
  }

  let todoItem7 = {
    name: "Rename a List",
    priority: "high",
    dueDate: "none",
    notes: `
   Renaming a list can be done by clicking the pen icon next to the title on the screen.`
  }


  TODO.createToDo(id, todoItem1.name, todoItem1.notes, todoItem1.dueDate, todoItem1.priority, []);

  TODO.createToDo(id, todoItem2.name, todoItem2.notes, todoItem2.dueDate, todoItem2.priority, []);

  TODO.createToDo(id, todoItem3.name, todoItem3.notes, todoItem3.dueDate, todoItem3.priority, []);

  TODO.createToDo(id, todoItem4.name, todoItem4.notes, todoItem4.dueDate, todoItem4.priority, []);

  TODO.createToDo(id, todoItem5.name, todoItem5.notes, todoItem5.dueDate, todoItem5.priority, []);

  TODO.createToDo(id, todoItem7.name, todoItem7.notes, todoItem7.dueDate, todoItem7.priority, []);

  TODO.createToDo(id, todoItem6.name, todoItem6.notes, todoItem6.dueDate, todoItem6.priority, []);
  localStorage.setItem("visited", "true");


  displayListItems();
  changeScreen(id);
  renderTodoItems(id);
}

function preLoadFromLocalStorage() {
  localStorage.removeItem("visited");
  if (localStorage.length === 0) {
    createEmptyListScreen();
  } else {
    let lastId = 0;
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let { name, todoItems } = JSON.parse(localStorage.getItem(key));

      let listId = TODO.createList(name);
      lastId = listId;
      for (let todoItem of todoItems) {
        let title = todoItem.todoTitle;
        let priority = todoItem.todoPriority;
        let dueDate = todoItem.todoDueDate;
        let doneStatus = todoItem.todoDoneStatus;
        let notes = todoItem.todoNotes;
        TODO.createToDo(
          listId,
          title,
          notes,
          dueDate,
          priority,
          [],
          doneStatus
        );
      }
    }

    displayListItems();
    changeScreen(lastId);
    renderTodoItems(lastId);
  }
  localStorage.setItem("visited", "true");
}
