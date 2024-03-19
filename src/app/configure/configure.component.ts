import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { StorageService } from "src/services/storage.service";
import { Router } from "@angular/router";
import { GameService } from "src/services/game.service";

@Component({
	selector: "app-configure",
	templateUrl: "./configure.component.html",
	styleUrls: ["./configure.component.css"],
})
export class ConfigureComponent implements OnInit {
	genres: any[] = [];
	configForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private spotifyService: SpotifyService,
		private storageService: StorageService,
		private gameService: GameService,
		private router: Router
	) {
		this.configForm = this.fb.group({
			selectedGenre: [""],
			difficulty: ["easy"],
			gameType: ["song"],
		});
	}

	ngOnInit(): void {
		this.loadGenres();
	}

	async loadGenres() {
		this.genres = await this.spotifyService.loadGenres();
	}

	private startGame(settings: any) {
		this.gameService.startGame(settings);
		this.router.navigate(["/game"]);
	}

	onSubmit() {
		console.log(this.configForm.value);
		this.storageService.save("gameSettings", this.configForm.value);
		this.startGame(this.configForm.value);
	}
}
