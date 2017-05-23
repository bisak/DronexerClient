import { Component, Input, OnInit } from '@angular/core';

import { OnDestroy } from '@angular/core';
import { PicturesService } from '../../services/pictures.service';
import { StaticDataService } from '../../services/static-data.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../services/toast.service';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-upload-picture-form',
  templateUrl: './upload-picture-form.component.html',
  styleUrls: ['./upload-picture-form.component.css']
})
export class UploadPictureFormComponent implements OnInit, OnDestroy {

  @Input() picture;

  dronesArray: Array<any> = this.staticData.dronesArray;
  dronesSelector: number;
  caption: string;
  tags: string;
  isUploadButtonDisabled: boolean;
  subscriptions: Subscription[] = [];

  constructor(private staticData: StaticDataService,
    private picturesService: PicturesService,
    private toastService: ToastService,
    private validateService: ValidateService) {
  }

  ngOnInit () {
  }

  ngOnDestroy () {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  onUploadBtnClick (pictureForm) {
    this.isUploadButtonDisabled = true;
    const uploadFormData: FormData = new FormData();
    const dataToSend: Object = {};
    /*TODO validate caption and tags length.*/
    console.log(this.dronesSelector)
    if (this.dronesSelector) {
      dataToSend['droneTaken'] = this.dronesArray[this.dronesSelector];
    }

    if (this.caption) {
      dataToSend['caption'] = this.caption;
    }

    if (this.tags) {
      const tagsArray = this.validateService.getTagsArray(this.tags);
      if (tagsArray) {
        dataToSend['tags'] = tagsArray;
      }
    }

    uploadFormData.append('pictureFile', this.picture.file);
    uploadFormData.append('data', JSON.stringify(dataToSend));

    this.subscriptions.push(this.picturesService.uploadPicture(uploadFormData).subscribe((data) => {
      if (data.success) {
        this.toastService.successToast('Picture Uploaded.');
        pictureForm.remove();
      } else {
        this.toastService.errorToast('An error occured: ' + (data.msg ? data.msg : 'Unknown'));
      }
    }, (err) => {
      /*TODO This shit didn't work. Probably something with bug when the server actually returns string.*/
      console.log(err);
      this.toastService.errorToast(err.statusText);
    }));
  }

}
