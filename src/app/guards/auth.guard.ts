import { Injectable } from "@angular/core"
import { Router, CanActivate, ActivatedRouteSnapshot, ActivatedRoute, Params } from "@angular/router"
import { ToastService } from "../services/toast.service";
import { AuthHelperService } from "../utilities/auth-helper.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService) {
  }

  canActivate() {
    if (this.authHelperService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['login'])
      this.toastService.errorToast("Log in to view this page.")
      return false
    }
  }
}
