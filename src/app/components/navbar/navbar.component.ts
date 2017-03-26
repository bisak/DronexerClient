import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ToastService } from "../../services/toast.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private username: String
  private routerLinkOpts = {exact:true}

  constructor(private authService: AuthService,
              private router: Router,
              private toastService: ToastService,) {
    authService.loginAnnounced.subscribe(data => {
      this.username = this.getUsername()
    })
  }


  ngOnInit() {
    this.username = this.getUsername()
  }

  onLogoutClick() {
    this.authService.logout();
    this.toastService.toast('Logged out.');
    this.router.navigate(['/'])
    return false;
  }

  private getUsername() {
    const authToken = this.authService.getDecodedAuthToken()
    if (authToken)
      return authToken._doc.username
  }

}
