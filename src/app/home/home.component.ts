import { Component, OnInit } from '@angular/core';
import { TNSRecorder, TNSPlayer } from 'nativescript-audio';
import { knownFolders, path } from '@nativescript/core';
import { RouterExtensions } from '@nativescript/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private recorder: TNSRecorder;
  private player: TNSPlayer;
  isRecording = false;
  recordedFilePath: string;

  constructor(private routerExtensions: RouterExtensions) {
    this.recorder = new TNSRecorder();
    this.player = new TNSPlayer();
  }

  ngOnInit() {}

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    const currentDate = new Date();
    const fileName = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}-${currentDate.getMinutes().toString().padStart(2, '0')}-${currentDate.getSeconds().toString().padStart(2, '0')}.m4a`;
    this.recordedFilePath = path.join(knownFolders.documents().path, fileName);

    this.recorder.start({
      filename: this.recordedFilePath,
      metering: true,
      infoCallback: (info) => {
        console.log(info);
      },
      errorCallback: (error) => {
        console.log(error);
      }
    }).then(() => {
      this.isRecording = true;
    });
  }

  stopRecording() {
    this.recorder.stop().then(() => {
      this.isRecording = false;
      this.playRecording();
    });
  }

  playRecording() {
    this.player.playFromFile({
      audioFile: this.recordedFilePath,
      loop: false
    }).then(() => {
      console.log('Audio file played');
    }).catch((error) => {
      console.error('Error playing audio:', error);
    });
  }

  navigateToRecordings() {
    this.routerExtensions.navigate(['/recordings']);
  }
}