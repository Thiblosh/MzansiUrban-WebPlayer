import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Howl } from 'howler';
import { NotificationService } from '../notification/notification.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  player;
  status: string;
  @Output() played: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  constructor(private notifications: NotificationService, private http: HttpClient) {
    this.play();
  }

  private sourceFromPLS(playlistURL) {

    const promise = new Promise((resolve, reject) => {
      const sources = [];

      this.http.get(playlistURL, { responseType: 'text' }).subscribe((res) => {

        for (const line of res.split('\n')) {

          // If line is playlist "File" line, add the url from it to sources
          if (line.match(/File[0-9]=/g)) {
            // tslint:disable-next-line: max-line-length
            sources.push(line.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).toString());
          }

        }

        resolve(sources);
      }, (err) => {
        this.notifications.create('error', 'Error loading PLS file: ' + err.statusText);
      });

    });

    return promise;
  }

  private sourceFromM3U(playlistURL) {

    const promise = new Promise((resolve, reject) => {
      const sources = [];

      this.http.get(playlistURL, { responseType: 'text' }).subscribe((res) => {

        for (const line of res.split('\n')) {

          // if line is url, add it to sources
          if (line.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)) {
            sources.push(line);
          }

        }

        resolve(sources);
      }, (err) => {
        this.notifications.create('error', 'Error loading M3U file: ' + err.statusText);
      });

    });

    return promise;
  }

  private getPlaySource() {

    const promise = new Promise((resolve, reject) => {
      let sources: any = [];
      console.log('start location');
      const envSource = environment.streaming.url;

      if (envSource.split('.').pop() === 'pls') {
        // Parse PLS files
        sources = this.sourceFromPLS(envSource);
      } else if (envSource.split('.').pop() === 'm3u') {
        // Parse M3U files
        sources = this.sourceFromM3U(envSource);
      } else {
        // Standard source url
        sources.push(envSource);
      }

      return resolve(sources);
    });

    return promise;
  }


  initPlayer(sources) {

    this.player = new Howl({
      src: sources,
      format: environment.streaming.format,
      html5: environment.streaming.html5,
      onload: () => {
        this.status = 'loaded';
      },
      onloaderror: () => {
        this.status = 'loaderror';

        this.notifications.create('error', 'Unable to load media at given url.');

        this.pause();

        this.error.next();
      },
      onplayerror: (err) => {
        this.status = 'playerror';

        if (err === 1002) {
          // tslint:disable-next-line: max-line-length
          this.notifications.create('warning', 'Your browser\'s autoplay policy prevents streaming from autoplaying. Please click play to listen.');
        } else {
          this.notifications.create('error', 'Unable to stream media at given url.');
        }

        this.pause();

        this.error.next();
      },
      onplay: () => {
        this.status = 'playing';
        this.played.emit();
      },
      onend: () => {
        this.status = 'ended';
      },
      onpause: () => {
        this.status = 'paused';
      },
      onstop: () => {
        this.status = 'stopped';
      }
    });

  }

  play(): void {
    // Reset status
    this.status = undefined;

    // Get player sources array, then init player
    this.getPlaySource().then((sources) => {

      // Re-init player
      this.initPlayer(sources);

      this.player.play();
    });
  }

  pause(): void {
    // Unload player
    this.player.unload();
  }

  isPlaying(): boolean {
    return (this.player && this.player.playing());
  }

  isLoading(): boolean {
    return (this.status === undefined) ? true : false;
  }

}
