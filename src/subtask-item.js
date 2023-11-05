export class SubTaskItem {
  #title;
  #done = false;
  #id = Date.now();

  #isValidString(string) {
    if (typeof string !== "string") return false;
    if (string.trim() === "") return false;

    return true;
  }

  get title() {
    return this.#title;
  }

  set title(titleValue) {
    if (!this.#isValidString(titleValue)) {
        throw new TypeError("Invalid input. Must be a non-empty string");
    }

    this.#title = titleValue;
  }

  get done() {
    return this.#done;
  }

  toggleDone() {
    this.#done = !this.#done;
  }

  get id() {
    return this.#id;
  }
}
