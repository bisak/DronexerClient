import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from "angular2-materialize";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  globalActions = new EventEmitter<string|MaterializeAction>();

  constructor() {
  }

  ngOnInit() {
  }

  triggerToast() {
    this.globalActions.emit('toast')
  }

}
