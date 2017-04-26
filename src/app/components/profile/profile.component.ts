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
  profileInfo: any
  wallPosts: any
  isProfileMine: boolean
  hasPosts: boolean
  urlUsername: string
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
    this.listenForUrlChanges()
    this.isProfileMine = this.checkIdentity()
    this.hasPosts = true
  }

  getProfileInfo(username) {
    this.profileService.getProfile(username).subscribe((retrievedData) => {
      this.profileInfo = retrievedData.data
    }, (error) => {
      console.log(error)
      if (error.status === 404) {
        this.router.navigate(['/page-not-found'])
        return false
      }
      this.toastService.errorToast("An error occurred.")
    })
  }

  getWallPosts(username) {
    this.isListening = false
    let time = new Date().getTime()
    if (this.lastPostTime) {
      time = this.lastPostTime
    }

    this.picturesService.getWallPosts(username, time).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        let picData = retrievedPictures.data
        if (this.wallPosts) {
          this.wallPosts.push(...picData)
        } else {
          this.wallPosts = picData
        }
        this.lastPostTime = new Date(picData[picData.length - 1].createdAt).getTime()
        this.isListening = true
      } else {
        this.isListening = false
        if (!this.wallPosts) {
          this.hasPosts = false
        }
      }
    }, (error) => {
      this.toastService.errorToast("Error getting pictures.")
    })
  }

  checkIdentity(): boolean {
    const extractedUsername = this.authHelperService.getUsernameFromToken()
    return (extractedUsername && this.urlUsername === extractedUsername)
  }

  listenForUrlChanges() {
    this.route.params.subscribe((params: Params) => {
      this.profileInfo = null
      this.wallPosts = null
      this.isListening = true

      let username = params['username']
      this.urlUsername = username
      this.getProfileInfo(username)
      this.getWallPosts(username)
    })
  }

  onProfileScrolled() {
    if (this.isListening) {
      this.getWallPosts(this.urlUsername)
    }
  }
}
