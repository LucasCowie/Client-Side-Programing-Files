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
        const response = await fetch(url)
        responseCheck(response); //responce error handing
        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error)
    }
}
//let deckID = await getDeckID();
//console.log(deckID);
//let five = await drawFive(deckID);
//five = five.cards
// V | should be the same as te array here
let fiveCards = ["0S","0S","JS","3S","3S"] //offline

//sort cards highest to lowest
//sorts the cards from highest to lowest value in poker
function sortCards(cards){
    let cardArraySort = [];
    try{
        const rankOrder = { //define how to sort
            '2': 2,'3': 3,'4': 4,'5': 5,
            '6': 6,'7': 7,'8': 8,'9': 9,
            '0': 10,'J': 11,'Q': 12,'K': 13,'A': 14
        };
        for(let i=0;i<5;i++){ //make array
            cardArraySort.push(cards[i]);
            //cards[i].code ---------^
        }
        cardArraySort.sort((a, b) => { //sort cards
            const rankA = rankOrder[a[0]];
            const rankB = rankOrder[b[0]];
            return rankA - rankB;
        });
    }catch(error){
        console.log(error)
    }
    return cardArraySort;
}

fiveCards = sortCards(fiveCards); //needs to be pasted "five.cards"
console.log(fiveCards)
//splits the cards into two array for suits and num
//combine those array to be able to called from a single array
//probably could write this section better
function split(cards){
    let cardArray = [[]];
    let suitArray = [];
    let numArray = [];
    try{
        for(let i=0;i<5;i++){
            //cardArray[0].push(five.cards[i].code.split(""))
            cardArray[0].push(cards[i].split("")) //offline
        }
        for(let i=0;i<cardArray[0].length;i++){
            numArray.push(cardArray[0][i][0])
            suitArray.push(cardArray[0][i][1])
        }
    }catch(error){
        console.log(error)
    }
    //assign
    cardArray = [];
    cardArray = [[numArray],[suitArray]];
    //log out
    console.log(suitArray);
    console.log(numArray);
    console.log(cardArray);
    //return
    return cardArray;
}
let cardArray = split(fiveCards)
//check for pairs up till 4
function determinePairs(numArray){
    let pairArray = [];
    let pairSaved = [];
    for(let i=0;i<5;i++){
        if(numArray[i] == numArray[i+1]){
            if(numArray[i]==numArray[i+1]&&numArray[i+1]==numArray[i+2]){
                if(numArray[i]==numArray[i+1]
                    &&numArray[i+1]==numArray[i+2]
                    &&numArray[i+2]==numArray[i+3]){
                    pairArray.push("4 of a kind: "+numArray[i])
                    console.log(pairArray)
                    return 4;
                }
                pairArray.push("3 of a kind: "+numArray[i])
                console.log(pairArray)
                return 3;
                
            }
            pairSaved.push(numArray[i]);
        }
    }
    if(sumCards(pairSaved[0]) > sumCards(pairSaved[1])){
        pairArray.push("2 of a kind: "+pairSaved[0])
        console.log(pairArray)
        return 2;
    }else{
        pairArray.push("2 of a kind: "+pairSaved[1])
        console.log(pairArray)
        return 1;
    }
}
let pair = determinePairs(cardArray[0][0]);
console.log(pair);
//if pairs cant be flush or royal flush so no need to check
//only check for full house at this point, might add to pair function
if(pair > 0){

}else{
    const allSame = suitArray.every(element => element === suitArray[0])
    if(allSame){
        console.log("same")
    }
}
//helper functions
function sumCards(card){
    switch(card){
        case 2-9:
            return card;
        case 0:
            return 10;
        case "J":
            return 11;
        case "Q":
            return 12; 
        case "K":
            return 13;  
        case "A":
            return 14; 
    }
}
function responseCheck(res){
    if(!res.ok){
        throw new Error("Response Error: "+response.status);
    }
}
/*
    sort wiki
    little bit of chat with the sorting stuff
    
    Mackenize for api and error handing
*/