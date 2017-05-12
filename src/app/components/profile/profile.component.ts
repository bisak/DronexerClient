import { Component, EventEmitter, OnInit } from "@angular/core";
import { ProfileService } from "../../services/profile.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import "rxjs/add/operator/switchMap";
import { ToastService } from "../../services/toast.service";
import { PicturesService } from "../../services/pictures.service";
import { DatesService } from "../../utilities/dates.service";
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { StaticDataService } from "../../services/static-data.service";
import { MaterializeAction } from "angular2-materialize";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileInfo: any;
  wallPosts: Array<any>;
  isProfileMine: boolean;
  hasPosts: boolean;
  urlUsername: string;
  isListening: boolean;
  lastPostTime: number;

  constructor(private profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router,
              private authHelperService: AuthHelperService,
              private toastService: ToastService,
              private picturesService: PicturesService,
              private datesService: DatesService,
              private staticDataService: StaticDataService) {
  }

  ngOnInit() {
    this.listenForUrlChanges();
    this.isProfileMine = this.checkIdentity();
  }

  getProfileInfo(username) {
    this.profileService.getProfile(username).subscribe((retrievedData) => {
      this.profileInfo = retrievedData.data;
      this.profileInfo.profilePicUrl = this.picturesService.getProfilePicUrl(retrievedData.data.username);
    }, (error) => {
      console.log(error);
      if (error.status === 404) {
        this.router.navigate(['/page-not-found'], {replaceUrl: true});
        return false;
      }
      this.toastService.errorToast("An error occurred.");
    });
  }

  getWallPosts(username) {
    this.isListening = false;
    let time = new Date().getTime();
    if (this.lastPostTime) {
      time = this.lastPostTime;
    }

    this.picturesService.getWallPosts(username, time).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        let postData = retrievedPictures.data;
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
      this.toastService.errorToast("Error getting pictures.");
    });
  }

  checkIdentity(): boolean {
    const extractedUsername = this.authHelperService.getUsernameFromToken();
    return (extractedUsername && this.urlUsername === extractedUsername);
  }

  listenForUrlChanges() {
    this.route.params.subscribe((params: Params) => {
      this.urlUsername = params['username'];

      this.hasPosts = true;
      this.profileInfo = null;
      this.wallPosts = [];
      this.isListening = true;
      this.lastPostTime = null;
      this.isProfileMine = this.checkIdentity();

      this.getProfileInfo(this.urlUsername);
      this.getWallPosts(this.urlUsername);
    })
  }

  onProfileScrolled() {
    if (this.isListening) {
      this.getWallPosts(this.urlUsername);
    }
  }
}
