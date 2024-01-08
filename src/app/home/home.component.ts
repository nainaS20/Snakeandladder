import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private router = inject(Router)

  startGame() {
    // Navigate to the board route when the "Start" button is pressed
    this.router.navigate(['/board']);
  }
}
