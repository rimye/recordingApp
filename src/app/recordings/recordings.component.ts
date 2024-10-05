import { Component, OnInit } from '@angular/core';
import { knownFolders, File, Folder } from '@nativescript/core';
import { TNSPlayer } from 'nativescript-audio';
import { RouterExtensions } from '@nativescript/angular';

@Component({
  selector: 'app-recordings',
  templateUrl: './recordings.component.html',
  styleUrls: ['./recordings.component.css']
})
export class RecordingsComponent implements OnInit {
  recordings: string[] = [];
  private player: TNSPlayer;
  currentlyPlaying: string | null = null;

  constructor(private routerExtensions: RouterExtensions) {
    this.player = new TNSPlayer();
  }

  ngOnInit() {
    this.loadRecordings();
  }

  loadRecordings() {
    const folder = knownFolders.documents();
    folder.getEntities()
      .then((entities) => {
        this.recordings = entities
          .filter(entity => entity instanceof File && entity.name.endsWith('.m4a'))
          .map(file => file.name)
          .sort((a, b) => b.localeCompare(a));
      })
      .catch((error) => {
        console.error('Error loading recordings:', error);
      });
  }

  playRecording(fileName: string) {
    if (this.currentlyPlaying) {
      this.player.pause();
      if (this.currentlyPlaying === fileName) {
        this.currentlyPlaying = null;
        return;
      }
    }

    const filePath = knownFolders.documents().getFile(fileName).path;
    this.player.playFromFile({
      audioFile: filePath,
      loop: false
    }).then(() => {
      console.log('Audio file played');
      this.currentlyPlaying = fileName;
    }).catch((error) => {
      console.error('Error playing audio:', error);
    });

    this.player.on('finished', () => {
      this.currentlyPlaying = null;
    });
  }

  deleteRecording(fileName: string) {
    if (this.currentlyPlaying === fileName) {
      this.player.pause();
      this.currentlyPlaying = null;
    }

    const file = knownFolders.documents().getFile(fileName);
    file.remove()
      .then(() => {
        console.log('File deleted successfully');
        this.loadRecordings(); // Refresh the list
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
      });
  }

  onBackTap() {
    this.routerExtensions.back();
  }
}