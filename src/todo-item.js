import { isValid } from "date-fns";
import { SubTaskItem } from "./subtask-item";

export class ToDoItem {
  #title;
  #notes;
  #dueDate;
  #priority;
  #subTasks = [];
  #done = false;

  #isValidString(string) {
    if (typeof string !== "string") return false;
    if (string.trim() === "") return false;

    return true;
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
    if (!this.#isValidString(noteValue)) {
      throw new TypeError(
        "Invalid noteValue. Notes must be a non-empty string"
      );
    }

    this.#notes = noteValue;
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(dateValue) {
    if (!isValid(new Date(dateValue))) {
      throw new TypeError("Invalid date value. Must be a date object or a valid date string format");
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
        throw new TypeError("Invalid title input. Must be a non-empty string")
    }

    let subtask = new SubTaskItem();
    subtask.title = title;
    this.#subTasks.push(subtask);
  }

  get done() {
    return this.#done;
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
