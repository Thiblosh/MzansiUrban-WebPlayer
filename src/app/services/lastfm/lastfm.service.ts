import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { LastFM } from 'src/app/models/lastfm';
import { environment } from 'src/environments/environment';

@Injectable()
export class LastFMService {
  headers: HttpHeaders;
  options: any;

  constructor(private http: HttpClient) {
    this.options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // tslint:disable-next-line: object-literal-key-quotes
        'Accept': 'q=0.8;application/json;q=0.9'
      })
    };
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  private extractData(res: any): LastFM {
    const body = res.json();
    console.log('Last.FM responce: ', body);
    return body || {};
  }

  getTackInfo(artist: string, track: string): Promise<LastFM> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('method', 'track.getinfo');
    params.set('api_key', environment.lastfm.LASTFM_APIKEY);
    params.set('artist', artist);
    params.set('track', track);
    params.set('format', 'json');
    this.options = ({ headers: this.headers, search: params });

    return this.http.get(environment.lastfm.LASTFM_APIURL, this.options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

}
