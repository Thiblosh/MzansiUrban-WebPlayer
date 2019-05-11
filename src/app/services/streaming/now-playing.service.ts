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

  radioTitle() {
    console.log('Testing the fetch method');
    const tracksList = [];
    // let current = Track;
    // let currentArtist = '';
    // let currentSong = '';
    const url = 'http://radioinbox.co.za:8000/json.xsl?callback=?';

    this.http.get(url).subscribe(res => {
      const nowSongInfo = this.mainPlayerCurrentlyPlaying(res);
      const artist = nowSongInfo[0].trim();
      const song = nowSongInfo[1].trim();

      const trackData = JSON.parse(nowSongInfo);
      this.lastFMSongInfoAPI(artist, song);

      // if ((artist !== currentArtist) && (song !== currentSong)) {
      //   currentArtist = artist;
      //   currentSong = song;
      //   this.lastFMSongInfoAPI(currentArtist, currentSong);
      // }

      // Push new track to tracksList
      tracksList.push(new Track(trackData));

      // Return formatted tracksList
      return tracksList;
    });

  }

  lastFMSongInfoAPI(artist, track) {
    const lastfmAPIKey = '15c555d462be60c90948b7d4e74882de';
    // tslint:disable-next-line: max-line-length
    let url = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + lastfmAPIKey + '&artist=' + artist + '&track=' + track + '&format=json';
    url = encodeURI(url);


  }

  mainPlayerCurrentlyPlaying(json) {
    let currentMount = '/mzansiurban1';

    if (currentMount !== '') {
      const title = json['mounts'][currentMount]['title'];

      if (title.indexOf('Unknown') > -1) {
        return ['Song Information Not Available.', 'Mzansi Urban Radio'];
      } else {
        return this.formatCurrentTitle(title);
      }
    } else {
      return '---';
    }
  }

  formatCurrentTitle(title) {
    if (title !== '') {
      if (title.indexOf('Unknown') > -1) {
        return ['Song Information Not Available.', 'Mzansi Urban Radio'];
      } else if (title.indexOf('Jingle') > -1) {
        return ['Mzansi Urban Radio', 'The Southern Urban Experience'];
      } else {
        const details = title.split('-');
        return details;
      }
    } else {
      return ['Song Information Not Available.', 'Mzansi Urban Radio'];
    }
  }

  // $(document).ready(function () {
  //   setTimeout(function () {
  //     radioTitle();
  //   }, 2000);
  //   setInterval(function () {
  //     radioTitle();
  //   }, 15000);
  // });


}
