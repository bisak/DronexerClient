import 'rxjs/add/operator/switchMap';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';

import { AuthHelperService } from '../../utilities/auth-helper.service';
import { PicturesService } from '../../services/pictures.service';
import { ProfileService } from '../../services/profile.service';
import { StaticDataService } from '../../services/static-data.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../../services/toast.service';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileInfo: any;
  wallPosts: Array<any>;
  isProfileMine: boolean;
  hasPosts: boolean;
  urlUsername: string;
  isListening: boolean;
  lastPostTime: number;
  isLoggedIn = false;
  subscriptions: Subscription[] = [];

  constructor(private profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router,
              private authHelperService: AuthHelperService,
              private toastService: ToastService,
              private picturesService: PicturesService,
              private staticDataService: StaticDataService) {
  }

  ngOnInit() {
    this.listenForUrlChanges();
    this.isLoggedIn = this.authHelperService.isLoggedIn();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  getProfileInfo(username) {
    this.subscriptions.push(this.profileService.getProfile(username).subscribe((retrievedData) => {
      this.profileInfo = retrievedData.data;
      this.profileInfo.profilePicUrl = this.picturesService.getProfilePicUrl(retrievedData.data._id);
    }, (error) => {
      console.log(error);
      if (error.status === 404) {
        this.router.navigate(['/page-not-found'], { replaceUrl: true }); // TODO this should not redirect but display not found msg.
        return false;
      }
      this.toastService.errorToast('An error occurred.');
    }));
  }

  getWallPosts(username) {
    this.isListening = false;
    let time = new Date().getTime();
    if (this.lastPostTime) {
      time = this.lastPostTime;
    }

    this.subscriptions.push(this.picturesService.getWallPosts(username, time)
      .finally(() => {
        this.isListening = true;
      })
      .subscribe((retrievedPictures) => {
        const postData = retrievedPictures.data;
        console.log(retrievedPictures);
        this.wallPosts.push(...postData);
        this.lastPostTime = new Date(postData[postData.length - 1].createdAt).getTime();
      }, (error) => {
        console.log(error);
        if (error.status === 404) {
          if (this.wallPosts.length) {
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

  followUser() {
    this.subscriptions.push(this.profileService.followUser(this.profileInfo._id).subscribe((response) => {
      this.profileInfo.followersCount += 1;
      this.profileInfo.isFollowed = true;
    }, (error) => {
      console.log(error);
      this.toastService.errorToast('An error occurred.');
    }));
  }

  unFollowUser() {
    this.subscriptions.push(this.profileService.unFollowUser(this.profileInfo._id).subscribe((response) => {
      this.profileInfo.followersCount -= 1;
      this.profileInfo.isFollowed = false;
    }, (error) => {
      console.log(error);
      this.toastService.errorToast('An error occurred.');
    }));
  }

  checkIdentity(): boolean {
    const extractedUsername = this.authHelperService.getUsernameFromToken();
    return (extractedUsername && this.urlUsername === extractedUsername);
  }

  listenForUrlChanges() {
    this.subscriptions.push(this.route.params.subscribe((params: Params) => {
      this.urlUsername = params['username'];

      this.hasPosts = true;
      this.profileInfo = null;
      this.wallPosts = [];
      this.isListening = true;
      this.lastPostTime = null;
      this.isProfileMine = this.checkIdentity();

      this.getProfileInfo(this.urlUsername);
      this.getWallPosts(this.urlUsername);
    }));
  }

  onProfileScrolled() {
    if (this.isListening) {
      this.getWallPosts(this.urlUsername);
    }
  }
}
