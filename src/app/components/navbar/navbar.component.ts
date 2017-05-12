import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ToastService } from "../../services/toast.service";
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { PicturesService } from "../../services/pictures.service";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string;
  profilePicUrl: string;
  fullName: string;
  routerLinkOpts = {exact: true};

  constructor(public authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService,
              private picturesService: PicturesService) {
  }

  ngOnInit() {
    let decodedToken = this.authHelperService.getDecodedAuthToken()
    if (decodedToken)
      this.fullName = `${decodedToken.firstName} ${decodedToken.lastName}`;

    this.username = this.authHelperService.getUsernameFromToken();
    this.profilePicUrl = this.picturesService.getProfilePicUrl(this.username);

    this.authHelperService.loginAnnounced.subscribe(data => {
      console.log("here")
      let decodedToken = this.authHelperService.getDecodedAuthToken()
      this.username = this.authHelperService.getUsernameFromToken();
      this.fullName = `${decodedToken.firstName} ${decodedToken.lastName}`;
      this.profilePicUrl = this.picturesService.getProfilePicUrl(this.username);
    });
  }

  onLogoutClick() {
    this.authHelperService.logout();
    this.toastService.toast('Logged out.');
    this.router.navigate(['/']);
    return false;
  }

}
