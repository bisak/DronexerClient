import 'rxjs/add/operator/switchMap';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';

import { AuthHelperService } from '../../utilities/auth-helper.service';
import { DatesService } from '../../utilities/dates.service';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs/Observable';
import { PicturesService } from '../../services/pictures.service';
import { ProfileService } from '../../services/profile.service';
import { StaticDataService } from '../../services/static-data.service';
import { Subscription } from 'rxjs/Subscription'
import { ToastService } from '../../services/toast.service';

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

  subscriptions: Subscription[] = [];

  constructor(private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private authHelperService: AuthHelperService,
    private toastService: ToastService,
    private picturesService: PicturesService,
    private datesService: DatesService,
    private staticDataService: StaticDataService) {
  }

  ngOnInit () {
    this.listenForUrlChanges();
    this.isProfileMine = this.checkIdentity();
  }

  ngOnDestroy () {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  getProfileInfo (username) {
    this.subscriptions.push(this.profileService.getProfile(username).subscribe((retrievedData) => {
      this.profileInfo = retrievedData.data;
      this.profileInfo.profilePicUrl = this.picturesService.getProfilePicUrl(retrievedData.data._id);
    }, (error) => {
      console.log(error);
      if (error.status === 404) {
        this.router.navigate(['/page-not-found'], { replaceUrl: true });
        return false;
      }
      this.toastService.errorToast('An error occurred.');
    }));
  }

  getWallPosts (username) {
    this.isListening = false;
    let time = new Date().getTime();
    if (this.lastPostTime) {
      time = this.lastPostTime;
    }

    this.subscriptions.push(this.picturesService.getWallPosts(username, time).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        const postData = retrievedPictures.data;
        this.wallPosts.push(...postData);
        this.lastPostTime = new Date(postData[postData.length - 1].createdAt).getTime();
        this.isListening = true;
      } else {
        this.isListening = false;
        if (!this.wallPosts.length) {
          this.hasPosts = false;
        }
      }
    }, (error) => {
      console.log(error);
      this.toastService.errorToast('Error getting pictures.');
    }));
  }

  checkIdentity (): boolean {
    const extractedUsername = this.authHelperService.getUsernameFromToken();
    return (extractedUsername && this.urlUsername === extractedUsername);
  }

  listenForUrlChanges () {
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
    }))
  }

  onProfileScrolled () {
    if (this.isListening) {
      this.getWallPosts(this.urlUsername);
    }
  }
}
