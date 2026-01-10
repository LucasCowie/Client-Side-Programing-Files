//Wanna Rewrite to help my understanding of array
//Currently Heavily copyed from Devin

function longestSum(arr){
    let streak = [];
    let beststreak = [0];
    if (arr.length > 0){
        streak.push(arr[0]);
        for(let i = 1;i<arr.length;i++){
            if (arr[i]== arr[i-1]+1){
                streak.push(arr[i]);
            }else{
                beststreak = check(streak, beststreak);
                streak = [arr[i]];
            }
        }
        beststreak = check(streak, beststreak);
    }
    return beststreak;
}
longestSum([3, 2, 7, 5, 6, 7, 3, 8, 9, 10, 23, 2, 1, 2, 3]);

function sum(arr){
    let sum = 0;
    for(let i = 0;i<arr.length;i++){
        sum = sum + arr[i];
    }
    return sum;
}
function check(arr1, arr2){
    if(arr1.length >= arr2.length){
        if (arr1.length == arr2.length){
            if(sum(arr1)>sum(arr2)){
                arr2 = arr1;
            }}else{
                arr2 = arr1;
            }        
    }
    return arr2;
}