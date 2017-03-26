import { Component, OnInit } from '@angular/core';
import { MaterializeModule, MaterializeDirective } from 'angular2-materialize'
import { ToastService } from "../../services/toast.service";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ValidateService } from "../../services/validate.service"
import { Form } from "@angular/forms";
import { isUndefined } from "util";
import { templateVisitAll } from "@angular/compiler";

declare var Materialize: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private firstName: String
  private lastName: String
  private email: String
  private username: String
  private password: String
  private passwordConfirm: String
  private birthday: String
  private dronesSelector: Array<number>

  private profilePictureFile: File
  private profilePictureEncoded: String

  private isRegisterButtonDisabled = false

  constructor(private authService: AuthService,
              private router: Router,
              private toastService: ToastService,
              private validateService: ValidateService) {
  }

  private dronesArray = [
    "DJI Phantom 3 Std",
    "DJI Phantom 3 4K",
    "DJI Phantom 3 Adv",
    "DJI Phantom 3 Pro",
    "DJI Phantom 4",
    "DJI Phantom 4 Pro",
    "DJI Mavic Pro",
    "DJI Inspire 1",
    "DJI Inspire 2",
    "Other"
  ]

  ngOnInit() {
    Materialize.showStaggeredList('#transition-heading')
    if (this.authService.isLoggedIn()) {
      this.router.navigate([''])
    }
  }

  onProfilePictureSelected(ev) {
    let candidateFile = ev.target.files[0];
    let profilePictureValidator = this.validateService.validateProfilePicture(candidateFile)
    if (profilePictureValidator.isValid == false) {
      this.isRegisterButtonDisabled = true
      return this.toastService.errorToast(profilePictureValidator.msg)
    } else {
      this.profilePictureFile = candidateFile;
      let fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(this.profilePictureFile)
      fileReader.onloadend = (e) => {
        this.profilePictureEncoded = fileReader.result;
      }
      this.isRegisterButtonDisabled = false
    }
  }

  onRegisterSubmit() {
    let registerFormData: FormData = new FormData()
    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      birthday: this.birthday
    }
    let registerInputValidator = this.validateService.validateRegisterInput(user);
    if (registerInputValidator.isValid == false) {
      return this.toastService.errorToast(registerInputValidator.msg)
    }
    if (this.dronesSelector) {
      for (let num of this.dronesSelector) {
        registerFormData.append('drones', this.dronesArray[num])
      }
    }
    if (this.birthday) {
      registerFormData.append('birthday', this.birthday)
    }
    if (this.profilePictureFile) {
      registerFormData.append('profilePicture', this.profilePictureFile)
    }
    registerFormData.append('firstName', this.firstName)
    registerFormData.append('lastName', this.lastName)
    registerFormData.append('email', this.email)
    registerFormData.append('username', this.username)
    registerFormData.append('password', this.password)

    this.authService.registerUser(registerFormData)
      .subscribe((data) => {
        if (data.success) {
          this.toastService.successToast('Registered.')
          this.router.navigate(['/login'])
        } else {
          this.toastService.errorToast('An error occured.: ' + (data.msg ? data.msg : "Unknown"))
        }
      }, (err) => {
        console.log(err)
        let parsedError = JSON.parse(err._body)
        this.toastService.errorToast(parsedError.msg)
      })
  }

}
