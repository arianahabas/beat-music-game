import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
	configForm!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private spotifyService: SpotifyService,
		private storageService: StorageService,
		private gameService: GameService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadGenres();
		this.createForm(); 
	}
	
	private createForm() {
		this.configForm = this.fb.group({
		  selectedGenre: ["", Validators.required],
		  difficulty: ["", Validators.required],
		  gameType: ["", Validators.required], 
		});
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
		if (this.configForm.valid) {
		  this.storageService.save("gameSettings", this.configForm.value);
		  this.startGame(this.configForm.value);
		} else {
		  alert("Please complete all selections.");
		}
	  }
}
