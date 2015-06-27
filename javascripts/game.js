
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
			name: `${rank.name}_of_${suit}`,
			score: rank.score
		};
	});
}));

// Create the final deck using 6 card deck and shuffle the cards
var deck = _.chain(_.range(0, 6))
	.map(() => deckCards)
	.flatten()
	.shuffle()
	.value();

var currentPlayer = 0
var playerGameView = {
	players: [
		{ type: "dealer", name: "Dealer", hand: [], currentTurn: "", score: 0 },
		{ type: "player", name: "Player 1", number: 1, hand: [], currentTurn: "", score: 0 },
		{ type: "player", name: "Player 2", number: 2, hand: [], currentTurn: "", score: 0 },
		{ type: "player", name: "Player 3", number: 3, hand: [], currentTurn: "", score: 0 },
		{ type: "player", name: "Player 4", number: 4, hand: [], currentTurn: "", score: 0 }
	]
};

let refreshGameView = () => {
	let playerGameTmpl = document.getElementById("playerGameTmpl").innerHTML;
	document.getElementById("table").innerHTML = Mustache.render(playerGameTmpl, playerGameView);
};

let changeTurn = (player) => {
	currentPlayer++
	playerGameView.players.forEach((player) => {
		player.currentTurn = ""
	});
	player.currentTurn = "currentTurn";
}

let newRound = () => {
	currentPlayer = 0

	// Select all players (exclude dealer)
	let players = _.filter(playerGameView.players, (player) => player.type == "player");

	// Give two cards to every player
	players.forEach((player) => {
		_(2).times(() => {
			hit(player.name);
		});
	});

	// Set first player's turn
	changeTurn(_.first(players))
}

let newRoundEvent = () => {
	newRound()
	refreshGameView();
};

let hit = (playerName) => {

	// Take first card in the deck
	let card = _.first(deck);
	deck = _.tail(deck);

	// Add the card to the player's hand
	var player = _.findWhere(playerGameView.players, { name: playerName });
	player.hand.push(card);

	player.score += card.score;

};

let hitEvent = (playerName) => {
	hit(playerName);
	refreshGameView();
}

let stick = (playerName) => {
	let player = _.findWhere(playerGameView.players, { number: currentPlayer + 1 });
	if (player) {
		changeTurn(player);
	}
	else {
		let dealer = _.findWhere(playerGameView.players, { type: "dealer" });
		changeTurn(dealer);
	}
};

let stickEvent = (playerName) => {
	stick(playerName);
	refreshGameView();
}

let gameLoop = () => {
	refreshGameView();
};

window.onload = () => {
	gameLoop();
};

