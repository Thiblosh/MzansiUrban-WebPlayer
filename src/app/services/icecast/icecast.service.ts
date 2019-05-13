import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Icecast } from 'src/app/models/icecast';

@Injectable()
export class IcecastService {
  constructor(private http: HttpClient) { }
  private icecastURL = environment.now_playing.alt_url;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  private extractData(res: any): Icecast {
    console.log('sources: ');

    const body = res.json();
    return body.icestats || {};
  }

  getIcecast(): Promise<Icecast> {
    console.log('sources: ');

    return this.http.get(this.icecastURL, { responseType: 'text' })
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

}
