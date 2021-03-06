(function () {

const cardRanks = [
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

const cardSuits = ["clubs", "diamonds", "hearts", "spades"];

// Generate the name of the cards corresponding the png images and associate the score to each card
const deckCards = _.flatten(cardRanks.map((rank) => {
	return cardSuits.map((suit) => {
		return {
			name: `${rank.name}_of_${suit}`,
			score: rank.score
		};
	});
}));

// Create the final deck using 6 card deck and shuffle the cards
let deck = _.chain(_.range(0, 6))
	.map(() => deckCards)
	.flatten()
	.shuffle()
	.value();

function resetPlayerGameView() {
	return {
		gameInProgress: false,
		players: [
			{ type: "dealer", name: "Dealer", hand: [], currentTurn: "", score: 0 },
			{ type: "player", name: "Player 1", number: 1, hand: [], currentTurn: "", score: 0 },
			{ type: "player", name: "Player 2", number: 2, hand: [], currentTurn: "", score: 0 },
			{ type: "player", name: "Player 3", number: 3, hand: [], currentTurn: "", score: 0 }
		]
	};
}

let playerGameView = resetPlayerGameView();

function refreshGameView() {
	const playerGameTmpl = document.getElementById("playerGameTmpl").innerHTML;
	document.getElementById("table").innerHTML = Mustache.render(playerGameTmpl, playerGameView);
}

function changeTurn(player) {
	playerGameView.players.forEach((player) => {
		player.currentTurn = "";
	});

	if (player.type != "dealer") {
		player.currentTurn = "currentTurn";
	}

	_(2).times(() => hit(player));
}

function getPlayerByName(playerName) {
	return _.findWhere(playerGameView.players, { name: playerName });
}

function getScore(cards) {

	// Counting the number of aces for soft hands
	const nbAces = _.reduce(cards, (acc, card) => acc + (card.score == 11 ? 1 : 0), 0);

	// Total counting all the aces as 11 points
	let total = _.reduce(cards, (acc, card) => acc + card.score, 0);

	// Reducing the score regarding the aces if necessary
	_(nbAces).times(() => {
		if (total > 21) {
			total -= 10;
		}
	});

	return total;
}

function hit(player) {

	// Take first card in the deck
	const card = _.first(deck);
	deck = _.tail(deck);

	// Add the card to the player's hand
	player.hand.push(card);

	// Add up score
	player.score = getScore(player.hand);

	displayScore(player);

	// Go to the next player if can't take any more cards
	if (player.score >= 21 && player.type != "dealer") {
		stick(player);
	}
}

function displayResults() {
	const dealer = _.first(playerGameView.players);
	const players = _.tail(playerGameView.players);

	players.forEach((player) => {
		if ((dealer.score > 21 || player.score > dealer.score) && player.score <= 21) {
			player.resultClass = "win";
			player.resultLabel = "Win";
		}
		else if (player.score == dealer.score && player.score <= 21) {
			player.resultClass = "push";
			player.resultLabel = "Push";
		}
		else {
			player.resultClass = "lose";
			player.resultLabel = "Lose";
		}
	});
}

function displayScore(player) {
	if (player.score == 21) {
		player.scoreClass = "blackjack";
		player.scoreLabel = "Blackjack!";
	}
	else if (player.score > 21) {
		player.scoreClass = "bust";
		player.scoreLabel = "Bust";
	}
}

function dealerHitUntilEnough(dealer) {
	if (dealer.score < (21 - 5)) {
		hit(dealer);
		dealerHitUntilEnough(dealer);
	}
}

function dealerPlay(dealer) {
	dealerHitUntilEnough(dealer);
	displayScore(dealer);
	displayResults();
	playerGameView.gameInProgress = false;
	refreshGameView();
}

function stick (player) {
	const nextPlayer = _.findWhere(playerGameView.players, { number: player.number + 1 });
	if (nextPlayer) {
		changeTurn(nextPlayer);
	}
	else {
		const dealer = _.first(playerGameView.players);
		changeTurn(dealer);
		dealerPlay(dealer);
	}
}

function newRound() {

	// Resert the game
	playerGameView = resetPlayerGameView();
	playerGameView.gameInProgress = true;

	// Select all players (exclude dealer)
	const players = _.tail(playerGameView.players);

	//  Set first player's turn
	const firstPlayer = _.first(players);
	changeTurn(firstPlayer);

}

window.gameEvents = {

	stick: (playerName) => {
		stick(getPlayerByName(playerName));
		refreshGameView();
	},

	hit: (playerName) => {
		hit(getPlayerByName(playerName));
		refreshGameView();
	},

	newRound: () => {
		newRound();
		refreshGameView();
	}

};

window.onload = () => {
	refreshGameView();
};

})();