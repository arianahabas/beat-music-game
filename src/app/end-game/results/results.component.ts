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

  constructor(private fb: FormBuilder, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.createForm()
    this.score = this.storageService.load('playerScore');
  }

  private createForm() {
    this.configForm = this.fb.group({
      name: ["", Validators.required]
    });
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
        alert("Game settings or player score missing.");
      }
    } else {
      alert("Please enter your name.");
    }
  }


}
