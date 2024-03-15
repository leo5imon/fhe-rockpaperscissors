// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity >=0.8.13 <0.9.0;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }
    struct Game {
        address player1;
        address player2;
        Move player1Move;
        Move player2Move;
        uint256 betAmount;
        bool isGameEnded;
        address winner;
    }

    uint256 public gameId;
    mapping(uint256 => Game) public games;

    event GameCreated(uint256 gameId, address player1, uint256 betAmount);
    event PlayerJoined(uint256 gameId, address player2);
    event MoveMade(uint256 gameId, address player, Move move);
    event GameEnded(uint256 gameId, address winner);

    function createGame() external payable returns (uint256) {
        require(msg.value > 0, "Bet amount must be greater than 0");

        games[gameId] = Game({
            player1: msg.sender,
            player2: address(0),
            player1Move: Move.None,
            player2Move: Move.None,
            betAmount: msg.value,
            isGameEnded: false,
            winner: address(0)
        });

        emit GameCreated(gameId, msg.sender, msg.value);
        return gameId++;
    }

    function joinGame(uint256 _gameId) external payable {
        Game storage game = games[_gameId];

        require(msg.sender != game.player1, "Player cannot join their own game");
        require(game.player2 == address(0), "Game already has two players");
        require(msg.value == game.betAmount, "Bet amount must match");

        game.player2 = msg.sender;
        emit PlayerJoined(_gameId, msg.sender);
    }

    function makeMove(uint256 _gameId, Move _move) external {
        Game storage game = games[_gameId];

        require(_move != Move.None, "Invalid move");
        require(!game.isGameEnded, "Game has already ended");

        if (msg.sender == game.player1) {
            require(game.player1Move == Move.None, "Move already made");
            game.player1Move = _move;
        } else if (msg.sender == game.player2) {
            require(game.player2Move == Move.None, "Move already made");
            game.player2Move = _move;
        } else {
            revert("Player not part of this game");
        }

        emit MoveMade(_gameId, msg.sender, _move);

        if (game.player1Move != Move.None && game.player2Move != Move.None) {
            decideWinner(_gameId);
        }
    }

    function decideWinner(uint256 _gameId) internal {
        Game storage game = games[_gameId];
        if (game.player1Move == game.player2Move) {
            game.winner = address(0);
        } else if ((game.player1Move == Move.Rock && game.player2Move == Move.Scissors) ||
                   (game.player1Move == Move.Paper && game.player2Move == Move.Rock) ||
                   (game.player1Move == Move.Scissors && game.player2Move == Move.Paper)) {
            game.winner = game.player1;
        } else {
            game.winner = game.player2;
        }

        game.isGameEnded = true;
        payable(game.winner).transfer(address(this).balance);
        emit GameEnded(_gameId, game.winner);
    }

    function checkGame(uint256 _gameId) external view returns (Game memory) {
        return games[_gameId];
    }
}