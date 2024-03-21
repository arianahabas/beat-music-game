import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaderboardEntry, StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-results',
  template: `
    Name: <input type="text" [formControl]="nameControl" />
  `,
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  configForm!: FormGroup;
  score: number = 0
  alert: boolean = false;
  alertMessage: string = "";

  constructor(private fb: FormBuilder, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.score = this.storageService.load('playerScore');
    this.highScore(this.score);
  }

  private createForm() {
    this.configForm = this.fb.group({
      name: ["", Validators.required]
    });
  }

  // alerts user if they got a new high score for their current genre
  private highScore(playerScore: number) {
    const genre = this.storageService.load("gameSettings").genreName;
    const scoresByGenre = this.storageService.getLeaderboard(genre);
    if (scoresByGenre.length === 0) {
      this.alert = true;
      this.alertMessage = "New High Score!"
      return
    }
    const highestScore = scoresByGenre.reduce((max, current) => max > current.score ? max : current.score, scoresByGenre[0].score);
    if (playerScore > highestScore) {
      this.alert = true;
      this.alertMessage = "New High Score!"
    }
  }

  onSubmit() {
    if (this.configForm.valid) {
      const playerScore = this.storageService.load('playerScore');
      const gameSettings = this.storageService.load('gameSettings');
      if (gameSettings && playerScore !== undefined) {
        const entry: LeaderboardEntry = {
          name: this.configForm.value.name,
          score: playerScore,
          genre: gameSettings.selectedGenre.name
        };
        this.storageService.addLeaderboardEntry(entry);
        this.configForm.reset();
        this.router.navigateByUrl("/leaderboard")
      } else {
        this.alert = true;
        this.alertMessage = "Game settings or player score missing.";
      }
    } else {
      this.alert = true;
      this.alertMessage = "Please enter your name.";
    }
  }

  closeAlert() {
    this.alert = false;
  }


}
