import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerComponent } from './pages/player/player.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TimelineHistoryComponent } from './pages/timeline-history/timeline-history.component';
import { NowPlayingComponent } from './pages/now-playing/now-playing.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareComponent } from './pages/share/share.component';
import { LastFMService } from './services/lastfm/lastfm.service';
import { IcecastService } from './services/icecast/icecast.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    TimelineHistoryComponent,
    NowPlayingComponent,
    ShareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule
  ],
  providers: [
    LastFMService,
    IcecastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
