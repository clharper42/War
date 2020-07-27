let deckId = "default";
let playerOnePileName = "onepile";
let playerTwoPileName = "twopile";
let playerOneWarPileName = "onewarpile";
let playerTwoWarPileName = "twowarpile"
let playerOneDrawName = "";
let playerTwoDrawName ="";
let fetchPileString = "";
let cardcodes = "";
let playerOneWon = true;
let firstRound = true;
let stop = false;
let war = false;
let draw = {};
let pileOneDraw = {};
let pileOneWarDraw = {};
let pileTwoWarDraw = {};
let pileTwoDraw = {};
let cardValue = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    0: 10,
    J: 11,
    K: 12,
    Q: 13,
    A: 14
};

const playerOneIMGElement = document.getElementById('p1IMG');
const playerTwoIMGElement = document.getElementById('p2IMG');
const actionBTNElement = document.getElementById('actionBTN');
const playerOneCardCountElement = document.getElementById('p1CardCount');
const playerTwoCardCountElement = document.getElementById('p2CardCount');
const currentInfoElement = document.getElementById('currentInfo');
const playerOneWarCountElement = document.getElementById('p1WarCount');
const playerTwoWarCountElement = document.getElementById('p2WarCount');

async function createPile(whichpile){
    draw = await fetch("https://deckofcardsapi.com/api/deck/"+ deckId + "/draw/?count=26")
        .then(response => response.json())
        .catch(err => alert(err));

    fetchPileString = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/"+ whichpile +"/add/?cards=";
    draw.cards.forEach(function(card){
        fetchPileString = fetchPileString + card.code + ",";
    });
    fetchPileString = fetchPileString.slice(0,-1);
        
    await fetch(fetchPileString)
        .then(response => response.json())
        .catch(err => alert(err))

}

async function getDeck() {

   let data = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(response => response.json())
        .catch(err => alert(err));
    if(data.success)
    {
        deckId = data.deck_id;
        playerOneDrawName = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerOnePileName + "/draw/bottom/";
        playerTwoDrawName = "https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoPileName + "/draw/bottom/";
        console.log(deckId);

        // DRAW FIST HAND AND PLACE IN PLAYER ONE PILE
        createPile(playerOnePileName);
        // DRAW SECOND HAND AND PLACE IN PLAYER TWO PILE
        createPile(playerTwoPileName);
    }
    else
    {
        alert("Failed to get deck")
    }
    
};


async function drawFromPile() {

    if(!stop)
    {
        if(firstRound)
        {
            playerOneCardCountElement.innerText = (parseInt(playerOneCardCountElement.innerText.replace(" CARDS", "")) - 1).toString() + " CARDS";
            playerTwoCardCountElement.innerText = (parseInt(playerTwoCardCountElement.innerText.replace(" CARDS", "")) - 1).toString() + " CARDS";
            firstRound = false;
        }
        else if(war)
        {
            playerOneWarCountElement.innerText = (parseInt(playerOneWarCountElement.innerText.replace(" CARDS", "")) + 2).toString() + " CARDS";
            playerTwoWarCountElement.innerText = (parseInt(playerTwoWarCountElement.innerText.replace(" CARDS", "")) + 2).toString() + " CARDS";

            playerOneCardCountElement.innerText = (parseInt(playerOneCardCountElement.innerText.replace(" CARDS", "")) - 2).toString() + " CARDS";
            playerTwoCardCountElement.innerText = (parseInt(playerTwoCardCountElement.innerText.replace(" CARDS", "")) - 2).toString() + " CARDS";

        }
        else if(playerOneWon) //Remove and add cards to the pile based off of last round results
        {
            if(parseInt(playerOneWarCountElement.innerText.replace(" CARDS", "")) > 0) // IF WAR IS OVER ADD CORRECT NUMBER TO WINNERS HAND AND SET WAR CARD COUNT TO ZERO
            {
                playerOneCardCountElement.innerText = (parseInt(playerOneCardCountElement.innerText.replace(" CARDS", "")) + parseInt(playerOneWarCountElement.innerText.replace(" CARDS", "")) + parseInt(playerTwoWarCountElement.innerText.replace(" CARDS", "")) + 1).toString() + " CARDS";
                playerOneWarCountElement.innerText = "0 CARDS";
                playerTwoWarCountElement.innerText = "0 CARDS";
            }
            else{
                playerOneCardCountElement.innerText = (parseInt(playerOneCardCountElement.innerText.replace(" CARDS", "")) + 1).toString() + " CARDS";
            }
            playerTwoCardCountElement.innerText = (parseInt(playerTwoCardCountElement.innerText.replace(" CARDS", "")) - 1).toString() + " CARDS";
        }
        else
        {
            if(parseInt(playerTwoWarCountElement.innerText.replace(" CARDS", "")) > 0) // IF WAR IS OVER ADD CORRECT NUMBER TO WINNERS HAND AND SET WAR CARD COUNT TO ZERO
            {
                playerTwoCardCountElement.innerText = (parseInt(playerTwoCardCountElement.innerText.replace(" CARDS", "")) + parseInt(playerOneWarCountElement.innerText.replace(" CARDS", "")) + parseInt(playerTwoWarCountElement.innerText.replace(" CARDS", "")) + 1).toString() + " CARDS";
                playerOneWarCountElement.innerText = "0 CARDS";
                playerTwoWarCountElement.innerText = "0 CARDS";
            }
            else{
                playerTwoCardCountElement.innerText = (parseInt(playerTwoCardCountElement.innerText.replace(" CARDS", "")) + 1).toString() + " CARDS";
            }
            playerOneCardCountElement.innerText = (parseInt(playerOneCardCountElement.innerText.replace(" CARDS", "")) - 1).toString() + " CARDS";
        }


        if(war) // IF WAR DRAW TWO CARDS WHERE THE FIRST ONE REPERSENTS A CARD IN THE WAR PILE WHILE THE SECOND ONE IS THE ONE TO BATTLE WITH
        {
            pileOneDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerOnePileName + "/draw/bottom/?count=2")
                .then(response => response.json());

            pileTwoDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoPileName + "/draw/bottom/?count=2")
                .then(response => response.json());
        }
        else{ // DRAW THE CARDS TO BATTLE
            pileOneDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerOnePileName + "/draw/bottom/")
                .then(response => response.json());
                
            // console.log(pileOneDraw);
            // playerOneIMGElement.src = pileOneDraw.cards[0].image;

            pileTwoDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoPileName + "/draw/bottom/")
                .then(response => response.json());
            // console.log(pileTwoDraw);
            // playerTwoIMGElement.src = pileTwoDraw.cards[0].image;
        }
        
        console.log(pileOneDraw);
        console.log(pileTwoDraw);
        console.log(pileTwoDraw.piles[playerOnePileName].remaining.toString() + " " + pileTwoDraw.piles[playerTwoPileName].remaining.toString());
        playerOneIMGElement.src = pileOneDraw.cards[pileOneDraw.cards.length - 1].image;
        playerTwoIMGElement.src = pileTwoDraw.cards[pileTwoDraw.cards.length - 1].image;

        if(cardValue[pileOneDraw.cards[pileOneDraw.cards.length - 1].code[0]] > cardValue[pileTwoDraw.cards[pileTwoDraw.cards.length - 1].code[0]]) // COMPARE THE CARDS
        {
            if(pileTwoDraw.piles[playerTwoPileName].remaining- 1 < 0) //IF PLAYER TWO CAN'T PLAY AFTER THIS ROUND END GAME
            {
                currentInfoElement.innerText = "PLAYER ONE WINS!"
                stop = true; 
                return;
            }

            currentInfoElement.innerText = "PLAYER ONE WINS ROUND"

            cardcodes = "";

            // GET THE CARDS TO MOVE THEM INTO CORRECT PILE
            pileOneDraw.cards.forEach(function(card){
                cardcodes = cardcodes+ card.code + ",";
            })

            pileTwoDraw.cards.forEach(function(card){
                cardcodes = cardcodes +card.code + ",";
            })

            if(war) //IF IN WAR GET CARDS FROM WAR PILE TO MOVE INTO CORRECT PLAYER PILE
            {
                let cardCountOne = (parseInt(playerOneWarCountElement.innerText.replace(" CARDS", "")) - 1);
                let cardCountTwo = (parseInt(playerTwoWarCountElement.innerText.replace(" CARDS", "")) - 1);

                pileOneWarDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerOneWarPileName + "/draw/bottom//?count=" + cardCountOne.toString())
                    .then(response => response.json());
                pileTwoWarDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoWarPileName + "/draw/bottom//?count=" + cardCountTwo.toString())
                    .then(response => response.json());;

                pileOneWarDraw.cards.forEach(function(card){
                    cardcodes = cardcodes + card.code + ",";
                })
            
                pileTwoWarDraw.cards.forEach(function(card){
                    cardcodes = cardcodes +  card.code + ",";
                })
                war = false;
            }

            cardcodes = cardcodes.slice(0,-1);
            console.log(cardcodes);

            await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerOnePileName + "/add/?cards=" + cardcodes)
                .then(response => response.json())
            
            playerOneWon = true;
        }
        else if(cardValue[pileOneDraw.cards[pileOneDraw.cards.length - 1].code[0]] < cardValue[pileTwoDraw.cards[pileTwoDraw.cards.length - 1].code[0]]){

            if(pileTwoDraw.piles[playerOnePileName].remaining - 1 < 0)
            {
                currentInfoElement.innerText = "PLAYER TWO WINS!"
                stop = true;
                return;
            }

            cardcodes = "";

            pileTwoDraw.cards.forEach(function(card){
                cardcodes = cardcodes +  card.code + ",";
            })

            pileOneDraw.cards.forEach(function(card){
                cardcodes = cardcodes +  card.code + ",";
            })

            if(war)
            {
                let cardCountOne = (parseInt(playerOneWarCountElement.innerText.replace(" CARDS", "")) - 1);
                let cardCountTwo = (parseInt(playerTwoWarCountElement.innerText.replace(" CARDS", "")) - 1);

                pileOneWarDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerOneWarPileName + "/draw/bottom//?count=" + cardCountOne.toString())
                    .then(response => response.json());
                pileTwoWarDraw = await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoWarPileName + "/draw/bottom//?count=" + cardCountTwo.toString())
                    .then(response => response.json());;
            
                pileTwoWarDraw.cards.forEach(function(card){
                    cardcodes = cardcodes +  card.code + ",";
                })

                pileOneWarDraw.cards.forEach(function(card){
                    cardcodes = cardcodes +  card.code + ",";
                })
                war = false;
            }

            cardcodes = cardcodes.slice(0,-1);
            console.log(cardcodes);

            currentInfoElement.innerText = "PLAYER TWO WINS ROUND"
            await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoPileName + "/add/?cards=" + cardcodes)
                .then(response => response.json())

            //fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoPileName + "/add/?cards=" + pileTwoDraw.cards[0].code + "," + pileOneDraw.cards[0].code)
            playerOneWon = false;
        }
        else // WAR TRIGGERED 
        {
            // CHECK TO SEE IF EITHER PLAYER CAN GIVE UP THE RIGHT AMOUNT OF CARDS
            if(pileTwoDraw.piles[playerTwoPileName].remaining - 2 < 0 && pileTwoDraw.piles[playerOnePileName].remaining - 2 < 0)
            {
                currentInfoElement.innerText = "DRAW!"
                stop = true;
                return;
            }
            else if(pileTwoDraw.piles[playerTwoPileName].remaining - 2 < 0)
            {
                currentInfoElement.innerText = "PLAYER ONE WINS!"
                stop = true;
                return;
            }
            else if(pileTwoDraw.piles[playerOnePileName].remaining - 2 < 0)
            {
                currentInfoElement.innerText = "PLAYER TWO WINS!"
                stop = true;
                return;
            }

            war = true;

            // MOVE CARD TO THE CORRECT WAR PILE
            let warCardsOne = "";

            pileOneDraw.cards.forEach(function(card){
                warCardsOne = warCardsOne + card.code + ",";
            })
            warCardsOne = warCardsOne.slice(0,-1);

            let warCardsTwo = "";

            pileTwoDraw.cards.forEach(function(card){
                warCardsTwo = warCardsTwo + card.code + ",";
            })
            warCardsTwo = warCardsTwo.slice(0,-1);
            
            currentInfoElement.innerText = "GO TO WAR!"
            await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerOneWarPileName + "/add/?cards=" + warCardsOne);
            await fetch("https://deckofcardsapi.com/api/deck/" + deckId + "/pile/" + playerTwoWarPileName + "/add/?cards=" + warCardsTwo);
            //pileOneDraw.cards[0].code
        }
    }

};

function pageReload(){
    location.reload()
}

getDeck();
