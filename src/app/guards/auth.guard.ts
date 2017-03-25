import { Injectable } from "@angular/core"
import { Router, CanActivate } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { ToastService } from "../services/toast.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private toastService: ToastService) {
  }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['login'])
      this.toastService.errorToast("You should log in to view this page.")
      return false
    }
  }
}
