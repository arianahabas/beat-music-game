import { Component, OnInit } from "@angular/core";
import { LeaderboardEntry, StorageService } from "src/services/storage.service";

@Component({
	selector: "app-leaderboard",
	templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent implements OnInit {
	leaderboard: LeaderboardEntry[] = [];
	currentGenreName: string = "";
	genres: string[] = [];
	selectedGenre: string = "All Genres";
	constructor(private storageService: StorageService) {}

	ngOnInit(): void {
		this.genres = [
			"All Genres",
			...this.storageService.getLeaderBoardByGenre(),
		];
		// Fetch game settings to set the default genre filter
		const gameSettings = this.storageService.load("gameSettings");
		if (gameSettings && gameSettings.genreName) {
			this.selectedGenre = gameSettings.genreName;
		} else {
			this.selectedGenre = "All Genres";
		}

		this.filterLeaderboard();
	}

	filterLeaderboard(): void {
		this.leaderboard = this.storageService.getLeaderboard(
			this.selectedGenre !== "All Genres" ? this.selectedGenre : undefined
		);
	}

	onGenreChange(): void {
		this.filterLeaderboard();
	}
}
