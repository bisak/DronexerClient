import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";
import { PicturesService } from "../../services/pictures.service";
import { Router } from "@angular/router";
import { StaticDataService } from "../../services/static-data.service";
import { AuthHelperService } from "../../utilities/auth-helper.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  /*TODO add drag and drop to upload files.*/
  private pictureSelected = false
  private pictureFile: File
  private pictureFileEncoded: string
  private dronesSelector: number
  private tags: string
  private caption: string

  private dronesArray = this.staticData.dronesArray;

  constructor(private toastService: ToastService,
              private authHelperService: AuthHelperService,
              private picturesService: PicturesService,
              private router: Router,
              private staticData: StaticDataService,
              private elRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  private hidePictureCard() {
    this.pictureSelected = false;
  }

  private showPictureCard() {
    this.pictureSelected = true;
  }

  onPictureSelectorChange(ev) {
    this.pictureFile = ev.target.files[0];
    let fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(this.pictureFile)
    fileReader.onloadend = (e) => {
      this.pictureFileEncoded = fileReader.result;
      this.showPictureCard()
    }
  }

  onUploadBtnClick() {
    let uploadFormData: FormData = new FormData()
    this.dronesSelector && uploadFormData.append('droneTaken', this.dronesArray[this.dronesSelector])
    this.caption && uploadFormData.append('caption', this.caption)
    if (this.tags) {
      /*TODO Add this verification on the server side.*/
      let tagsArray = this.tags.split(' ').filter((x) => x != '' && x.startsWith('#') && x.length > 4).map((x)=>x.toLowerCase())
      tagsArray.length && tagsArray.forEach((tag) => uploadFormData.append('tags', tag))
    }
    uploadFormData.append('uploaderUsername', this.authHelperService.getUsernameFromToken())
    uploadFormData.append('pictureFile', this.pictureFile)

    this.picturesService.uploadPicture(uploadFormData)
      .subscribe((data) => {
        if (data.success) {
          this.toastService.successToast('Picture Uploaded.', this.hidePictureCard.bind(this))
          /*binding hell.*/
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
