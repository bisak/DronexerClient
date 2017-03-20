import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from "angular2-materialize";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() {
  }

  modalActions = new EventEmitter<string|MaterializeAction>();

  ngOnInit() {
    this.modalActions.emit({ action: "toast", params: ['open'] });

  }

}
