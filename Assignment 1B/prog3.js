//Fuction takes in month and day for a birthday and cal the next birth date
//Default is my birthday (May 17)
function nextBirthCal(month = 5, day=17){
    //Gets the current time
    let currentDate = new Date();
    //cals the next birth date this year
    let nextBirth = new Date(currentDate.getFullYear(),month-1,day);
    //gets the date in millseconds
    let diff = nextBirth - currentDate;
    //This If statement checks if the birth date is in and the past then +1 to year as it would occor next year
    if(diff < 0){
        nextYear = currentDate.getFullYear() + 1;
        nextBirth = nextBirth.setFullYear(nextYear);
        diff = nextBirth - currentDate;
    }
    //Does the Math to get the time till the next Birth date
    let weeksRemaining = Math.floor(diff/1000/60/60/24/7);
    let dayRemaining = Math.floor((diff/1000/60/60/24)) % 7;
    let hourRemaining = Math.floor((diff/1000/60/60)) % 24;
    let minRemaining = Math.floor((diff/1000/60)) % 60;
    let secRemaining = Math.floor((diff/1000)) %60;
    //outputs the time till the next birth date
    console.log(`There are ${weeksRemaining} Weeks, ${dayRemaining} Days, ${hourRemaining} Hours, ${minRemaining} Minutes, and ${secRemaining} Seconds until your birthday!`);
}
nextBirthCal(1,5);
/*
    https://www.timeanddate.com/date/durationresult.html?m1=1&d1=9&y1=2026&m2=01&d2=05&y2=2027
    Use for checking accurcy

    https://www.w3schools.com/jsref/jsref_obj_date.asp
    Helped with the Date funcations
    
*/
