import { Component, EventEmitter, OnInit } from '@angular/core';
import { PicturesService } from "../../services/pictures.service";
import { StaticDataService } from "../../services/static-data.service";
import { ValidateService } from "../../services/validate.service";
import { ToastService } from "../../services/toast.service";
import { Router } from "@angular/router";
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";
import { MaterializeAction } from "angular2-materialize/dist";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settingsData: any;
  username: string;
  isRegisterButtonDisabled: boolean;
  profilePictureFile: File
  profilePictureEncoded: String
  confirmModal = new EventEmitter<string | MaterializeAction>();
  deleteModal = new EventEmitter<string | MaterializeAction>();


  constructor(private profileService: ProfileService,
              private authService: AuthService,
              private authHelperService: AuthHelperService,
              private router: Router,
              private toastService: ToastService,
              private validateService: ValidateService,
              private staticData: StaticDataService,
              public picturesService: PicturesService) {
  }

  dronesArray = this.staticData.dronesArray;

  ngOnInit() {
    this.username = this.authHelperService.getUsernameFromToken()
    this.getSettingsData()
  }

  closeDeleteModal() {
    this.deleteModal.emit({action: "modal", params: ['close']});
  }

  openDeleteModal() {
    this.deleteModal.emit({action: "modal", params: ['open']});
  }

  closeConfirmModal() {
    this.confirmModal.emit({action: "modal", params: ['close']});
  }

  openConfirmModal() {
    this.confirmModal.emit({action: "modal", params: ['open']});
  }


  onProfilePictureSelected(ev) {
    let candidateFile = ev.target.files[0];
    if (candidateFile) {
      let profilePictureValidator = this.validateService.validateProfilePicture(candidateFile)
      if (profilePictureValidator.isValid == false) {
        this.isRegisterButtonDisabled = true
        return this.toastService.warningToast(profilePictureValidator.msg)
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
    this.profilePictureEncoded = "";
  }

  getSettingsData() {
    this.profileService.getProfile(this.username).subscribe((response) => {
      this.settingsData = response.data
      let oldDronesIndexes = []
      for (let drone of this.settingsData.drones) {
        oldDronesIndexes.push(this.dronesArray.indexOf(drone))
      }
      this.settingsData.dronesSelector = oldDronesIndexes
      this.settingsData.profilePicUrl = this.picturesService.getProfilePicUrl(response.data.username)
    }, (error) => {
      console.log(error)
      this.toastService.errorToast("An error occurred.")
    })
  }

  editProfileInfo(oldPassword) {
    let editFormData: FormData = new FormData()

    let registerInputValidator = this.validateService.validateRegisterInput(this.settingsData, true);

    if (!registerInputValidator.isValid) {
      return this.toastService.warningToast(registerInputValidator.msg)
    }

    let dronesToSendArray = []
    for (let index of this.settingsData.dronesSelector) {
      dronesToSendArray.push(this.dronesArray[index])
    }

    let objToSend = {
      firstName: this.settingsData.firstName,
      lastName: this.settingsData.lastName,
      email: this.settingsData.email,
      username: this.settingsData.username,
      password: this.settingsData.password,
      passwordConfirm: this.settingsData.passwordConfirm,
      birthday: this.settingsData.birthday,
      drones: dronesToSendArray,
      oldPassword: oldPassword
    }

    editFormData.append('data', JSON.stringify(objToSend))

    if (this.profilePictureFile) {
      editFormData.append('profilePicture', this.profilePictureFile)
    }

    this.profileService.editProfileInfo(editFormData).subscribe((response) => {
      if (response.success) {
        this.authHelperService.storeUserData(response.token)
        this.toastService.successToast("Edit successful.")
        this.closeConfirmModal()
      }
    }, (error) => {
      if (error.parsedBody) {
        return this.toastService.warningToast(error.parsedBody.msg)
      }
      this.toastService.warningToast("An error occurred.")
      console.log(error)
    })
  }

  deleteProfile(oldPassword) {
    if (oldPassword) {
      this.profileService.deleteProfile({oldPassword}).subscribe((response) => {
        if (response.success) {
          this.toastService.toast('Profile deleted.')
          this.authHelperService.logout()
          this.closeDeleteModal()
          this.router.navigate(['/'])
        }
      }, (error) => {
        if (error.parsedBody) {
          return this.toastService.warningToast(error.parsedBody.msg)
        }
        this.toastService.warningToast("An error occurred.")
        console.log(error)
      })
    }
  }
}
