function getDate(){
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php?a=Alcoholic")
    .then(respone => respone.json())
    .then(data => {
        console.log(data.drinks);
        const drink = data.drinks[0];
 
        const drinkName = document.getElementById("drinkName");
        const drinkPic = document.getElementById("drinkPic");
        const drinkType = document.getElementById("drinkType");


        const name = drink.strDrink;
        const url = drink.strDrinkThumb;
        const type = drink.strAlcoholic;

        drinkName.textContent = name;
        drinkPic.innerHTML = "<img src="+url+">"
        drinkType.textContent = type;


    }).catch(err => console.error(err));
}
getDate();
function getDateDino(){
    var num = Math.floor(Math.random() * (59 - 17)) + 17;
    fetch("https://mhw-db.com/monsters/"+num)
    .then(respone => respone.json())
    .then(data => {
        console.log(data);
        const dino = data;
 
        const dinoName = document.getElementById("dinoName")

        const name = dino.name;

        dinoName.textContent = name;

    }).catch(err => console.error(err));
}
getDateDino();