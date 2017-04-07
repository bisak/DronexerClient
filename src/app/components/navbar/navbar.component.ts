import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ToastService } from "../../services/toast.service";
import { AuthHelperService } from "../../utilities/auth-helper.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: String
  routerLinkOpts = { exact: true }

  constructor(public authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService,) {
  }

  ngOnInit() {
    this.username = this.getUsername()
    this.authHelperService.loginAnnounced.subscribe(data => {
      this.username = this.getUsername()
    })
  }

  onLogoutClick() {
    this.authHelperService.logout();
    this.toastService.toast('Logged out.');
    this.router.navigate(['/'])
    return false;
  }

  getUsername() {
    const user = this.authHelperService.getUser()
    if (user) {
      return user.username
    }
  }

}
