import {Component, OnInit, EventEmitter} from '@angular/core';
import {AuthHelperService} from "../../utilities/auth-helper.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authHelperService: AuthHelperService) {
  }

  ngOnInit() {
  }

}
