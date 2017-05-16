import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { ToastService } from '../../services/toast.service'
import { Subject } from "rxjs";
import { AuthHelperService } from "../../utilities/auth-helper.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;


  constructor(private authHelperService: AuthHelperService,
              private authService: AuthService,
              private router: Router,
              private toastService: ToastService) {
  }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };

    if (!user.username || !user.password) {
      return this.toastService.toast('Please fill in both fields.');
    }

    this.authService.loginUser(user).subscribe((response) => {
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
      });
  }
}
