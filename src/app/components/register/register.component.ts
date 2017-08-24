import { Component, OnInit } from '@angular/core';
import { MaterializeDirective, MaterializeModule } from 'angular2-materialize';

import { AuthHelperService } from '../../utilities/auth-helper.service';
import { AuthService } from '../../services/auth.service';
import { Form } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { PicturesService } from '../../services/pictures.service';
import { Router } from '@angular/router';
import { StaticDataService } from '../../services/static-data.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../services/toast.service';
import { ValidateService } from '../../services/validate.service';
import { isUndefined } from 'util';
import { templateVisitAll } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerData: {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    dronesSelected: Array<string>
  } = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    dronesSelected: []
  };

  agree: boolean = false;
  passwordConfirm: string = '';

  profilePictureFile: File;
  profilePictureEncoded: string;
  isRegisterButtonDisabled = false;
  subscriptions: Subscription[] = [];
  dronesToSelect;
  defaultProfilePic = this.picturesService.getProfilePicUrl('default_profile_picture');


  constructor(private authService: AuthService,
              private authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService,
              private validateService: ValidateService,
              private staticData: StaticDataService,
              private picturesService: PicturesService) {
  }


  ngOnInit() {
    window.setTimeout(() => {
      this.dronesToSelect = this.staticData.getDronesArray();
    }, 1000);
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onProfilePictureSelected(ev) {
    const candidateFile = ev.target.files[0];
    if (candidateFile) {
      const profilePictureValidator = this.validateService.validateProfilePicture(candidateFile);
      if (!profilePictureValidator.isValid) {
        this.isRegisterButtonDisabled = true;
        return this.toastService.toast(profilePictureValidator.msg);
      }
      this.profilePictureFile = candidateFile;
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(this.profilePictureFile);
      fileReader.onload = (e) => {
        this.profilePictureEncoded = fileReader.result;
      };
      this.isRegisterButtonDisabled = false;
    } else {
      this.profilePictureEncoded = '';
    }
  }

  dronesSelectChange(event) {
    this.registerData.dronesSelected = event;
  }

  onRegisterSubmit() {
    const registerFormData: FormData = new FormData();
    const registerInputValidator = this.validateService.validateRegisterInput({
      ...this.registerData,
      agree: this.agree,
      passwordConfirm: this.passwordConfirm
    });
    if (!registerInputValidator.isValid) {
      return this.toastService.toast(registerInputValidator.msg);
    }

    if (this.profilePictureFile) {
      registerFormData.append('profilePicture', this.profilePictureFile);
    }

    registerFormData.append('data', JSON.stringify(this.registerData));


    this.subscriptions.push(this.authService.registerUser(registerFormData).subscribe((data) => {
      if (data.success) {
        this.toastService.toast('Registered successfully!');
        this.router.navigate(['/login']);
      } else {
        this.toastService.errorToast('An error occured: ' + (data.msg ? data.msg : 'Unknown'));
      }
    }, (err) => {
      console.log(err);
      const parsedError = JSON.parse(err._body);
      this.toastService.toast(parsedError.msg);
    }));
  }

}
