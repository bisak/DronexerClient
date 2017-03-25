import { Component, OnInit, EventEmitter, OnChanges, DoCheck, AfterViewInit } from '@angular/core';
import { MaterializeAction } from "angular2-materialize";
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

  constructor(private authService: AuthService,
              private router: Router,
              private toastService: ToastService,) {
    authService.loginAnnounced.subscribe(data => {
      this.setUsername()
      /*TODO check if this is the right way to do it.*/
    })
  }

  ngOnInit() {
    this.setUsername()
  }

  onLogoutClick() {
    this.authService.logout();
    this.toastService.toast('Logged out.');
    this.router.navigate(['/'])
    return false;
  }

  private setUsername() {
    const authToken = this.authService.getDecodedAuthToken()
    if (authToken)
      this.username = authToken._doc.username
  }

}
