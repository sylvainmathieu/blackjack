
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

var currentPlayer = 0;

let resetPlayerGameView = () => {
	return {
		gameInProgress: false,
		players: [
			{ type: "dealer", name: "Dealer", hand: [], currentTurn: "", score: 0 },
			{ type: "player", name: "Player 1", number: 1, hand: [], currentTurn: "", score: 0 },
			{ type: "player", name: "Player 2", number: 2, hand: [], currentTurn: "", score: 0 },
			{ type: "player", name: "Player 3", number: 3, hand: [], currentTurn: "", score: 0 },
			{ type: "player", name: "Player 4", number: 4, hand: [], currentTurn: "", score: 0 }
		]
	};
};

var playerGameView = resetPlayerGameView();

let refreshGameView = () => {
	let playerGameTmpl = document.getElementById("playerGameTmpl").innerHTML;
	document.getElementById("table").innerHTML = Mustache.render(playerGameTmpl, playerGameView);
};

let changeTurn = (player) => {
	currentPlayer++

	_(2).times(() => hit(player))

	playerGameView.players.forEach((player) => {
		player.currentTurn = ""
	});

	if (player.type != "dealer") {
		player.currentTurn = "currentTurn";
	}
}

let newRound = () => {

	// Resert the game
	currentPlayer = 0
	playerGameView = resetPlayerGameView()
	playerGameView.gameInProgress = true;

	// Select all players (exclude dealer)
	let players = _.filter(playerGameView.players, (player) => player.type == "player");

	//  Set first player's turn
	let firstPlayer = _.first(players)
	changeTurn(firstPlayer)

}

let newRoundEvent = () => {
	newRound()
	refreshGameView();
};

let getPlayerByName = (playerName) => {
	return _.findWhere(playerGameView.players, { name: playerName })
}

let getScore = (cards) => {

	// Counting the number of aces for soft hands
	let nbAces = _.reduce(nbAces, (acc, card) => card.score == 11 ? 1 : 0, 0);

	// Total counting all the aces as 11 points
	var total = _.reduce(cards, (acc, card) => acc + card.score, 0);

	// Reducing the score regarding the aces if necessary
	_(nbAces).times(() => {
		if (total > 21) {
			total -= 10;
		}
	});

	return total;
}

let hit = (player) => {

	// Take first card in the deck
	let card = _.first(deck);
	deck = _.tail(deck);

	// Add the card to the player's hand
	player.hand.push(card);

	// Add up score
	player.score = getScore(player.hand);

	displayScore(player);

	if (player.score >= 21 && player.type != "dealer") {
		stick(player);
	}
};

let hitEvent = (playerName) => {
	hit(getPlayerByName(playerName));
	refreshGameView();
}

let displayResults = () => {
	let dealer = _.first(playerGameView.players);
	let players = _.tail(playerGameView.players);

	players.forEach((player) => {
		if (player.score >= dealer.score && player.score <= 21) {
			player.resultClass = "win";
			player.resultLabel = "Win";
		}
		else {
			player.resultClass = "lose";
			player.resultLabel = "Lose";
		}
	});
}

let displayScore = (player) => {
	if (player.score == 21) {
		player.scoreClass = "blackjack";
		player.scoreLabel = "Blackjack!";
	}
	else if (player.score > 21) {
		player.scoreClass = "bust";
		player.scoreLabel = "Bust";
	}
}

let dealerHitUntilEnough = (dealer) => {
	if (dealer.score < (21 - 5)) {
		hit(dealer);
		dealerHitUntilEnough(dealer);
	}
}

let dealerPlay = (dealer) => {
	dealerHitUntilEnough(dealer);
	displayScore(dealer);
	displayResults();
	playerGameView.gameInProgress = false;
	refreshGameView();
}

let stick = (player) => {
	let nextPlayer = _.findWhere(playerGameView.players, { number: currentPlayer + 1 });
	if (nextPlayer) {
		changeTurn(nextPlayer);
	}
	else {
		let dealer = _.findWhere(playerGameView.players, { type: "dealer" });
		changeTurn(dealer);
		dealerPlay(dealer);
	}
};

let stickEvent = (playerName) => {
	stick(getPlayerByName(playerName));
	refreshGameView();
}

let gameLoop = () => {
	refreshGameView();
};

window.onload = () => {
	gameLoop();
};

