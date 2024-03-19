import { Injectable } from "@angular/core";

export interface LeaderboardEntry {
	name: string;
	score: number;
	genre: string;
}

@Injectable({
	providedIn: "root",
})
export class StorageService {
	constructor() {}
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

	addLeaderboardEntry(entry: LeaderboardEntry): void {
		let leaderboard = this.load("leaderboard") || [];
		leaderboard.push(entry);
		this.save("leaderboard", leaderboard);
	}

	getLeaderboard(genreName?: string): LeaderboardEntry[] {
		let leaderboard: LeaderboardEntry[] = JSON.parse(
			localStorage.getItem("leaderboard") || "[]"
		);
		if (genreName) {
			leaderboard = leaderboard.filter((entry) => entry.genre === genreName);
		}
		leaderboard.sort((a, b) => b.score - a.score);
		return leaderboard;
	}

	getLeaderBoardByGenre(): string[] {
		const allEntries: LeaderboardEntry[] = JSON.parse(
			localStorage.getItem("leaderboard") || "[]"
		);
		const genres = allEntries
			.map((entry) => entry.genre)
			.filter((value, index, self) => self.indexOf(value) === index);
		return genres;
	}
}
