//Random number generator
//TODO: Rewrite later to help my understanding of how it works
//Look in to the Math func
function random(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1))+min;
}
//Makes an Array of Certain Lenght, then fill that array with random number between certain values
//Check if those number are Prime number being checking againt the squrt root of the number, 
//Could be more effevicten if it only checked the primes of that number but rn it checks up to at most 10
function primeFinder(lenght=10,min=1,max=50){
    //Define Var
    let randomArray = [];
    let primeArray = [];
    let randomArrayLenght = lenght;
    let RandomMin = min;
    let RandomMax = max;    
    //Makes the random array of numbers
    for(let i = 0; i < randomArrayLenght;i++){
        randomArray.push(random(RandomMin,RandomMax));
    }
    //Loops throught the array lenght
    for(let n = 0;n<randomArray.length;n++){
        let prime = true;
        //if you want to change the math of how it checks the prime number youd do that here
        let check = Math.ceil(Math.sqrt(randomArray[n]));
        //starts to check for prime numbers
        for(let x = 2;x<check;x++){
            //if its not prime set the flag to false and stop checking
            if(randomArray[n]%x===0){
                prime = false;
                break;
            }
        }
        //if its 1 set to false since 1 is neither prime nor composite
        //DONE!!!!!!!: change to a push all number along with if they are prime or not, using the flag set earlier
        if(randomArray[n] == 1){
            prime = false;
        }
        (prime) ? primeArray.push(randomArray[n]+" True") : primeArray.push(randomArray[n]+" False");
    }
    //Output the 2 Arrays for debug and comparing
    console.log(randomArray);
    console.log(primeArray);
}

/*
    https://brilliant.org/wiki/prime-numbers/
    Read this article to help my understanding of prime numbers

    https://www.w3schools.com/js/js_if_ternary.asp
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
    Help my understand for the last logic statement
*/