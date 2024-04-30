const arr = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];

const indexOfOne = arr.indexOf(1);

console.log("This is the outer level");
console.group();
console.log("Level 2");
console.group();
console.log("Level 3");
console.warn("More of level 3");
console.groupEnd();
console.log("Back to level 2");
console.groupEnd();
console.log("Back to the outer level");

const string = "Hello World ##";

const replacedString = string.replace(/## /g, "## Hello ##");

console.log(replacedString);
