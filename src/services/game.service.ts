import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SpotifyService } from "./spotify.service";
import { Router } from "@angular/router";

interface GameSettings {
	selectedGenre: string;
	difficulty: string;
	gameType: string;
}

@Injectable({
	providedIn: "root",
})
export class GameService {
	private score: number = 0;
	public gameSettings!: GameSettings;
	private timerInterval?: any;
	private currentIndex = 0;
	private timeLeft = new BehaviorSubject<number>(45);
	private currentTrack = new BehaviorSubject<any>(null);
	private decoys = new BehaviorSubject<string[]>([]);
	private correctOption = new BehaviorSubject<string>("");
	private tracks = new BehaviorSubject<any[]>([]);
	

	constructor(private spotifyService: SpotifyService, private router: Router) {}

	// Observable getters for components to subscribe to.
	get timeLeft$(): Observable<number> {
		return this.timeLeft.asObservable();
	}

	get currentTrack$(): Observable<any> {
		return this.currentTrack.asObservable();
	}

	get decoys$(): Observable<string[]> {
		return this.decoys.asObservable();
	}

	get correctOption$(): Observable<string> {
		return this.correctOption.asObservable();
	}

	// Initializes the game with provided settings and starts the game timer.
	async startGame(gameSettings: any) {
		this.gameSettings = gameSettings;
		this.resetGame();
		await this.loadTracksAndPrepare(gameSettings);
		this.startTimer();
	}

	// Resets the game state, clearing the timer and setting initial values.
	private resetGame() {
		this.timeLeft.next(45);
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
			this.timerInterval = undefined;
		}
	}

	// Loads tracks based on the game settings, filters out tracks without a preview URL, and prepares the first game round.
	private async loadTracksAndPrepare(settings: any) {
		const playlists = await this.spotifyService.fetchPlaylistsByGenre(
			settings.selectedGenre
		);
		if (playlists.length > 0) {
			let tracks = await this.spotifyService.fetchTracksFromPlaylist(
				playlists[0].id,
				settings.difficulty
			);
			// Filter tracks to include only those with a preview_url.
			tracks = tracks.filter((track) => track.preview_url);
			if (tracks.length > 0) {
				this.tracks.next(tracks);
				this.currentIndex = 0;
				this.setupNextRound();
			} else {
				console.error(
					"No tracks with previews found for the selected playlist and difficulty."
				);
			}
		} else {
			console.error("No playlists found for the selected genre.");
		}
	}

	// Prepares the next game round, selecting the current track based on currentIndex, and generates the correct answer and decoys.
	private setupNextRound() {
		const tracks = this.tracks.getValue();
		if (this.currentIndex < tracks.length) {
			const currentTrack = tracks[this.currentIndex];
			this.currentTrack.next(currentTrack);
			const correctAnswer =
				this.gameSettings.gameType === "artist"
					? currentTrack.artists[0].name
					: currentTrack.name;
			this.correctOption.next(correctAnswer);
			// Shuffles tracks and selects decoys, ensuring they're different from the current track.
			const shuffledTracks = this.shuffleArray(
				tracks.filter((track) => track.id !== currentTrack.id)
			);
			const decoyAnswers = shuffledTracks
				.map((track) =>
					this.gameSettings.gameType === "artist"
						? track.artists[0].name
						: track.name
				)
				.slice(0, 3);
			this.decoys.next(decoyAnswers);
			this.currentIndex++;
		} else {
			this.endGame();
		}
	}

	// Shuffles an array and returns the shuffled array.
	private shuffleArray(array: any[]): any[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	// Starts the game timer and handles game end when the timer reaches 0.
	private startTimer() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		this.timerInterval = setInterval(() => {
			let currentTime = this.timeLeft.getValue();
			if (currentTime <= 0) {
				clearInterval(this.timerInterval);
				this.timerInterval = undefined;
				this.endGame();
			} else {
				this.timeLeft.next(currentTime - 1);
			}
		}, 1000);
	}

	// Ends the game and clears the timer.
	endGame() {
		clearInterval(this.timerInterval);
		this.router.navigate(["/results"]);
	}

	// Updates the score based on the correctness of the guess and moves to the next round.
	makeGuess(isCorrect: boolean) {
		//Add logic for scoring

		this.setupNextRound(); 
	}
}
