import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-audio-snippet',
  templateUrl: './audio-snippet.component.html',
  styleUrls: ['./audio-snippet.component.css']
})
export class AudioSnippetComponent implements OnInit {

  @Input() song = ""

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['song'] && changes['song'].currentValue) {
      this.updateSong(this.song)
    }
  }

  private updateSong(newSong: string) {
    this.song = newSong
    const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
    if (audioPlayer) {
      audioPlayer.src = newSong;
      audioPlayer.load();
      audioPlayer.play();
    }
  }
}
