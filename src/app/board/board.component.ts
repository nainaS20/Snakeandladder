// src/app/board/board.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { specialCell } from './specialCell.model';
import { Player } from './player.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  cells: number[][] = [];
  currentPlayer: number = 1;
  prevPlayer: number | undefined
  winner: Player | null = null;
  currentRoll: number | undefined;
  startGame: boolean = false;
  diceRollSound!: HTMLAudioElement;
  gameWinningSound!: HTMLAudioElement
  private router = inject(Router);

  player1: Player = {
    name: 'Player 1',
    currCell: 0
  };

  player2: Player = {
    name: 'Player 2',
    currCell: 0
  };

  diceValue: number = 0;
  specialCells: specialCell[] = [
    {
      cell1: 3,
      cell2: 22,
    },
    {
      cell1: 5,
      cell2: 8,
    },
    {
      cell1: 11,
      cell2: 26,
    },
    {
      cell1: 17,
      cell2: 4,
    },
    {
      cell1: 19,
      cell2: 7,
    },
    {
      cell1: 21,
      cell2: 9,
    },
    {
      cell1: 20,
      cell2: 29,
    },
    {
      cell1: 27,
      cell2: 1,
    },
  ];

  ngOnInit(): void {
    this.generateGrid();
    this.diceRollSound = new Audio('assets/dice-rolling-sound.mp3');
    this.gameWinningSound = new Audio('assets/game-winning-sound.mp3')
  }

  rollDice() {
    if (this.winner) {
      return;
    }
    


    this.startGame = true
    const value = Math.floor(Math.random() * 6) + 1; // Simulating a 6-sided dice roll
    this.diceRollSound.play();
    this.diceValue = value;
    this.currentRoll = value;

    // Update player position
    const currentPlayer = this.getCurrentPlayer();
    currentPlayer.currCell = Math.min(this.diceValue+currentPlayer.currCell,30);

   // console.log(`${currentPlayer.name} is on cell: ${currentPlayer.currCell}`);

    // Check for snakes and ladders
    const newPosition = this.checkSpecialCells(currentPlayer.currCell);
    if (newPosition) {
      currentPlayer.currCell = newPosition;
      console.log(
        `${currentPlayer.name} landed on a Snake or Ladder! New position: ${newPosition}`
      );
    }

    if (currentPlayer.currCell >= 30) {
      this.winner=currentPlayer
    //  console.log(`${currentPlayer.name} wins! Game Over.`);
      this.gameWinningSound.play()
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
      return;
    }

    // Switch to the next player
    this.switchPlayer();
  }

  checkSpecialCells(currentCell: number): number | undefined {
    const specialCell = this.specialCells.find(
      (cell) => cell.cell1 === currentCell
    );

    return specialCell ? specialCell.cell2 : undefined;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer === 1 ? this.player1 : this.player2;
  }

  switchPlayer() {
    this.prevPlayer = this.currentPlayer
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  isCellHighlighted(cellValue: number): boolean {
    const player1Cell = this.player1.currCell;
    const player2Cell = this.player2.currCell;
  
    return player1Cell === cellValue || player2Cell === cellValue;
  }

  isCurrentPlayerAtCell(cell: number): boolean {
    const currentPlayer = this.getCurrentPlayer();
    return currentPlayer.currCell === cell;
  }

  getPlayerNumberForCell(cell: number): number | null {
    // Check if player 1 is at the specified cell
    if (this.player1.currCell === cell) {
      return 1;
    }
    
    // Check if player 2 is at the specified cell
    if (this.player2.currCell === cell) {
      return 2;
    }

    // Return null if no player is at the specified cell
    return null;
  }

  generateGrid() {
    let cellIndex = 1;

    for (let rowIndex = 4; rowIndex >= 0; rowIndex--) {
      const row: number[] = [];
      for (let colIndex = 0; colIndex < 6; colIndex++) {
        const zigzagIndex =
          rowIndex % 2 === 0
            ? colIndex
            : rowIndex === 4
            ? 4 - colIndex
            : 4 - colIndex + 1;
        row.push(cellIndex + zigzagIndex + rowIndex * 6);
      }
      this.cells.push(row);
    }
  }
}
