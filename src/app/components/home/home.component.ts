import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from "angular2-materialize";
import { AuthHelperService } from "../../utilities/auth-helper.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  globalActions = new EventEmitter<string | MaterializeAction>();

  constructor(private authHelperService: AuthHelperService) {
  }

  ngOnInit() {
  }

}
