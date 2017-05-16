import { Component, Input, OnInit } from '@angular/core';
import { StaticDataService } from "../../services/static-data.service";
import { PicturesService } from "../../services/pictures.service";
import { ToastService } from "../../services/toast.service";
import { ValidateService } from "../../services/validate.service";

@Component({
  selector: 'app-upload-picture-form',
  templateUrl: './upload-picture-form.component.html',
  styleUrls: ['./upload-picture-form.component.css']
})
export class UploadPictureFormComponent implements OnInit {

  @Input() picture;

  dronesArray: Array<any> = this.staticData.dronesArray;
  dronesSelector: number;
  caption: string;
  tags: string;
  isUploadButtonDisabled: boolean;

  constructor(private staticData: StaticDataService,
              private picturesService: PicturesService,
              private toastService: ToastService,
              private validateService: ValidateService) {
  }

  ngOnInit() {
  }


  onUploadBtnClick(pictureForm) {
    this.isUploadButtonDisabled = true;
    let uploadFormData: FormData = new FormData();
    let dataToSend: Object = {};
    /*TODO validate caption and tags length.*/
    console.log(this.dronesSelector)
    if (this.dronesSelector) dataToSend["droneTaken"] = this.dronesArray[this.dronesSelector];
    if (this.caption) dataToSend["caption"] = this.caption;
    if (this.tags) {
      let tagsArray = this.validateService.getTagsArray(this.tags);
      if (tagsArray) dataToSend["tags"] = tagsArray;
    }

    uploadFormData.append('pictureFile', this.picture.file);
    uploadFormData.append('data', JSON.stringify(dataToSend));

    this.picturesService.uploadPicture(uploadFormData).subscribe((data) => {
      if (data.success) {
        this.toastService.successToast('Picture Uploaded.');
        pictureForm.remove();
      } else {
        this.toastService.errorToast('An error occured: ' + (data.msg ? data.msg : "Unknown"));
      }
    }, (err) => {
      /*TODO This shit didn't work. Probably something with bug when the server actually returns string.*/
      console.log(err);
      this.toastService.errorToast(err.statusText);
    })
  }

}
