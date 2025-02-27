import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StorageService } from "src/services/storage.service";
import { Router } from "@angular/router";
import { GameService } from "src/services/game.service";

@Component({
	selector: "app-configure",
	templateUrl: "./configure.component.html",
})
export class ConfigureComponent implements OnInit {
	genres: any[] = [];
	configForm!: FormGroup;

	showAlert: boolean = false;
	alertMessage: string = "";

	constructor(
		private fb: FormBuilder,
		private spotifyService: SpotifyService,
		private storageService: StorageService,
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

	onSubmit() {
		if (this.configForm.valid) {
			const formValue = this.configForm.value;
			formValue.selectedGenre = JSON.parse(formValue.selectedGenre);
			this.storageService.save("gameSettings", {
				...formValue,
				genreId: formValue.selectedGenre.id,
				genreName: formValue.selectedGenre.name,
			});
			this.showAlert = false;
			this.router.navigate(["/game"]);
		} else {
			this.alertMessage = "Please complete all selections.";
			this.showAlert = true;
		}
	}
	closeAlert() {
		this.showAlert = false;
	}
}
