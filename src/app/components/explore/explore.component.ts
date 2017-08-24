import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { PicturesService } from '../../services/pictures.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit, OnDestroy {
  explorePosts: Array<object> = [];
  lastPostTime: number;
  isListening = true;
  subscriptions: Subscription[] = [];

  constructor(private picturesService: PicturesService,
    private toastService: ToastService) {
  }

  ngOnInit() {
    this.getExplorePosts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  getExplorePosts() {
    this.isListening = false;
    let time = new Date().getTime();
    if (this.lastPostTime) {
      time = this.lastPostTime;
    }
    this.subscriptions.push(this.picturesService.getExplorePosts(time).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        const picData = retrievedPictures.data;
        this.explorePosts.push(...picData);
        this.lastPostTime = new Date(picData[picData.length - 1].createdAt).getTime();
        this.isListening = true;
      } else {
        this.isListening = false;
      }
    }, (error) => {
      console.log(error);
      if (error.status === 404) {
        return this.toastService.toast('No more posts available');
      }
      this.toastService.errorToast('Error getting user pictures.');
      this.isListening = false;
    }));
  }

  onExploreScrolled() {
    if (this.isListening) {
      this.getExplorePosts();
    }
  }

}
