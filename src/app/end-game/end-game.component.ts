import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-end-game',
  templateUrl: './end-game.component.html',
  styleUrls: ['./end-game.component.css']
})
export class EndGameComponent implements OnInit {

  // TODO: Add PlayAgain button which restarts game with the same settings

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onHome() {
    this.router.navigateByUrl("/")
  }

  onCustomizeGame() {
    this.router.navigateByUrl("/customize")
  }

  onLeaderboard() {
    this.router.navigateByUrl("/leaderboard")
  }

}
