import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { CustomizeComponent } from "./customize/customize.component";
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "customize", component: CustomizeComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "game", component: GameComponent }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, CustomizeComponent, LeaderboardComponent, GameComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
