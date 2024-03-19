import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSnippetComponent } from './audio-snippet.component';

describe('AudioSnippetComponent', () => {
  let component: AudioSnippetComponent;
  let fixture: ComponentFixture<AudioSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioSnippetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
