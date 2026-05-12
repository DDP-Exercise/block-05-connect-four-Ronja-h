"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.
//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.
//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

//TODO: Method to change the current player (and dispatch the according event).

        export const GAMEMODEL = {
            state:{
                board:[
                        [null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null],
                        [null, null, null, null, null, null, null]
                    ],
                currentPlayer:1 ,
                running:true,
                winner:null,
                winningStones: []
            },
            playerChange: function () {
                if (this.state.currentPlayer === 1) {
                    this.state.currentPlayer = 2;
                } else {
                    this.state.currentPlayer = 1;
                }
                const PLAYERCHANGEVENT = new CustomEvent("game:playerChanged", {
                    detail: {
                        currentPlayer: this.state.currentPlayer
                    }
                });

                document.dispatchEvent(PLAYERCHANGEVENT);
                },

            makeMove: function(col){
                if (!this.state.running) return;

                for(let row = 5; row >= 0; row = row - 1){

                    if(this.state.board[row][col] === null){

                        this.state.board[row][col] = this.state.currentPlayer;

                        const SETSTONEEVENT = new CustomEvent("game:setStone", {
                            detail: {
                                row: row,
                                col: col,
                                player: this.state.currentPlayer
                            }

                        });
                        document.dispatchEvent(SETSTONEEVENT);

                        if (this.checkWinner(row, col, this.state.currentPlayer)) {
                            this.state.winner = this.state.currentPlayer;
                            this.state.running = false;
                            this.gameOver();
                            return;
                        }
                        this.playerChange();
                        break;
                    }
                }
                let isFull = true;

                for (let rowIsFull = 0; rowIsFull < this.state.board.length; rowIsFull++) {
                    for (let colIsFull = 0; colIsFull < this.state.board[rowIsFull].length; colIsFull++) {
                        if (this.state.board[rowIsFull][colIsFull] === null) {
                            isFull = false;
                        }
                    }
                }

                if (isFull && this.state.running) {
                    this.state.running = false;

                    const DRAWEVENT = new CustomEvent("game:gameOver", {
                        detail: {
                            winner: null,
                            type: "draw"
                        }
                    });
                    document.dispatchEvent(DRAWEVENT);
                }
            },
            checkWinner: function (row, col) {
                const PLAYER = this.state.currentPlayer;
                if (this.checkHorizontal(row, col, PLAYER)) {
                    return true;
                }
                if (this.checkVertical(row, col, PLAYER)) {
                    return true;
                }
                if (this.checkDiagonal(row, col, PLAYER)) {
                    return true;
                }
                if (this.checkAntidiagonal(row, col, PLAYER)) {
                    return true;
                }
                return false;

            },
                checkHorizontal: function (row, col, player) {
                    let countH = 0;
                    for (let c = 0; c < 7; c++) {
                        if (this.state.board[row][c] === player) {
                            countH++;
                            if (countH >= 4) {
                                this.state.winningStones = [
                                    {row: row, col: c}, {row: row, col: c-1},
                                    {row: row, col: c-2}, {row: row, col: c-3}
                                ];
                                return true;
                            }
                        } else {
                            countH = 0;
                        }
                    }
                    return false;
                },

                checkVertical: function (row, col, player) {
                    let countV = 0;
                    for (let r = 0; r < 6; r++) {
                        if (this.state.board[r][col] === player) {
                            countV++;
                            if (countV >= 4) {
                                this.state.winningStones = [
                                    {row: r, col: col}, {row: r-1, col: col},
                                    {row: r-2, col: col}, {row: r-3, col: col}
                                ];
                                return true;
                            }
                        } else {
                            countV = 0;
                        }
                    }
                    return false;
                },
            checkDiagonal: function (row, col, player) {
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 4; c++) {
                        if (
                            this.state.board[r][c] === player &&
                            this.state.board[r + 1][c + 1] === player &&
                            this.state.board[r + 2][c + 2] === player &&
                            this.state.board[r + 3][c + 3] === player
                        ) {
                            this.state.winningStones = [
                                {row: r, col: c}, {row: r + 1, col: c + 1},
                                {row: r + 2, col: c + 2}, {row: r + 3, col: c + 3}
                            ];
                            return true;
                        }
                    }
                }
                return false;
            },
            checkAntidiagonal: function (row, col, player) {
                for (let r = 3; r < 6; r++) {
                    for (let c = 0; c < 4; c++) {
                        if (
                            this.state.board[r][c] === player &&
                            this.state.board[r - 1][c + 1] === player &&
                            this.state.board[r - 2][c + 2] === player &&
                            this.state.board[r - 3][c + 3] === player
                        ) {
                            this.state.winningStones = [
                                {row: r, col: c}, {row: r - 1, col: c + 1},
                                {row: r - 2, col: c + 2}, {row: r - 3, col: c + 3}
                            ];
                            return true;
                        }
                    }
                }
                return false;
            },
            gameOver: function () {
                const GAMEOVEREVENT = new CustomEvent("game:gameOver", {
                    detail: {
                        winner: this.state.winner,
                        winningStones: this.state.winningStones
                    }
                });

                document.dispatchEvent(GAMEOVEREVENT);
            }
        };



