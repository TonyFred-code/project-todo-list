import overDueIconImgSrc from "./icons/layers-triple-outline.svg";
import todayIconSrc from "./icons/calendar-today.svg";
import allIconSrc from "./icons/calendar-month-outline.svg";
import currentWeekIconSrc from "./icons/calendar-range.svg";
import { createImg } from "./createImg";

export function iconCreations() {
    const allIconImg = createImg(allIconSrc);
    const todayIconImg = createImg(todayIconSrc);
    const currentWeekImg = createImg(currentWeekIconSrc);
    const overDueIconImg = createImg(overDueIconImgSrc);

    document.querySelector(".icon-all").appendChild(allIconImg);
    document.querySelector(".icon-today").appendChild(todayIconImg);
    document.querySelector(".icon-current-week").appendChild(currentWeekImg);
    document.querySelector(".icon-overdue").appendChild(overDueIconImg);
  }