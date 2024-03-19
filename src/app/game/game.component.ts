import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { StorageService } from "../../services/storage.service";
import { Router } from "@angular/router";
import { GameService } from "src/services/game.service";
import { take } from "rxjs/operators";

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit, OnDestroy {
	//songs
	currentTrack: any;
	options: string[] = [];
	correctAnswer: string = "";
	gameSettings: any;

	//timer
	countdown: number = 5;
	showCountdown: boolean = true;
	timeLeft: number = 0;

	//feedback
	isCorrectAnswer: boolean | null = null;
	feedbackVisible = false;
	feedbackSlideOut = false;

	private subscriptions = new Subscription();

	constructor(
		private gameService: GameService,
		private storageService: StorageService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.gameSettings = this.storageService.load("gameSettings");
		if (!this.gameSettings) {
			this.router.navigate(["/configure"]);
			return;
		} else {
			this.startCountdown();
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
	}

	startCountdown(): void {
		const countdown$ = timer(1000, 1000).pipe(take(this.countdown));
		this.subscriptions.add(
			countdown$.subscribe({
				next: () => {
					this.countdown -= 1;
				},
				complete: () => {
					this.showCountdown = false;
					this.gameService.startGame(this.gameSettings);
					this.observeGameChanges();
				},
			})
		);
	}

	handleGuess(selectedOption: string) {
		const isCorrect = selectedOption === this.correctAnswer;
		this.isCorrectAnswer = isCorrect;
		this.gameService.makeGuess(isCorrect);
		this.showFeedback();
	}

	showFeedback() {
		this.feedbackVisible = true;
		this.feedbackSlideOut = false; 

		setTimeout(() => {
			this.feedbackSlideOut = true; 
			setTimeout(() => {
				this.feedbackVisible = false;
			}, 500); 
		}, 1000); 
	}

	private shuffleOptions(options: string[]): string[] {
		for (let i = options.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[options[i], options[j]] = [options[j], options[i]];
		}
		return options;
	}
}
