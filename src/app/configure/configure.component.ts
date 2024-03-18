import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { StorageService } from "src/services/storage.service";
import { Router } from '@angular/router';

@Component({
	selector: "app-configure",
	templateUrl: "./configure.component.html",
	styleUrls: ["./configure.component.css"],
})
export class ConfigureComponent implements OnInit {
	genres: any[] = [];
	configForm: FormGroup;

	constructor(private fb: FormBuilder, private spotifyService: SpotifyService, private storageService: StorageService, private router: Router ) {
		this.configForm = this.fb.group({
			selectedGenre: [""],
			difficulty: ["easy"], 
      gameType: ["song"]
		});
	}

	ngOnInit(): void {
		this.loadGenres();
	}

	async loadGenres() {
		this.genres = await this.spotifyService.loadGenres();
	}

	onSubmit() {
		console.log(this.configForm.value);
    this.storageService.save('gameSettings', this.configForm.value);
    this.router.navigate(['/game']);
	}
}
