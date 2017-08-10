import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthHelperService } from '../../utilities/auth-helper.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  username: String;
  password: String;
  subscriptions: Subscription[] = [];

  constructor(private authHelperService: AuthHelperService,
              private authService: AuthService,
              private router: Router,
              private toastService: ToastService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };

    if (!user.username || !user.password) {
      return this.toastService.toast('Please fill in both fields.');
    }

    this.subscriptions.push(this.authService.loginUser(user).subscribe((response) => {
      if (response.success) {
        this.authHelperService.storeUserData(response.token);
        this.toastService.toast('Logged in.');
        this.router.navigate(['/discover']);
      } else {
        this.toastService.errorToast(response.msg);
      }
    }, (err) => {
      console.log(err);
      this.toastService.errorToast(err.parsedBody.msg);
    }));
  }
}
