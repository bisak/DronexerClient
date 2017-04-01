import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service'
import { ActivatedRoute, Params, Router } from "@angular/router";
import 'rxjs/add/operator/switchMap';
import { ToastService } from "../../services/toast.service";
import { PicturesService } from "../../services/pictures.service";
import { ApiService } from "../../services/api.service";
import { DatesService } from "../../utilities/dates.service";
import { AuthHelperService } from "../../utilities/auth-helper.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  visualiseData: any
  posts: any

  constructor(private profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router,
              private authHelperService: AuthHelperService,
              private toastService: ToastService,
              private picturesService: PicturesService,
              private datesService: DatesService) {
  }

  ngOnInit() {
    this.getProfileInfo()
    this.getWallPosts()
  }

  private getProfileInfo() {
    this.route.params.subscribe((params: Params) => {
      const username = params['username']
      this.profileService.getProfile(username).subscribe((retrievedData) => {
        let data = retrievedData.data
        data.profilePicture = this.picturesService.getProfilePictureUrl(data.username)
        this.visualiseData = data
        console.log(data)
      }, (error) => {
        console.log("Error in profile component.")
        console.log(error)
        this.toastService.errorToast("An error occurred.")
      })
    })
  }

  private getWallPosts() {
    this.route.params.subscribe((params: Params) => {
      const username = params['username']
      this.picturesService.getWallPosts(username).subscribe((retrievedPictures) => {
        if (retrievedPictures.success) {
          this.posts = retrievedPictures.data
          console.log(this.posts)
        }
      }, (error) => {
        console.log("Error getting user picture.")
        console.log(error)
        this.toastService.errorToast("Error getting user pictures.")
      })
    })
  }

  private commentPost(ev, post) {
    if (ev.keyCode == 13) {
      let comment = ev.target.value
      let id = post._id
      this.picturesService.commentPicture(id, { comment }).subscribe((data) => {
        let commentToAdd = {
          username: this.authHelperService.getUsernameFromToken(),
          comment: comment
        }
        post.comments.push(commentToAdd)
      }, (error) => {
        console.log(error)
      })
      ev.target.value = null
      console.log(id)
    }
  }
}
