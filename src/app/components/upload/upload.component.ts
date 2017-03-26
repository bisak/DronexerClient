import { Component, OnInit } from '@angular/core';
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";
import { PicturesService } from "../../services/pictures.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  private selected = false
  private pictureFile: File
  private pictureFileEncoded: string
  private dronesSelector: number
  private tags: string
  private caption: string

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

  constructor(private toastService: ToastService,
              private authService: AuthService,
              private picturesService: PicturesService,
              private router: Router) {
  }

  ngOnInit() {
  }

  onPictureSelectorChange(ev) {
    this.pictureFile = ev.target.files[0];
    let fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(this.pictureFile)
    fileReader.onloadend = (e) => {
      this.pictureFileEncoded = fileReader.result;
      this.selected = true
    }
  }

  onUploadBtnClick() {
    let uploadFormData: FormData = new FormData()
    if (this.dronesSelector) {
      uploadFormData.append('droneTaken', this.dronesArray[this.dronesSelector])
    }
    if (this.tags) {
      let tagsArray = this.tags.split(' ').filter((x) => x != '' && x.startsWith('#') && x.length > 4)
      tagsArray.length && tagsArray.forEach(tag => uploadFormData.append('tags', tag))
    }
    if (this.caption) {
      uploadFormData.append('caption', this.caption)
    }
    uploadFormData.append('uploaderUsername', this.authService.getUsernameFromToken())
    uploadFormData.append('pictureFile', this.pictureFile)

    this.picturesService.uploadPicture(uploadFormData)
      .subscribe((data) => {
        if (data.success) {
          this.toastService.successToast('Picture Uploaded.')
          console.log(data)
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
