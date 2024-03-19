import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/services/storage.service';

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
  configForm!: FormGroup;

  constructor(private fb: FormBuilder, private storageService: StorageService) { }

  ngOnInit(): void {
    this.createForm()
  }

  private createForm() {
    this.configForm = this.fb.group({
      name: ["", Validators.required]
    });
  }

  onSubmit() {
    console.log(this.storageService.load('gameSettings'))
    if (this.configForm.valid) {
      this.storageService.save('leaderboard', {
        'name': this.configForm.value.name,
        'score': this.storageService.load('playerScore'),
        'genre': this.storageService.load('gameSettings').selectedGenre
      });
      this.configForm.reset()
    } else {
      alert("Please complete all selections.");
    }
  }

}
