/*
* PHONEWORDS
* Write a function that will take a phone word (vanity number) and return the correct telephone number.
* The number pad looks like the following:
* https://en.wikipedia.org/wiki/Telephone_keypad#/media/File:Telephone-keypad2.svg
*
* RULES
* Given a phoneword:
* 1. Ignore any non-alphanumeric characters (), -, etc.
* 2. Keep any existing digits
* 3. Resolve a letter to a number according to the keypad image
* 4. All your code must be contained in the section outlined below
*/


var buttons = ["abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"] //DO NOT MODIFY


// YOU CAN ADD TO AND MODIFY THE CODE BELOW THIS LINE
//   |
//   V

function convertPhoneWord(phoneWord) {

    //Enter your code in this function body
    if(phoneWord == null || phoneWord == "" || phoneWord == undefined){ //checks if we have string to mutate
        return ""; // if not return blank
    }
    var phoneWordSafe = phoneWord; //dont want to play with the given string so we give it a safe
    result1 = phoneWordSafe.replace(/[^a-zA-Z0-9]/g, ""); //Keeps all lowercase a-z, keeps all uppercase A-Z, keeps all numbers 0-9
    resultFinale = result1.replace(/[a-z]/g, function (char) { //Takes all lowercase a-z, puts them through a fuction to make em uppercase
        return char.toUpperCase();}); 

    for(i=0;i<buttons.length;i++){ //for the number keypad nums
        var rmChar = new RegExp("["+buttons[i].toUpperCase()+"]", "g") //creates an uppercase index of what letters need to be replaced with number
        resultFinale = resultFinale.replace(rmChar, i+2) //replaces them with the correct num, have to have same name to iterate over
    }

    if(phoneWord != null || phoneWord != "" || phoneWord != undefined){ //just dobles checks
        return phoneWord = resultFinale; //returns finale result back to phoneword, we dont have to pass back to phoneword but whatever
    }
}

//    ^
//    |
//YOU CAN ADD TO OR MODIFY THE CODE ABOVE THIS LINE




// DO NOT CHANGE ANY CODE AFTER THIS LINE.
//     |
//     |
//     V

//helper functions...do not modify, but you can use them in your code

function isDigit(character) {
    return "0123456789".indexOf(character) !== -1;
}

function isLetter(character) {
    character = character.toUpperCase();    
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(character) !== -1;
}

testCode();