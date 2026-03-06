// Using the data retrieved from the API Endpoint, 
// write a function called 'getPopulation' that returns the total population
// for all countries that BOTH border China
// and list English as one of their official languages

//NOTE: You are NOT permitted to use FOR, FOREACH, or WHILE loops of any kind.
//      You must leverage the available JavaScript Array Iteration Functions to accomplish your goal.
//      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots

// MARKING
// 10/10 - Function is completed to spec and submitted within class time
//  8/10 - Function is completed to spec and submitted within grace period of twelve hours of end of class time
//  6/10 - Function is completed to spec and submitted after twelve-hour grace period
//  0/10 - Function is not completed


(function(test){

    fetch(`https://prog2700.onrender.com/countries`)
        .then(response => response.json())
        .then(json => {
            //DO NOT MODIFY THIS CODE
            document.write(`The total population of countries that border China and list English as an official language is ${getPopulation(json)}`)
            test.run(getPopulation(json)) // will output test result to browser console
        })

    const getPopulation = (data) => {

        // YOUR CODE HERE
        //borders CH
        countrys = data.filter(country => country.borders && country.borders.includes("CHN"));
        console.log(countrys);
        //languages include English
        english = countrys.filter(country => country.languages && country.languages.some(lang => lang.name.includes("English")));
        console.log(english);
        //reduce to sum population
        pop = english.reduce((total, country) => total + country.population, 0);
        console.log(pop)
       return pop;
    };
    

})(test);
