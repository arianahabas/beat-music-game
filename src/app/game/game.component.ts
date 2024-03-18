// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { SpotifyService } from '../../services/spotify.service';
// import { StorageService } from '../../services/storage.service';

// @Component({
//   selector: 'app-game',
//   templateUrl: './game.component.html',
//   styleUrls: ['./game.component.css'],
// })
// export class GameComponent implements OnInit {
//   gameSettings: any;
//   playlists: any[] = [];
//   tracks: any[] = [];
//   currentTrackIndex: number = 0;
//   currentTrack: any = null;

//   constructor(
//     private spotifyService: SpotifyService,
//     private storageService: StorageService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.gameSettings = this.storageService.load('gameSettings');
//     if (!this.gameSettings) {
//       // If there are no settings, redirect back to configure
//       this.router.navigate(['/configure']);
//       return;
//     }
//     this.fetchPlaylistsByGenre();
//   }

//   async fetchPlaylistsByGenre() {
//     const playlists = await this.spotifyService.fetchPlaylistsByGenre(this.gameSettings.selectedGenre);
//     // For simplicity, take the first playlist and load its tracks
//     if (playlists.length > 0) {
//       this.playlists = playlists;
//       this.loadTracksFromPlaylist(playlists[0].id);
//     }
//   }

//   async loadTracksFromPlaylist(playlistId: string) {
//     this.tracks = await this.spotifyService.fetchTracksFromPlaylist(playlistId);
//     if (this.tracks.length > 0) {
//       this.startGame();
//     }
//   }

//   startGame() {
//     // Example: Start with the first track
//     this.currentTrackIndex = 0;
//     this.currentTrack = this.tracks[this.currentTrackIndex];
//     // Here you can implement further game logic, such as playing the audio, setting timers, etc.
//   }

//   nextTrack() {
//     // Move to the next track in the list
//     if (this.currentTrackIndex < this.tracks.length - 1) {
//       this.currentTrackIndex++;
//       this.currentTrack = this.tracks[this.currentTrackIndex];
//     } else {
//       // End of playlist logic here
//     }
//   }

//   // Additional methods to manage gameplay (pause, replay, score, etc.) can be added here
// }

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SpotifyService } from "../../services/spotify.service";
import { StorageService } from "../../services/storage.service";

@Component({
	selector: "app-game",
	templateUrl: "./game.component.html",
	styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
	gameSettings: any;
	tracks: any[] = [];
	currentTrackIndex: number = 0;
	currentTrack: any = null;

	//for development purposes - remove after
	numberOfTracks: number = 0;
	averagePopularity: number = 0;

	constructor(
		private spotifyService: SpotifyService,
		private storageService: StorageService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.gameSettings = this.storageService.load("gameSettings");
		if (!this.gameSettings) {
			this.router.navigate(["/configure"]);
			return;
		}
		this.loadTracks();
	}

	private async loadTracks() {
		if (this.gameSettings.selectedGenre && this.gameSettings.difficulty) {
			try {
				// Fetch playlists by the selected genre.
				const playlists = await this.spotifyService.fetchPlaylistsByGenre(
					this.gameSettings.selectedGenre
				);

				if (playlists.length > 0) {
					const selectedPlaylist = playlists[0];

					// Fetch tracks from the selected playlist, filtered by difficulty.
					this.tracks = await this.spotifyService.fetchTracksFromPlaylist(
						selectedPlaylist.id,
						this.gameSettings.difficulty
					);

					if (this.tracks.length > 0) {
						this.startGame();
						this.numberOfTracks = this.tracks.length;
						this.averagePopularity =
							this.tracks.reduce((acc, track) => acc + track.popularity, 0) /
							this.tracks.length;
					} else {
						console.log(
							"No tracks found for the selected playlist and difficulty."
						);
					}
				} else {
					console.log("No playlists found for the selected genre.");
				}
			} catch (error) {
				console.error("Failed to load tracks for the game:", error);
			}
		} else {
			console.log("Game settings are incomplete.");
		}
	}

	startGame() {
		this.currentTrackIndex = 0;
		this.updateCurrentTrack();
	}

	nextTrack() {
		// Move to the next track in the list
		if (this.currentTrackIndex < this.tracks.length - 1) {
			this.currentTrackIndex++;
			this.updateCurrentTrack();
		} else {
			//what happens at the end of the playlist ? (restart, end game, etc.)
		}
	}

	private updateCurrentTrack() {
		this.currentTrack = this.tracks[this.currentTrackIndex];

	}

}
