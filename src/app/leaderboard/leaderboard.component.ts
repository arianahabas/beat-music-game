import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { name: string; score: number; }[] = [];
  currentGenre: string = ''; // To store and display the current genre

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    //mock data for leaderboard
		if (!this.storageService.getLeaderboard().length) {
			this.storageService.initializeWithMockData();
		}

      const gameSettings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
      this.currentGenre = gameSettings.genre || 'All Genres'; // Fallback to 'All Genres' if not set
  
      this.leaderboard = this.storageService.getLeaderboard(this.currentGenre !== 'All Genres' ? this.currentGenre : undefined);
    }
  
}
