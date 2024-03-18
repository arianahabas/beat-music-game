import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { ConfigureComponent } from "./configure/configure.component";
import { GameComponent } from './game/game.component';

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "configure", component: ConfigureComponent },
  { path: "game", component: GameComponent },
];

@NgModule({
	declarations: [AppComponent, HomeComponent, ConfigureComponent, GameComponent],
	imports: [
		BrowserModule,
		FormsModule,
		RouterModule.forRoot(routes),
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
