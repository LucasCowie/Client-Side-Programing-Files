//This functions takes in an array and finds the longest consecutive numbers in the array
//made the parm only accept arrays and defualts to nothing if there is no input give
function longestSum(arr=[]){
    //created var for current streak and the longest streak (called bestStreak)
    let streak = [];
    let bestStreak = [0];
    //checks to make sure the given array isnt empty
    if (arr.length > 0){
        //sets streak to the first index in the given array
        streak.push(arr[0]);
        //loops throught all the number in the given array to try and find consecutive numbers
        for(let i = 1;i<arr.length;i++){
            //checks for consecutive numbers but grabing the index behind the current number being check 
            //then see if its a step up by 1, if consecutive should be the same
            if (arr[i]== arr[i-1]+1){
                streak.push(arr[i]);
            //if they are not equal, checks the streak againt the bestStreak to make sure we arent getting rid of a highter sum streak
            //sets streak to only 1 number which is the current iteration
            }else{
                bestStreak = check(streak, bestStreak);
                streak = [arr[i]];
            }
        }
        //rechecks the streaks when the loops iterates
        bestStreak = check(streak, bestStreak);
    }
    //if the only consecutive numbers found are less then a streak of 3 set the outcome to 0
    if(bestStreak.length<3){
        bestStreak = [0];
    }
    //sums the beststreak to return the sum
    bestStreak = sum(bestStreak);
    //outputs the bestStreak sum to console
    console.log(bestStreak);
    //returns the bestStreak to the function
    return bestStreak;
}
//Test numbers from assignment
longestSum([1, 2, 3, 6, 9, 34, 2, 6]);
longestSum([3, 2, 7, 5, 6, 7, 3, 8, 9, 10, 23, 2, 1, 2, 3]);
longestSum([100, 101, 102, 3, 4, 5, 6, 9])
//Wrote a Sum function to easily check the two array for streak that are the same size
//was originally intended for the main funcation but had to scrape when i reread the instructions
function sum(arr=[]){
    let sum = 0;
    //loops throught the give array and adds all the numbers
    for(let i = 0;i<arr.length;i++){
        sum = sum + arr[i];
    }
    //returns the sum as an intager
    return sum;
}
//Checks the current and the best streak for the array with the longer consecutive number 
//if they are the same length set it to the larger sum streak
function check(streak=[], bestStreak=[]){
    //checks if current streak is greater than or equal to the best streak
    if(streak.length >= bestStreak.length){
        //Then it check if both streaks are the same length
        if (streak.length == bestStreak.length){
            //if they are the same length and current streak sum is great, make it the best streak
            if(sum(streak)>sum(bestStreak)){
                bestStreak = streak;
            }
        //else if the current is just longer then the best streak, set current as the best streak
        }else{
            bestStreak = streak;
        }        
    }
    //returns the beststreak
    return bestStreak;
}

/*
    Classmate Devin help a lot with how the array works and the math behind the checking functions
*/