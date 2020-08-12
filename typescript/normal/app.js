"use strict";
const num1Element = document.getElementById("num1");
const num2Element = document.getElementById("num2");
const buttonElement = document.querySelector("button");
const numResults = [];
const stringResults = [];
;
function add(num1, num2) {
    if (typeof num1 === "number" && typeof num2 === "number") {
        return num1 + num2;
    }
    else if (typeof num1 === "string" && typeof num2 === "string") {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
buttonElement.addEventListener("click", function () {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    numResults.push(result);
    const stringresult = add(num1, num2);
    stringResults.push(stringresult);
    printResult({ val: result, timeStamp: new Date() });
    console.log(numResults, stringResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('It worked!');
    }, 1000);
});
myPromise.then((result) => {
    console.log(result.split(' '));
});
console.log(add(1, 6));
// console.log(add('1', '6'));
