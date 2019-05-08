import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './pages/player/player.component';
import { TimelineHistoryComponent } from './pages/timeline-history/timeline-history.component';

const routes: Routes = [
  { path: '', redirectTo: '/player', pathMatch: 'full' },
  { path: 'player', component: PlayerComponent, data: { state: 'player' } },
  { path: 'timeline', component: TimelineHistoryComponent, data: { state: 'timeline' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
