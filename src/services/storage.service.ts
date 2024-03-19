import { Injectable } from "@angular/core";

interface LeaderboardEntry {
  name: string;
  score: number;
  genre: string;
}

const MOCK_LEADERBOARD_DATA = [
  { name: 'Alice', score: 250 },
  { name: 'Bob', score: 200 },
  { name: 'Charlie', score: 150 },
  { name: 'Ann', score: 3 },
  { name: 'Mike', score: 97 },
  { name: 'Bill', score: 5 },
  { name: 'Kelly', score: 46 },
  { name: 'Carol', score: 20 },
];

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() { }
  // Save data to local storage
  save(key: string, data: any): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error("Error saving to local storage", error);
    }
  }

  // Load data from local storage
  load(key: string): any {
    try {
      const serializedData = localStorage.getItem(key);
      return serializedData ? JSON.parse(serializedData) : null;
    } catch (error) {
      console.error("Error loading from local storage", error);
      return null;
    }
  }


  //TODO : update implementation with user and score (populate genre?)
  addLeaderboardEntry(entry: LeaderboardEntry): void {
    const leaderboard: LeaderboardEntry[] = this.getLeaderboard();
    leaderboard.push(entry);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  }


  getLeaderboard(passedGenre?: string): LeaderboardEntry[] {
    const savedSettings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
    const genre = passedGenre || savedSettings.genre;

    let leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    if (genre) {
      leaderboard = leaderboard.filter(entry => entry.genre === genre);
    }
    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard;
  }

  initializeWithMockData(): void {
    localStorage.setItem('leaderboard', JSON.stringify(MOCK_LEADERBOARD_DATA));
  }
}
