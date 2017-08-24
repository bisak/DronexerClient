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

  dronesArray: Array<any> = this.staticData.getDronesArray();
  droneSelected: number;
  caption: string;
  tags: string;
  isUploadButtonDisabled: boolean;
  subscriptions: Subscription[] = [];

  constructor(private staticData: StaticDataService,
              private picturesService: PicturesService,
              private toastService: ToastService,
              private validateService: ValidateService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onUploadBtnClick(pictureForm) {
    this.isUploadButtonDisabled = true;
    const uploadFormData: FormData = new FormData();
    const dataToSend: Object = {};
    /*TODO validate caption and tags length.*/
    if (this.droneSelected) {
      dataToSend['droneTaken'] = this.droneSelected;
      console.log(dataToSend);
    }

    if (this.caption) {
      dataToSend['caption'] = this.caption;
    }

    if (this.tags) {
      dataToSend['tags'] = this.validateService.getTagsArray(this.tags);
    }
    console.log(this.picture.file);
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
