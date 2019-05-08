import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerComponent } from './pages/player/player.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TimelineHistoryComponent } from './pages/timeline-history/timeline-history.component';
import { CarouselHolderComponent } from './pages/carousel-holder/carousel-holder.component';
import { NowPlayingComponent } from './pages/now-playing/now-playing.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    TimelineHistoryComponent,
    CarouselHolderComponent,
    NowPlayingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
