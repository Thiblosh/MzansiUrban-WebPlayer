import { Injectable, EventEmitter } from '@angular/core';
import { Track } from 'src/app/models/track';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { Observable, Subject, pipe } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NowPlayingService {

  public recentlyPlayed: Track[] = [];

  public npUpdate: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) { }

  dummyTrack(): Track {
    const dateObj = new Date();
    return new Track({
      title: environment.now_playing.default_title,
      artist: environment.now_playing.default_artist,
      played_at: dateObj.getTime(),
      duration: 10000
    });
  }

  hasTrackHasBeenRecentlyPlayed(track: Track): boolean {
    return this.recentlyPlayed.find(obj => obj['played_at'] === track['played_at']) !== undefined;
  }

  getRecentlyPlayed(): Track[] {
    return this.recentlyPlayed.reverse();
  }

  addRecentlyPlayed(track: Track): void {

    if (track) {

      const nextIndex = this.recentlyPlayed.length;

      this.recentlyPlayed[nextIndex] = track;

    }
  }

  shouldFormatTracks(): boolean {
    return environment.now_playing.format_tracks;
  }

  formatItunes(track: Track) {
    let searchUrl = 'https://itunes.apple.com/search?term=';
    console.log('testing serach ');
    searchUrl += encodeURI(track.title + ' by ' + track.artist);

    searchUrl += '&limit=1&entity=song';

    return this.http.get(searchUrl).pipe(
      map((results: any) => {
        if (results.resultCount >= 1) {
          results.results.map((result: any) => {
            track.title = result.trackCensoredName;
            track.album = result.collectionCensoredName;
            track.artist = result.artistName;
            track.cover_art = result.artworkUrl100.replace('100x100', '256x256');
          });
        }

        return track;
      })
    );
  }

  fetch(limit): Observable<Track[]> {
    const dataUrl = environment.now_playing.data_url.replace('{{limit}}', limit);
    console.log('Testing the fetch method');
    return this.http.get(dataUrl, {
      responseType: 'text'
    }).pipe(
      map((data: any) => {
        const results: any = [];

        const tracksList = [];

        if (environment.now_playing.provider === 1) {
          // Triton Digital

          // Parse XML to JSON
          xml2js.parseString(data, (error, parsed) => {

            // If list of tracks is found, begin loop
            if (parsed['nowplaying-info-list'] && parsed['nowplaying-info-list']['nowplaying-info']) {

              // Loop through track properties and populate trackData
              for (const track of parsed['nowplaying-info-list']['nowplaying-info']) {

                // Create track data for later use
                const trackData = {};

                track['property'].map((prop) => {
                  if (prop['$']['name'] === 'cue_title') {
                    trackData['title'] = prop['_'];
                  } else if (prop['$']['name'] === 'track_artist_name') {
                    trackData['artist'] = prop['_'];
                  } else if (prop['$']['name'] === 'track_album_name') {
                    trackData['album'] = prop['_'];
                  } else if (prop['$']['name'] === 'cue_time_start') {
                    trackData['played_at'] = prop['_'];
                  } else if (prop['$']['name'] === 'cue_time_duration') {
                    trackData['duration'] = prop['_'];
                  }
                });

                // If track doesn't have played_at grab it from timestamp attribute
                if (trackData['played_at'] == undefined) {
                  trackData['played_at'] = track['$']['timestamp'] * 1000;
                }

                // Push new Track to tracksList
                tracksList.push(new Track(trackData));
              }
            }
          });
        } else if (environment.now_playing.provider === 2) {
          // RadioDJ

          // Parse JSON
          const trackData = JSON.parse(data);

          // Push new track to tracksList
          tracksList.push(new Track(trackData));

        }

        // Return formatted tracksList
        return tracksList;
      }
      )
    );
  }

}
