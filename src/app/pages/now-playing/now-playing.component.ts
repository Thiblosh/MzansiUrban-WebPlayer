import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { NowPlayingService } from 'src/app/services/streaming/now-playing.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ShowLineupService } from 'src/app/services/streaming/show-lineup.service';
import { Source } from 'src/app/models/source';
import { LastFM } from 'src/app/models/lastfm';
import { environment } from 'src/environments/environment.prod';
import { LastFMService } from 'src/app/services/lastfm/lastfm.service';
import { Icecast } from 'src/app/models/icecast';
import { IcecastService } from 'src/app/services/icecast/icecast.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class NowPlayingComponent implements OnChanges, OnInit {
  currentTrack: any;
  trackLoaded = false;
  streamingPlayer;
  showData: any;

  icecast: Icecast;
  sources: Source[];
  selectedSource: Source;

  @Input() source: Source;
  private audioPlayer: any;
  private isPlaying = false;
  private currentMount: string;
  private lastFMresponce: LastFM;
  private currentSource: Source;
  // tslint:disable-next-line: variable-name
  private album_art: string;

  constructor(private npService: NowPlayingService,
    private showDataService: ShowLineupService,
    public streaming: StreamingService,
    private icecastService: IcecastService,
    private notifications: NotificationService,
    private lastFMService: LastFMService) {
  }

  getIcecast(): void {
    this.icecastService.getIcecast().then(
      icecast => {
        this.icecast = icecast;
        this.sources = [].concat(this.icecast.source);
        if (this.selectedSource) {
          // update selected source data
          for (const sourceData of this.sources) {
            if (sourceData.server_name === this.selectedSource.server_name) {
              this.selectedSource = sourceData;
            }
          }
        } else {
          // select first source
          this.selectedSource = this.sources[1];
          console.log('source: ' + this.selectedSource.server_name);
        }
      }
    );
  }

  getAlbumArt(artist: string, track: string): void {
    this.lastFMService.getTackInfo(artist, track).then(
      lastfm => {
        this.lastFMresponce = lastfm;
        this.album_art = environment.now_playing.generic_cover;

        if (this.lastFMresponce.error) {
          console.log('Error: ', this.lastFMresponce.message);
        } else {
          console.log(this.lastFMresponce.track["album"]);
          if (this.lastFMresponce.track["album"]) {
            if (this.lastFMresponce.track["album"].image.length > 0) {
              // get last (largest) image
              const imgIndex = this.lastFMresponce.track["album"].image.length - 1;
              const art_url = this.lastFMresponce.track.album.image[imgIndex]['#text'];
              if (art_url) {
                this.album_art = art_url;
              } else {
                console.log('lastfm returned blank album art!');
              }
            }
          }
        }
      }
    );
  }

  ngOnChanges(): void {
    console.log('source: ' + this.source);

    if (this.source) {
      // make sure this.currentSource is defined
      if (!this.currentSource) {
        this.currentSource = this.source;
        // update album art
        this.getAlbumArt(this.source.artist, this.source.title);
      }
      if (this.currentMount !== this.source.server_name) {
        // switching to new mount
        this.currentMount = this.source.server_name;

        // update audio player
        this.audioPlayer.src = this.source.listenurl;
        this.audioPlayer.pause();
        this.audioPlayer.load();
        if (this.isPlaying) {
          this.audioPlayer.play();
        }
      }
      if (this.source.artist !== this.currentSource.artist || this.source.title !== this.currentSource.title) {
        // update album art
        this.getAlbumArt(this.source.artist, this.source.title);
        this.currentSource = this.source;
      }
    }
  }

  getCurrentTrack(): void {
    this.trackLoaded = false;

    this.ngOnChanges();

    // Retrieve current track
    this.npService.fetch(1).subscribe((response) => {

      setTimeout(() => {
        // tslint:disable-next-line: no-shadowed-constiable
        this.npService.formatItunes(response[0]).subscribe((response) => {

          // Push current track to recentlyPlayed if is different that latest
          if (response && !this.npService.hasTrackHasBeenRecentlyPlayed(response)) {
            this.npService.addRecentlyPlayed(response);

            // npUpdate event
            this.npService.npUpdate.next(true);
          }

          // Update currentTrack
          this.currentTrack = response;

          // Set trackLoaded
          this.trackLoaded = true;

          // Set timeout until next expected track
          setTimeout(() => {
            this.getCurrentTrack();
          }, this.currentTrack.timeUntilEnds());
        });
      }, 500);
    }, (error) => {
      setTimeout(() => {
        // Add error notification
        this.notifications.create('error', 'Unable to load now playing information.');

        // Set track with dummy track
        this.currentTrack = this.npService.dummyTrack();

        // Set trackLoaded to true
        this.trackLoaded = true;

        // Set 10 second timeout and check for track again
        setTimeout(() => {
          this.getCurrentTrack();
        }, 30000);
      }, 500);
    });
  }

  toggleStreamingPlayer(): void {
    if (this.streaming.player.playing()) {
      this.streaming.pause();
    } else {
      this.streaming.play();
    }
  }

  play(): void {
    if (!this.streaming.player.playing()) {
      this.streaming.play();
    }
  }

  stop(): void {
    if (this.streaming.player.playing()) {
      this.streaming.pause();
    }
  }

  getShowData() {
    this.showDataService.fetch().subscribe(data => {
      this.showData = data;
    });
  }

  ngOnInit() {
    this.getIcecast();

    // Load current track onInit
    this.getCurrentTrack();
    this.getShowData();

    // Watch when streaming is played to keep now playing up-to-date
    this.streaming.played.subscribe(() => {
      // Set current track
      this.getCurrentTrack();
      // Set shows
      this.getShowData();
    });
  }


}
