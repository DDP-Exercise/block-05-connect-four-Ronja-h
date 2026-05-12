"use strict";

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

//TODO: Show the current player

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.


export const GAMEVIEW = {
    init: function () {
        this.eventListeners();
    },
    eventListeners: function () {
        document.addEventListener("game:setStone", (event) => {
            this.renderStone(event.detail);
        });

        document.addEventListener("game:playerChanged", (event) => {
            const P1 = document.getElementById("player1");
            const P2 = document.getElementById("player2");
            const CURRENT = event.detail.currentPlayer;

            document.getElementById("status").textContent = `Player ${CURRENT}, take your turn!`;

            if (CURRENT === 1) {
                P1.classList.add("active");
                P2.classList.remove("active");
            } else {
                P2.classList.add("active");
                P1.classList.remove("active");
            }
        });

        document.addEventListener("game:gameOver", (event) => {
            this.renderGameOver(event.detail);
        });
    },
    renderStone: function ({row, col, player}) {
        const CELL = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        );

        const STONE = document.createElement("div");
        STONE.classList.add("stone");

        if (player === 1) STONE.classList.add("player1");
        if (player === 2) STONE.classList.add("player2");

        CELL.appendChild(STONE);
    },
    highlightWinningStones: function (stones) {
            stones.forEach(s => {
                const cell = document.querySelector(`[data-row="${s.row}"][data-col="${s.col}"]`);
                if (cell) cell.classList.add("winning");
            });
        },
    renderGameOver: function (result) {
        const STATUS = document.getElementById("status");

        if (result.type === "draw") {
            STATUS.textContent = "Draw!";
            return;
        }

        STATUS.textContent = `Player ${result.winner} wins!`;

        if (result.winningStones) {
            this.highlightWinningStones(result.winningStones);
        }
    },

};


