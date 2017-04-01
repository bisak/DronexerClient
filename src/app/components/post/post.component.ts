import { Component, Input, OnInit } from '@angular/core';
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { ProfileService } from "../../services/profile.service";
import { ToastService } from "../../services/toast.service";
import { PicturesService } from "../../services/pictures.service";
import { DatesService } from "../../utilities/dates.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post

  constructor(private toastService: ToastService,
              private picturesService: PicturesService,
              private datesService: DatesService,
              private authHelperService: AuthHelperService) {
  }

  ngOnInit() {
  }


  private commentPost(ev, post) {
    if (ev.keyCode == 13) {
      const comment = ev.target.value
      const id = post._id
      this.picturesService.commentPicture(id, { comment }).subscribe((data) => {
        let commentToAdd = {
          username: this.authHelperService.getUsernameFromToken(),
          comment: comment
        }
        post.comments.push(commentToAdd)
      }, (error) => {
        if (error.status === 401) {
          this.toastService.warningToast("Log in to comment.")
        }
      })
      ev.target.value = null
    }
  }

  private likePost(post) {
    const id = post._id
    this.picturesService.likePost(id).subscribe((data) => {
      console.log("liked success")
      const username = this.authHelperService.getUsernameFromToken()
      post.likes.push(username)
    }, (error) => {
      console.log("like error")
    })
  }

  private unLikePost(post) {
    const id = post._id
    this.picturesService.unLikePost(id).subscribe((data) => {
      console.log("Unliked success")
      const username = this.authHelperService.getUsernameFromToken()
      const index = post.likes.indexOf(username);
      if (index > -1) {
        post.likes.splice(index, 1);
      }
    }, (error) => {
      console.log("Unlike error")
    })
  }

  private isLiked(post) {
    const username = this.authHelperService.getUsernameFromToken()
    return post.likes.includes(username)
  }
}
