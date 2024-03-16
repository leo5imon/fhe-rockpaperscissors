// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";

contract RockPaperScissors {
    struct Game {
        address player1;
        address player2;
        euint8 player1Move; // 0 = None, 1 = Rock, 2 = Paper, 3 = Scissors
        euint8 player2Move;
        bool isGameEnded;
        address winner;
    }

    uint256 public gameId;
    mapping(uint256 => Game) public games;

    event GameCreated(uint256 gameId, address player1);
    event PlayerJoined(uint256 gameId, address player2);
    event MoveMade(uint256 gameId, address player, euint8 move);
    event GameEnded(uint256 gameId, address winner);

    function createGame() external returns (uint256) {
        games[gameId] = Game({
            player1: msg.sender,
            player2: address(0),
            player1Move: FHE.asEuint8(0),
            player2Move: FHE.asEuint8(0),
            isGameEnded: false,
            winner: address(0)
        });

        emit GameCreated(gameId, msg.sender);
        uint256 createdGameId = gameId;
        gameId++;
        return createdGameId;
    }

    function joinGame(uint256 _gameId) external {
        Game storage game = games[_gameId];

        require(msg.sender != game.player1, "Player cannot join their own game");
        require(game.player2 == address(0), "Game already has two players");

        game.player2 = msg.sender;
        emit PlayerJoined(_gameId, msg.sender);
    }

    function makeMove(uint256 _gameId, inEuint8 calldata encryptedMove) public {
        Game storage game = games[_gameId];

        require(!game.isGameEnded, "Game has already ended");
        euint8 move = FHE.asEuint8(encryptedMove);

        if (msg.sender == game.player1) {
            game.player1Move = move;
        } else if (msg.sender == game.player2) {
            game.player2Move = move;
        } else {
            revert("Player not part of this game");
        }

        emit MoveMade(_gameId, msg.sender, move);
        decideWinner(_gameId);
    }

    function decideWinner(uint256 _gameId) internal {
        Game storage game = games[_gameId];

        uint8 player1MoveDecrypted = FHE.decrypt(game.player1Move);
        uint8 player2MoveDecrypted = FHE.decrypt(game.player2Move);

        if (player1MoveDecrypted == player2MoveDecrypted) {
            game.winner = address(0);
        } else if ((player1MoveDecrypted == 1 && player2MoveDecrypted == 3) || 
                   (player1MoveDecrypted == 2 && player2MoveDecrypted == 1) || 
                   (player1MoveDecrypted == 3 && player2MoveDecrypted == 2)) {
            game.winner = game.player1;
        } else {
            game.winner = game.player2;
        }

        game.isGameEnded = true;
        emit GameEnded(_gameId, game.winner);
    }

    function checkGame(uint256 _gameId) external view returns (Game memory) {
        return games[_gameId];
    }
}