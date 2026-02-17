//get a new deck
//gets called when page refereshs
async function getDeckID(){
    try{
        const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
        const response = await fetch(url);
        responseCheck(response); //response error handing
        const data = await response.json();

        return data.deck_id; //retunr just the deck ID, dont need the other object value as of now (Feb 8th 2026)
    }catch(error){
        console.log(error);
    }
}
//draw five from current deck
//will be called when a button is pressed to draw five cards from existing deck
async function drawFive(deck) {
    try {
        const url = `https://deckofcardsapi.com/api/deck/${deck}/draw/?count=5`;
        //const url = "https://prog2700.onrender.com/pokerhandtest/royalflush" //test case for certain hands (add more from links given)
        //const url = "https://prog2700.onrender.com/pokerhandtest/fullhouse" //test case for certain hands (add more from links given)
        const response = await fetch(url)
        responseCheck(response); //responce error handing
        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error)
    }
}
//sort cards highest to lowest
//sorts the cards from highest to lowest value in poker
function sortCards(cards){
    let cardArraySort = [];
    
    const rankOrder = { //define how to sort
        '2': 2,'3': 3,'4': 4,'5': 5,
        '6': 6,'7': 7,'8': 8,'9': 9,
        '0': 10,'J': 11,'Q': 12,'K': 13,'A': 14
    };
    try{
        for(let i=0;i<5;i++){ //make array
            let code = cards[i].code; //get the card code
            let rankChar = code[0];     //get card value
            let suit = code[1];        // get card suit
            let value = rankOrder[rankChar]; //replace card value with numeric value

            // store numeric value + suit
            cardArraySort.push([value, suit]);
        }
        cardArraySort.sort((a,b)=>a[0]-b[0]); //sorts cards highest to lowest
    }catch(error){
        console.log(error)
    }
    return cardArraySort;
}
//splits the cards into two array for suits and num
//combine those array to be able to called from a single array
function split(cards){
    let numArray = cards.map(c => c[0]); //takes card value into an array
    let suitArray = cards.map(c => c[1]); //takes card suit into an array
    return [numArray, suitArray];
}
function determineDups(numArray){
    let counts = {};

    // Count the occurrences of each item
    numArray.forEach(item => {
        // If the item exists as a key, increment its value; otherwise, set it to 1
        counts[item] = (counts[item] || 0) + 1;
    });
    //make and object and store occor value
    const values = Object.values(counts).sort((a,b)=>b-a);
    //retrun hand value
    if (values[0] === 4){
        console.log("four of a kind")
        return 3; // four of a kind
    } 
    if (values[0] === 3 && values[1] === 2){
        console.log("full house")
        return 4; // full house
    }
    if (values[0] === 3) {
        console.log("three")
        return 7; // three
    }
    if (values[0] === 2 && values[1] === 2){ 
        console.log("two pair")
        return 8; // two pair
    }
    if (values[0] === 2){ 
        console.log("pair")
        return 9; // pair
    }else{
        return 0;
    }
}
//final check and determines outcome
function determineLogic(cardArray){
    let suitArray = cardArray[1]; //deconstruct suit array
    let numArray = cardArray[0]; //deconstruct value array

    let rank = determineDups(cardArray[0]); //gets pair ranks

    const straight = numArray.every((v,i)=> i===0 || v===numArray[i-1]+1); //just to see if number all inc
    const flush = suitArray.every(s => s === suitArray[0]); //check to see if all the same suit
    if(rank === 0){ //if no pairs
        if (flush && straight) { //if num inc and all the same suit
            if (JSON.stringify(numArray) === JSON.stringify([10,11,12,13,14])) { //if equal to royal flush
                rank = 1;
                console.log("royal flush");
            } else { //else its straight flush
                rank = 2;
                console.log("straight flush");
            }
        } else if (flush) { // nums dont match but suit are same
            rank = 5;
            console.log("flush");
        } else if (straight) { //suit dont match but num inc
            rank = 6;
            console.log("straight");
        } else {
            rank = 10;
            console.log("high card");
        }
    }
}
let deckID = await getDeckID();
let five = await drawFive(deckID);
determineLogic(split(sortCards(five.cards)));
//helper functions
function responseCheck(res){
    if(!res.ok){
        throw new Error("Response Error: "+res.status);
    }
}
/*
    sort wiki
    little bit of chat with the sorting stuff
    
    Mackenize for api and error handing
*/