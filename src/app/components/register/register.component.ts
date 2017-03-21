import { Component, OnInit } from '@angular/core';
import {MaterializeModule, MaterializeDirective} from 'angular2-materialize'
declare var Materialize:any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() {
  }

  private selectOptions = [];

  ngOnInit() {
    Materialize.showStaggeredList('#transition-heading');
  }

}
