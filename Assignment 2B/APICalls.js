function getDate(){
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(respone => respone.json())
    .then(data => {
        console.log(data.drinks);
        const drinkName = document.getElementById("drinkName");
        const drinkPic = document.getElementById("drinkPic");
        const name = data.drinks[0].strDrink;
        const url = data.drinks[0].strDrinkThumb;
        drinkName.textContent = name;
        drinkPic.innerHTML = "<img src="+url+">"
    });
}
getDate();