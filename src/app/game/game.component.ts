import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { StorageService } from "../../services/storage.service";
import { Router } from "@angular/router";
import { GameService } from "src/services/game.service";

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit, OnDestroy {
	currentTrack: any;
	timeLeft: number = 0;
	options: string[] = [];
	correctAnswer: string = "";
	gameSettings: any;
	score: number = 0;

	private subscriptions = new Subscription();

	constructor(
		private gameService: GameService,
		private storageService: StorageService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.gameSettings = this.storageService.load("gameSettings");
		if (!this.gameSettings) {
			this.router.navigate(["/configure"]);
			return;
		} else {
			this.gameService.startGame(this.gameSettings);
			this.observeGameChanges();
		}
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}

	private observeGameChanges() {
		this.subscriptions.add(
			this.gameService.currentTrack$.subscribe((track) => {
				this.currentTrack = track;
			})
		);

		this.subscriptions.add(
			this.gameService.timeLeft$.subscribe((timeLeft) => {
				this.timeLeft = timeLeft;
			})
		);

		this.subscriptions.add(
			this.gameService.correctOption$.subscribe((correctOption) => {
				console.log("New correct option:", correctOption);
				this.correctAnswer = correctOption;
			})
		);

		this.subscriptions.add(
			this.gameService.decoys$.subscribe((decoys) => {
				// Combine correct answer and decoys, then shuffle
				this.options = this.shuffleOptions([this.correctAnswer, ...decoys]);
			})
		);

		this.subscriptions.add(
			this.gameService.score$.subscribe((score) => {
				this.score = score
			})
		)
	}

	handleGuess(selectedOption: string) {
		const isCorrect = selectedOption === this.correctAnswer;
		this.gameService.makeGuess(isCorrect);
	}

	private shuffleOptions(options: string[]): string[] {
		for (let i = options.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[options[i], options[j]] = [options[j], options[i]];
		}
		return options;
	}
}
