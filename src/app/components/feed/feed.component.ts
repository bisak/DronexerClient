import { Component, OnDestroy, OnInit } from '@angular/core';
import { PicturesService } from "../../services/pictures.service";
import { ToastService } from "../../services/toast.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {
  feedPosts: Array<object> = [];
  lastPostTime: number;
  isListening = true;
  subscriptions: Subscription[] = [];

  constructor(private picturesService: PicturesService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.getFeedPosts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  getFeedPosts() {
    this.isListening = false;
    let time = new Date().getTime();
    if (this.lastPostTime) {
      time = this.lastPostTime;
    }
    this.subscriptions.push(this.picturesService.getFeedPosts(time).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        const picData = retrievedPictures.data;
        this.feedPosts.push(...picData);
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

  onFeedScrolled() {
    if (this.isListening) {
      this.getFeedPosts();
    }
  }
}
