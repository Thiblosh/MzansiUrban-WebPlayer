import { Injectable, EventEmitter } from '@angular/core';
import { Track } from 'src/app/models/track';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { Observable, Subject, pipe } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import * as $ from 'jquery';
import { LastFMService } from '../lastfm/lastfm.service';

@Injectable({
  providedIn: 'root'
})
export class NowPlayingService {

  public recentlyPlayed: Track[] = [];

  public npUpdate: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient, private lastFmService: LastFMService) { }

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
    return this.recentlyPlayed.find(obj => obj['title'] === track['title']) !== undefined;
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
    // const dataUrl = environment.now_playing.data_url.replace('{{limit}}', limit);
    const dataUrl = environment.now_playing.alt_url;
    console.log('Testing the fetch method');

    return this.http.get(dataUrl, {
      responseType: 'text',
    }).pipe(
      map((data: any) => {
        const tracksList = [];

        if (environment.now_playing.provider === 3 && data !== '') {
          // const str = data.substr(13).slice(0, -2); // last 2 characters & the first parseMusic(
          const obj = data.replace(/\\n/g, '').replace(/\s/g, ''); // remove newline & whitespce
          const stringObject = JSON.parse(obj);

          const nowSongInfo = this.mainPlayerCurrentlyPlaying(stringObject);
          const artist = nowSongInfo[0].trim();
          const song = nowSongInfo[1].trim();

          // Create track data
          const trackData = {};

          trackData['title'] = song;
          trackData['artist'] = artist;
          trackData['album'] = '';
          trackData['duration'] = '';
          if (trackData['played_at'] === undefined) {
            trackData['played_at'] = new Date().getTime();
          }

          // Push new track to tracksList
          tracksList.push(new Track(trackData));
        }

        // Return formatted tracksList
        return tracksList;
      }
      )
    );
  }

  mainPlayerCurrentlyPlaying(json) {
    let resources = json['icestats']['source'];
    let title;
    resources.forEach(element => {
      if (element['listenurl'].indexOf('mzansiurban_high')) {
        title = element['title'];
      }
    });

    if (title.indexOf('Unknown') > -1) {
      return ['Song Information Not Available.', 'Mzansi Urban Radio'];
    } else {
      return this.formatCurrentTitle(title);
    }
  }

  formatCurrentTitle(title) {
    if (title.indexOf('Unknown') > -1) {
      return ['Song Information Not Available.', 'Mzansi Urban Radio'];
    } else if (title.indexOf('Jingle') > -1) {
      return ['Mzansi Urban Radio', 'The Southern Urban Experience'];
    } else {
      const details = title.split('-');
      return details;
    }
  }
}
