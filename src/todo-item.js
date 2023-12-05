import { isValid } from "date-fns";
import { SubTaskItem } from "./subtask-item";

export class ToDoItem {
  #title;
  #notes;
  #dueDate;
  #priority;
  #subTasks = [];
  #done = false;
  #id;

  #createId() {
    return Date.now();
  }

  #isString(string) {
    return typeof string === "string";
  }

  #isValidString(string) {
    if (!this.#isString(string) || this.#isEmptyString(string)) return false;

    return true;
  }

  #isEmptyString(string) {
    return string.trim() === "";
  }

  constructor() {
    this.#id = this.#createId();
  }

  getItemId() {
    return this.#id;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  set title(titleValue) {
    this.#title = titleValue;
  }

  get note() {
    return this.#notes;
  }

  set note(noteValue) {


    if (!this.#isString(noteValue)) {
      throw new TypeError(
        "Invalid noteValue. Notes must be a string"
      );
    }

    this.#notes = noteValue;
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(dateValue) {
    if (this.#isEmptyString(dateValue) || dateValue === "none") {
      this.#dueDate = "none";
      return;
    } else if (!isValid(new Date(dateValue))) {
      throw new TypeError(
        `Invalid date value. Must be a date object or a valid date string format - ${dateValue}`
      );
    }

    this.#dueDate = dateValue;
  }

  get priority() {
    if (!this.#priority) return "none";
    return this.#priority;
  }

  #isValidPriority(priorityVal) {
    let validPriorities = ["none", "medium", "low", "high"];
    priorityVal = priorityVal.toLowerCase();
    for (let i = 0; i < validPriorities.length; i++) {
      if (priorityVal === validPriorities[i]) return true;
    }

    return false;
  }

  set priority(priorityVal) {
    if (!this.#isValidString(priorityVal)) {
      throw new TypeError("Invalid string input. Must be a non-empty string");
    }

    if (!this.#isValidPriority(priorityVal)) {
      throw new TypeError(
        "Not a valid priority. Valid are 'none', 'low', 'medium', and 'high'. "
      );
    }

    this.#priority = priorityVal;
  }

  get subtasks() {
    return this.#subTasks;
  }

  addSubtask(title) {
    if (!this.#isValidString(title)) {
      throw new TypeError("Invalid title input. Must be a non-empty string");
    }

    let subtask = new SubTaskItem();
    subtask.title = title;
    this.#subTasks.push(subtask);
  }

  deleteSubtask(taskIndex) {
    let len = this.#subTasks.length;
    if (len === 0) {
      throw new Error("Cannot delete what hasn't been created");
    }

    if (typeof taskIndex !== "number" || taskIndex < 0 || taskIndex >= len) {
      throw new Error("Invalid index number");
    }

    this.#subTasks.splice(taskIndex, 1);
  }

  get done() {
    return this.#done;
  }

  set done(state) {
    if (state !== false && state !== true) {
      throw new TypeError("Invalid state");
    }

    this.#done = state;
  }

  toggleDone() {
    this.#done = !this.#done;
  }

  markDone() {
    this.#done = true;
  }

  markNotDone() {
    this.#done = false;
  }
}
