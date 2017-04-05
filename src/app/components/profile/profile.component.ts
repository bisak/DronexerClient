import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProfileService} from '../../services/profile.service'
import {ActivatedRoute, Params, Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {ToastService} from "../../services/toast.service";
import {PicturesService} from "../../services/pictures.service";
import {ApiService} from "../../services/api.service";
import {DatesService} from "../../utilities/dates.service";
import {AuthHelperService} from "../../utilities/auth-helper.service";

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

  constructor(private profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router,
              private authHelperService: AuthHelperService,
              private toastService: ToastService,
              private picturesService: PicturesService,
              private datesService: DatesService) {
    this.hasPosts = true
  }

  ngOnInit() {
    this.listenForUrlChanges()
    this.isProfileMine = this.checkIdentity()
    this.getProfileInfo()
    this.getWallPosts()
  }

  private getProfileInfo() {
    this.route.params.subscribe((params: Params) => {
      const username = params['username']

      this.profileService.getProfile(username).subscribe((retrievedData) => {
        console.log(retrievedData)
        let data = retrievedData.data
        data.profilePicture = this.picturesService.getProfilePictureUrl(data.username)
        this.profileInfo = data
        console.log(data)
      }, (error) => {
        console.log(error)
        if (error.status === 404) {
          return this.router.navigate(['/page-not-found'])
        }
        this.toastService.errorToast("An error occurred.")
      })
    })
  }

  private getWallPosts() {
    this.route.params.subscribe((params: Params) => {
      const username = params['username']

      this.picturesService.getWallPosts(username).subscribe((retrievedPictures) => {
        if (retrievedPictures.success) {
          this.wallPosts = retrievedPictures.data
          console.log(this.wallPosts)
        }
        console.log(retrievedPictures)
      }, (error) => {
        console.log(error)
        if (error.status === 404) {
          return this.hasPosts = false
        }
        this.toastService.errorToast("Error getting user pictures.")
      })
    })
  }

  private checkIdentity() {
    const extractedUsername = this.authHelperService.getUsernameFromToken()
    return (extractedUsername && this.urlUsername === extractedUsername)
  }

  private listenForUrlChanges() {
    this.route.params.subscribe((params: Params) => {
      this.urlUsername = params['username']
    })
  }

}
