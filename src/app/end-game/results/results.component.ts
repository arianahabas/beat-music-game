import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-results',
  template: `
    Name: <input type="text" [formControl]="nameControl" />
  `,
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

  onSubmit() {
    const nameValue = this.nameControl.value;
    console.log('Submitted name:', nameValue);
  }

}
