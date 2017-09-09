import { Component, OnDestroy, OnInit } from '@angular/core';
import { PicturesService } from '../../services/pictures.service';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs/Subscription';

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
  hasPosts = true;

  constructor(private picturesService: PicturesService,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.getFeedPosts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getFeedPosts() {
    this.isListening = false;
    let time = new Date().getTime();
    if (this.lastPostTime) {
      time = this.lastPostTime;
    }
    this.subscriptions.push(this.picturesService.getFeedPosts(time).subscribe((retrievedPictures) => {
      const picData = retrievedPictures.data;
      this.feedPosts.push(...picData);
      this.lastPostTime = new Date(picData[picData.length - 1].createdAt).getTime();
      this.isListening = true;
    }, (error) => {
      console.log(error);
      if (error.status === 404) {
        if (this.feedPosts.length) {
          this.toastService.toast('No more posts available');
          this.isListening = false;
          return;
        }
        this.hasPosts = false;
        return;
      }
      this.toastService.errorToast('Error getting posts.');
    }));
  }

  onFeedScrolled() {
    if (this.isListening) {
      this.getFeedPosts();
    }
  }
}
