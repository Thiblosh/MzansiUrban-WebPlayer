import { Component, OnInit } from '@angular/core';
import { UiService } from './services/ui/ui.service';
import { StreamingService } from './services/streaming/streaming.service';
import { NotificationService } from './services/notification/notification.service';

import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { Icecast } from './models/icecast';
import { Source } from './models/source';
import { Observable } from 'rxjs';
import { IcecastService } from './services/icecast/icecast.service';

@Component({
  selector: 'app-root',
  animations: [
    trigger('routerTransition', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateY(100%)' }),
            animate('1s ease-in-out', style({ transform: 'translateY(0%)' }))
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateY(0%)' }),
            animate('1s ease-in-out', style({ transform: 'translateY(100%)' }))
          ], { optional: true }),
        ])
      ])
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {
  title = 'MzansiUrbanLivePlayer';
  showMenu = false;
  darkModeActive = false;
  // streamingPlayer;

  constructor(public ui: UiService,
    public streaming: StreamingService,
    public notifications: NotificationService) {
  }

  ngOnInit() {
    this.ui.darkModeState.subscribe((value) => {
      this.darkModeActive = value;
    });
  }

  // onSelect(source: Source): void {
  //   this.selectedSource = source;
  // }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  modeToggleSwitch() {
    this.ui.darkModeState.next(!this.darkModeActive);
  }

  getState(outlet): string {
    return outlet.activatedRouteData.state;
  }

  removeNotification(id: string): void {
    this.notifications.remove(id);
  }

}
