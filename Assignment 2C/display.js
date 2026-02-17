export function display(rank, cards){
    const rankDisplay = document.getElementById("rank")
    const names = {
        1:"Royal Flush",
        2:"Straight Flush",
        3:"Four of a Kind",
        4:"Full House",
        5:"Flush",
        6:"Straight",
        7:"Three of a Kind",
        8:"Two Pair",
        9:"Pair",
        10:"High Card"
    };

    rankDisplay.textContent = names[rank];

    // show card images
    cards.forEach((c,i)=>{
        const cards = document.getElementById(`card${i+1}`);
        cards.innerHTML = `<img src="${c.image}" width="80">`;
    });
}
export function showMessage(text) {
    const rankDisplay = document.getElementById("rank");
    rankDisplay.textContent = text;
}

export function setButtonEnabled(enabled) {
    const btn = document.getElementById("drawBtn");
    btn.disabled = !enabled;
}