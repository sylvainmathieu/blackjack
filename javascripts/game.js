
let cardRanks = [
	{ name: "ace", score: 11 },
	{ name: "2", score: 2 },
	{ name: "3", score: 3 },
	{ name: "4", score: 4 },
	{ name: "5", score: 5 },
	{ name: "6", score: 6 },
	{ name: "7", score: 7 },
	{ name: "8", score: 8 },
	{ name: "9", score: 9 },
	{ name: "jack", score: 10 },
	{ name: "queen", score: 10 },
	{ name: "king", score: 10 }
];

let cardSuits = ["clubs", "diamonds", "hearts", "spades"];

// Generate the name of the cards corresponding the png images and associate the score to each card
let deckCards = _.flatten(cardRanks.map((rank) => {
	return cardSuits.map((suit) => {
		return {
			name: `${rank.name}_of_${suit}"`,
			score: rank.score
		};
	})
}));

// Create the final deck using 6 card deck and shuffle the cards
let deck = _.chain(_.range(0, 6))
	.map(() => deckCards)
	.flatten()
	.shuffle()
	.value()

var playerGameView = {
	players: [
		{ name: "Dealer" },
		{ name: "Player1" },
		{ name: "Player2" },
		{ name: "Player3" },
		{ name: "Player4" }
	]
};

var refreshGame = () => {
	let playerGameTmpl = document.getElementById("playerGameTmpl").innerHTML;
	document.getElementById("table").innerHTML = Mustache.render(playerGameTmpl, playerGameView);
};

let gameLoop = () => {
	refreshGame();
};

window.onload = () => {
	gameLoop();
};

