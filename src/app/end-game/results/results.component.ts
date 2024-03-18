import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-results',
  template: `
    Name: <input type="text" [formControl]="nameControl" />
  `,
  imports: [ReactiveFormsModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  // TODO: get data from the game (score)
  // TODO: Create addName form to add player's <name, score> to the leaderboard
  nameControl = new FormControl('');

  constructor() { }

  ngOnInit(): void {
  }

}
