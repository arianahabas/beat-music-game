import { Injectable } from "@angular/core";
import fetchFromSpotify from "./api";

@Injectable({
	providedIn: "root",
})
export class SpotifyService {
	private token: string = "";

	constructor() {
		this.initializeToken();
	}

  private initializeToken() {
    const storedToken = this.getTokenFromStorage();
    if (storedToken) {
      this.token = storedToken.value;
    } else {
      console.error('Spotify access token is not found in storage.');
    }
  }

  private getTokenFromStorage() {
    const storedTokenString = localStorage.getItem('whos-who-access-token');
    return storedTokenString ? JSON.parse(storedTokenString) : null;
  }

  //fetches all genres from spotify API
  async loadGenres() {
		return await fetchFromSpotify({
			token: this.token,
			endpoint: "browse/categories",
		})
			.then((response) =>
				response.categories.items.map((item: any) => ({
					id: item.id,
					name: item.name,
				}))
			)
			.catch((error) => {
				console.error("Error fetching genres:", error);
				return [];
			});
	}

  //fetches all playlists from the specified genre id
	async fetchPlaylistsByGenre(genreId: string) {
		try {
			const response = await fetchFromSpotify({
				token: this.token,
				endpoint: `browse/categories/${genreId}/playlists`,
			});
			return response.playlists.items;
		} catch (error) {
			console.error(`Error fetching playlists for genre ${genreId}:`, error);
			return [];
		}
	}


 //fetches all tracks from the playlistId and filters the tracks by difficuly (popularity rating)
	async fetchTracksFromPlaylist(playlistId: string, difficulty: string) {
		try {
			const response = await fetchFromSpotify({
				token: this.token,
				endpoint: `playlists/${playlistId}/tracks`,
			});
			const tracks = response.items.map((item: any) => item.track);
			return this.filterTracksByDifficulty(tracks, difficulty);
		} catch (error) {
			console.error(
				`Error fetching tracks from playlist ${playlistId}:`,
				error
			);
			return [];
		}
	}

  //helper method to filter the tracks based on popularity rating
	private filterTracksByDifficulty(tracks: any[], difficulty: string): any[] {
		let popularityRange = this.getPopularityRangeForDifficulty(difficulty);
		return tracks.filter(
			(track) =>
				track.popularity >= popularityRange.min &&
				track.popularity <= popularityRange.max
		);
	}

	//helper method - this may need to be broadened (maybe easy and hard only) as sometimes with the set genre and set difficulty no tracks are returned
	private getPopularityRangeForDifficulty(difficulty: string): {
		min: number;
		max: number;
	} {
		switch (difficulty) {
			case "easy":
				return { min: 65, max: 100 };
			case "medium":
				return { min: 34, max: 64 };
			case "hard":
				return { min: 0, max: 33 };
			default:
				return { min: 0, max: 100 };
		}
	}
}
