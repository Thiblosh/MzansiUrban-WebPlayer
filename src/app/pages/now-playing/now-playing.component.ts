import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { StreamingService } from 'src/app/services/streaming/streaming.service';
import { NowPlayingService } from 'src/app/services/streaming/now-playing.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ShowLineupService } from 'src/app/services/streaming/show-lineup.service';

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
export class NowPlayingComponent implements OnInit {

  currentTrack: any;
  trackLoaded = false;
  streamingPlayer;
  showData: any;
  // public streaming: StreamingService,
  constructor(private npService: NowPlayingService,
    private showDataService: ShowLineupService,
    public streaming: StreamingService,
    private notifications: NotificationService) {
  }

  getCurrentTrack(): void {
    // Set trackLoaded to false
    this.trackLoaded = false;

    // Retrieve current track
    this.npService.fetch(1).subscribe((response) => {

      // Set timeout to avoid CSS animation glitch, probably not the correct way to solve the issue, but it works
      setTimeout(() => {
        // Format current track with iTunes
        // tslint:disable-next-line: no-shadowed-variable
        this.npService.formatItunes(response[0]).subscribe((response) => {

          // Push current track to recentlyPlayed if is different that latest
          if (response && !this.npService.hasTrackHasBeenRecentlyPlayed(response)) {
            this.npService.addRecentlyPlayed(response);

            // Emith npUpdate event
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
