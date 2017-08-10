import { Component, EventEmitter, OnInit } from '@angular/core';

import { AuthHelperService } from '../../utilities/auth-helper.service';
import { AuthService } from '../../services/auth.service';
import { MaterializeAction } from 'angular2-materialize/dist';
import { OnDestroy } from '@angular/core';
import { PicturesService } from '../../services/pictures.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { StaticDataService } from '../../services/static-data.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../services/toast.service';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settingsData: any;
  username: string;
  isRegisterButtonDisabled: boolean;
  profilePictureFile: File;
  profilePictureEncoded: String;
  confirmModal = new EventEmitter<string | MaterializeAction>();
  deleteModal = new EventEmitter<string | MaterializeAction>();
  dronesArray = this.staticData.dronesArray;
  subscriptions: Subscription[] = [];

  constructor(private profileService: ProfileService,
              private authService: AuthService,
              private authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService,
              private validateService: ValidateService,
              private staticData: StaticDataService,
              public picturesService: PicturesService) {
  }


  ngOnInit() {
    this.username = this.authHelperService.getUsernameFromToken();
    this.getSettingsData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  closeDeleteModal() {
    this.deleteModal.emit({ action: 'modal', params: ['close'] });
  }

  openDeleteModal() {
    this.deleteModal.emit({ action: 'modal', params: ['open'] });
  }

  closeConfirmModal() {
    this.confirmModal.emit({ action: 'modal', params: ['close'] });
  }

  openConfirmModal() {
    this.confirmModal.emit({ action: 'modal', params: ['open'] });
  }


  onProfilePictureSelected(ev) {
    const candidateFile = ev.target.files[0];
    if (candidateFile) {
      const profilePictureValidator = this.validateService.validateProfilePicture(candidateFile);
      if (profilePictureValidator.isValid === false) {
        this.isRegisterButtonDisabled = true;
        return this.toastService.warningToast(profilePictureValidator.msg);
      } else {
        this.profilePictureFile = candidateFile;
        const fileReader: FileReader = new FileReader();
        fileReader.readAsDataURL(this.profilePictureFile);
        fileReader.onload = (e) => {
          this.profilePictureEncoded = fileReader.result;
        };
        this.isRegisterButtonDisabled = false;
      }
    }
    this.profilePictureEncoded = '';
  }

  getSettingsData() {
    this.subscriptions.push(this.profileService.getProfile(this.username).subscribe((response) => {
      this.settingsData = response.data;
      const oldDronesIndexes = [];
      for (const drone of this.settingsData.drones) {
        oldDronesIndexes.push(this.dronesArray.indexOf(drone));
      }
      this.settingsData.dronesSelector = oldDronesIndexes;
      console.log(response.data);
      this.settingsData.profilePicUrl = this.picturesService.getProfilePicUrl(response.data._id);
    }, (error) => {
      console.log(error);
      this.toastService.errorToast('An error occurred.');
    }));
  }

  editProfileInfo(oldPassword) {
    const editFormData: FormData = new FormData();

    const registerInputValidator = this.validateService.validateRegisterInput(this.settingsData, true);

    if (!registerInputValidator.isValid) {
      return this.toastService.warningToast(registerInputValidator.msg);
    }

    const dronesToSendArray = [];
    for (const index of this.settingsData.dronesSelector) {
      dronesToSendArray.push(this.dronesArray[index]);
    }

    const objToSend = {
      firstName: this.settingsData.firstName,
      lastName: this.settingsData.lastName,
      email: this.settingsData.email,
      username: this.settingsData.username,
      password: this.settingsData.password,
      passwordConfirm: this.settingsData.passwordConfirm,
      birthday: this.settingsData.birthday,
      drones: dronesToSendArray,
      oldPassword: oldPassword
    };

    editFormData.append('data', JSON.stringify(objToSend));

    if (this.profilePictureFile) {
      editFormData.append('profilePicture', this.profilePictureFile);
    }

    this.subscriptions.push(this.profileService.editProfileInfo(editFormData).subscribe((response) => {
      if (response.success) {
        this.authHelperService.storeUserData(response.token);
        this.toastService.successToast('Edit successful.');
        this.closeConfirmModal();
      }
    }, (error) => {
      if (error.parsedBody) {
        return this.toastService.warningToast(error.parsedBody.msg);
      }
      this.toastService.warningToast('An error occurred.');
      console.log(error);
    }));
  }

  deleteProfile(oldPassword) {
    if (oldPassword) {
      this.subscriptions.push(this.profileService.deleteProfile({ oldPassword }).subscribe((response) => {
        if (response.success) {
          this.toastService.toast('Profile deleted.');
          this.authHelperService.logout();
          this.closeDeleteModal();
          this.router.navigate(['/']);
        }
      }, (error) => {
        if (error.parsedBody) {
          return this.toastService.warningToast(error.parsedBody.msg);
        }
        this.toastService.warningToast('An error occurred.');
        console.log(error);
      }));
    }
  }
}
