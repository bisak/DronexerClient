import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthHelperService } from '../../utilities/auth-helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authHelperService: AuthHelperService, private router: Router) {
  }

  ngOnInit() {
    if (this.authHelperService.isLoggedIn()) {
      this.router.navigate(['/discover']);
    }
  }

}
