import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  public degree = 25;
  public moreSlides = 3;

  constructor() { }

  ngOnInit() {
  }

}
