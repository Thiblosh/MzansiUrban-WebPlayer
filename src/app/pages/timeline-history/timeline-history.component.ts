import { Component, OnInit } from '@angular/core';
import { NowPlayingService } from 'src/app/services/streaming/now-playing.service';
import { Track } from 'src/app/models/track';

@Component({
  selector: 'app-timeline-history',
  templateUrl: './timeline-history.component.html',
  styleUrls: ['./timeline-history.component.scss']
})
export class TimelineHistoryComponent implements OnInit {

  tracks: Track[] = [];

  tracksLoading = false;

  constructor(private npService: NowPlayingService) { }

  setTracks(): void {
    this.tracks = Object.assign([], this.npService.recentlyPlayed).reverse();
  }

  ngOnInit() {
    // Set tracksLoading variable
    this.tracksLoading = true;

    // If iTunes formatting enabled, format all tracks
    if (this.npService.shouldFormatTracks() && this.npService.recentlyPlayed.length) {
      // Set tracks
      this.setTracks();
    }

    // Watch npService npUpdate event
    this.npService.npUpdate.subscribe((updated) => {
      this.setTracks();
    });

    // Set tracksLoading to false
    this.tracksLoading = false;
  }

}
