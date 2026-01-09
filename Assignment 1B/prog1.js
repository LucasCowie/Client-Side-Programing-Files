//A functions to either reverse a string if the first and last char are the same
//Or remove the first and last char of the string if the are not the same
function letterswap(str){
    let finalstr = "";
    //Checks if the first and last char of the string are the same
    if (str.length[0] == str.length -1){
        //If the first and last char are the same loop through the string and reverse it
        for(let i = str.length-1;i>=0;i--){
            finalstr = finalstr + str[i];
        }
    }else{ //if the first and last char arent the same in the string
        finalstr = str.slice(1,-1); //removes the first and last char in the string
    }
    console.log(finalstr); //prints the results to the console
}

letterswap("Defualt"); //Use the word Deafault on first run
