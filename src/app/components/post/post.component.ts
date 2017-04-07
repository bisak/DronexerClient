import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AuthHelperService} from "../../utilities/auth-helper.service";
import {ProfileService} from "../../services/profile.service";
import {ToastService} from "../../services/toast.service";
import {PicturesService} from "../../services/pictures.service";
import {DatesService} from "../../utilities/dates.service";
import {PostsService} from "../../services/posts.service";
import {StaticDataService} from "../../services/static-data.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post

  constructor(private toastService: ToastService,
              public picturesService: PicturesService,
              public datesService: DatesService,
              private authHelperService: AuthHelperService,
              public postsService: PostsService,
              private staticDataService: StaticDataService) {
  }

  ngOnInit() {
  }

  commentPost(ev, post) {
    if (ev.keyCode == 13) {
      const comment = ev.target.value
      const id = post._id
      this.postsService.commentPost(id, {comment}).subscribe((data) => {
        if (!post.comments)
          post.comments = []
        let commentToAdd = {
          userId: this.authHelperService.getIdFromToken(),
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

  likePost(post) {
    const id = post._id
    this.postsService.likePost(id).subscribe((data) => {
      const userId = this.authHelperService.getIdFromToken()
      post.isLikedByCurrentUser = true
      post.likesCount += 1
    }, (error) => {
      if (error.status === 401) {
        this.toastService.warningToast("Log in to like.")
      }
      console.log(error)
    })
  }

  unLikePost(post) {
    const id = post._id
    this.postsService.unLikePost(id).subscribe((data) => {
      const userId = this.authHelperService.getIdFromToken()
      post.isLikedByCurrentUser = false
      post.likesCount -= 1
    }, (error) => {
      console.log(error)
    })
  }

  loadComments(post) {
    post.showComments = !post.showComments
    if (post.commentsCount > 0) {
      const id = post._id
      this.postsService.getComments(id).subscribe((comments) => {
        if (comments.success) {
          post.comments = comments.data
        }
      }, (error) => {
        console.log(error)
        this.toastService.toast("Couldn't load comments.")
      })
    }
  }
}
