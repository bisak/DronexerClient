import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { ToastService } from '../../services/toast.service'
import { Subject } from "rxjs";

declare var Materialize: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String
  password: String


  constructor(private authService: AuthService,
              private router: Router,
              private toastService: ToastService) {
  }

  ngOnInit() {
    Materialize.showStaggeredList('#transition-heading');
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    if (!user.username || !user.password) {
      return this.toastService.toast('Please fill in both fields.')
    }

    this.authService.loginUser(user)
      .subscribe((data) => {
        if (data.success) {
          this.authService.storeUserData(data.token, data.user)
          this.toastService.toast('Logged in.')
          this.router.navigate(['/'])
        } else {
          this.toastService.errorToast(data.msg)
        }
      }, (err) => {
        console.log(err)
        let parsedError = JSON.parse(err._body)
        this.toastService.errorToast(parsedError.msg)
      })
  }
}
