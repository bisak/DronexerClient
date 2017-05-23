import { Component, OnInit } from '@angular/core';
import { MaterializeDirective, MaterializeModule } from 'angular2-materialize'

import { AuthHelperService } from '../../utilities/auth-helper.service';
import { AuthService } from '../../services/auth.service';
import { Form } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { PicturesService } from '../../services/pictures.service';
import { Router } from '@angular/router';
import { StaticDataService } from '../../services/static-data.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../services/toast.service';
import { ValidateService } from '../../services/validate.service'
import { isUndefined } from 'util';
import { templateVisitAll } from '@angular/compiler';

declare var Materialize: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
  birthday: string;
  dronesSelector: Array<number>;
  agree: Boolean;
  defaultProfilePicUrl: string;
  profilePictureFile: File;
  profilePictureEncoded: string;
  isRegisterButtonDisabled = false;

  dronesArray: Array<any> = this.staticData.dronesArray;
  subscriptions: Subscription[] = [];


  constructor(private authService: AuthService,
    private authHelperService: AuthHelperService,
    private router: Router,
    private toastService: ToastService,
    private validateService: ValidateService,
    private staticData: StaticDataService,
    private picturesService: PicturesService) {
  }


  ngOnInit () {
    this.defaultProfilePicUrl = this.picturesService.getProfilePicUrl('default_profile_picture');
  }

  ngOnDestroy () {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  onProfilePictureSelected (ev) {
    const candidateFile = ev.target.files[0];
    if (candidateFile) {
      const profilePictureValidator = this.validateService.validateProfilePicture(candidateFile);
      if (!profilePictureValidator.isValid) {
        this.isRegisterButtonDisabled = true;
        return this.toastService.errorToast(profilePictureValidator.msg);
      } else {
        this.profilePictureFile = candidateFile;
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(this.profilePictureFile);
        fileReader.onload = (e) => {
          this.profilePictureEncoded = fileReader.result;
        }
        this.isRegisterButtonDisabled = false;
      }
    }
    this.profilePictureEncoded = '';
  }

  onRegisterSubmit () {
    const registerFormData: FormData = new FormData();
    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      birthday: this.birthday,
      agree: this.agree
    };
    const registerInputValidator = this.validateService.validateRegisterInput(user);
    if (!registerInputValidator.isValid) {
      return this.toastService.warningToast(registerInputValidator.msg);
    }
    if (this.dronesSelector) {
      for (const dronesArrayIndex of this.dronesSelector) {
        registerFormData.append('drones', this.dronesArray[dronesArrayIndex]);
      }
    }
    if (this.birthday) {
      registerFormData.append('birthday', this.birthday);
    }
    if (this.profilePictureFile) {
      registerFormData.append('profilePicture', this.profilePictureFile);
    }
    registerFormData.append('firstName', this.firstName);
    registerFormData.append('lastName', this.lastName);
    registerFormData.append('email', this.email);
    registerFormData.append('username', this.username);
    registerFormData.append('password', this.password);
    registerFormData.append('passwordConfirm', this.passwordConfirm);

    this.subscriptions.push(this.authService.registerUser(registerFormData).subscribe((data) => {
      if (data.success) {
        this.toastService.toast('Registered.');
        this.router.navigate(['/login']);
      } else {
        this.toastService.errorToast('An error occured.: ' + (data.msg ? data.msg : 'Unknown'));
      }
    }, (err) => {
      console.log(err);
      const parsedError = JSON.parse(err._body);
      this.toastService.errorToast(parsedError.msg);
    }));
  }

}
