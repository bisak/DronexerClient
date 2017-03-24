import { Component, OnInit, EventEmitter } from '@angular/core';
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

  constructor(private authService: AuthService,
              private router: Router,
              private toastService: ToastService) {
  }

  ngOnInit() {
  }

  onLogoutClick() {
    this.authService.logout();
    this.toastService.toast('Logged out.');
    this.router.navigate(['/'])
    return false;
  }

}
