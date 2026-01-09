//Need to rewrite this program to be more dynamic, take inspo from Devin

const myNextBirthday = new Date("2026-05-17T00:00:00");
const currentDate = new Date();
let diff = myNextBirthday - currentDate;
let sec = Math.floor(diff /1000);
let min = Math.floor(sec /60);
let hour = Math.floor(min /60);
let day = Math.floor(hour /24);
let week = Math.floor(day /7);
let dayR = day % 7;
let hourR = hour %24;
let minR = min % 60;
let secR = sec %60;
console.log(`There are ${week} Weeks, ${dayR} Days, ${hourR} Hours, ${minR} Minutes, and ${secR}Seconds until my birthday!`);
