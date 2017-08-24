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

declare var Materialize;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  editData: any;
  username: string;
  isRegisterButtonDisabled: boolean;
  profilePictureFile: File;
  profilePictureEncoded: String;
  confirmModal = new EventEmitter<string | MaterializeAction>();
  deleteModal = new EventEmitter<string | MaterializeAction>();
  dronesArray;
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
    this.dronesArray = this.staticData.getDronesArray();
    this.getSettingsData();
    window.scrollTo(0, 0);
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

  getSettingsData() {
    this.subscriptions.push(this.profileService.getProfile(this.authHelperService.getUsernameFromToken()).subscribe((response) => {
      if (response.success) {
        this.editData = response.data;
        let oldDronesArray = [];
        this.editData.drones.forEach((drone, index) => {
          oldDronesArray.push(this.dronesArray.indexOf(drone));
        });
        this.editData.dronesSelector = oldDronesArray;
        this.editData.profilePicUrl = this.picturesService.getProfilePicUrl(this.editData._id);
        setTimeout(() => {
          Materialize.updateTextFields();
        }, 250);
      } else {
        console.log(response);
        this.toastService.toast('An error occured.');
      }
    }, (error) => {
      console.log(error);
      this.toastService.errorToast('An error occurred.');
    }));
  }

  dronesSelectChange(event) {
    console.log(event);
    this.editData.newDronesSelected = event;
  }

  editProfileInfo(oldPassword) {
    const editInputValidator = this.validateService.validateRegisterInput(this.editData, true);
    if (!editInputValidator.isValid) {
      return this.toastService.toast(editInputValidator.msg);
    }
    const editFormData: FormData = new FormData();
    const objToSend = {
      firstName: this.editData.firstName,
      lastName: this.editData.lastName,
      email: this.editData.email,
      username: this.editData.username,
      password: this.editData.password,
      drones: this.editData.newDronesSelected,
      oldPassword: oldPassword,
      about: this.editData.about
    };
    console.log(objToSend);
    console.log(this.profilePictureFile);

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
