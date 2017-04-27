import {Component, OnInit} from '@angular/core';
import {MaterializeModule, MaterializeDirective} from 'angular2-materialize'
import {ToastService} from "../../services/toast.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {ValidateService} from "../../services/validate.service"
import {Form} from "@angular/forms";
import {isUndefined} from "util";
import {templateVisitAll} from "@angular/compiler";
import {StaticDataService} from "../../services/static-data.service";
import {AuthHelperService} from "../../utilities/auth-helper.service";

declare var Materialize: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  firstName: String
  lastName: String
  email: String
  username: String
  password: String
  passwordConfirm: String
  birthday: String
  dronesSelector: Array<number>
  agree: Boolean

  profilePictureFile: File
  profilePictureEncoded: String

  isRegisterButtonDisabled = false

  constructor(private authService: AuthService,
              private authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService,
              private validateService: ValidateService,
              private staticData: StaticDataService) {
  }

  dronesArray = this.staticData.dronesArray;

  ngOnInit() {
    Materialize.showStaggeredList('#transition-heading')
    this.authHelperService.blockLoggedInAccess()
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
      fileReader.onload = (e) => {
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
      birthday: this.birthday,
      agree: this.agree
    }
    let registerInputValidator = this.validateService.validateRegisterInput(user);
    if (registerInputValidator.isValid == false) {
      return this.toastService.warningToast(registerInputValidator.msg)
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
    registerFormData.append('passwordConfirm', this.passwordConfirm)

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
