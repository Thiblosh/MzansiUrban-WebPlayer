import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShowData } from 'src/app/models/show-data';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShowLineupService {

  constructor(private http: HttpClient) { }

  fetch() {
    const dataUrl = environment.show_lineup.url;
    return this.http.get(dataUrl);
  }
}
