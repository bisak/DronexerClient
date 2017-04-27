import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { ProfileService } from "../../services/profile.service";
import { ToastService } from "../../services/toast.service";
import { PicturesService } from "../../services/pictures.service";
import { DatesService } from "../../utilities/dates.service";
import { PostsService } from "../../services/posts.service";
import { StaticDataService } from "../../services/static-data.service";
import { MaterializeAction } from "angular2-materialize";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post
  @Output() onPostDeleted = new EventEmitter<any>();
  /*TODO can substitute passing post to functions with this.post because this class has an instance for each post.*/
  deleteModal = new EventEmitter<string | MaterializeAction>();

  constructor(private toastService: ToastService,
              public picturesService: PicturesService,
              public datesService: DatesService,
              private authHelperService: AuthHelperService,
              public postsService: PostsService,
              private staticDataService: StaticDataService) {
  }

  ngOnInit() {
    this.post.pictureUrl = this.postsService.getPictureUrlForPost(this.post)
  }

  openDeleteModal() {
    this.post.showModal = true
    setTimeout(() => {
      this.deleteModal.emit({action: 'modal', params: ['open']});
    }, 200)
  }

  closeDeleteModal() {
    this.deleteModal.emit({action: "modal", params: ['close']});
    setTimeout(() => {
      this.post.showModal = false
    }, 200)
  }

  commentPost(ev) {
    if (!this.post.comments && this.post.commentsCount > 0) {
      this.loadComments()
    }
    if (ev.keyCode == 13) {
      const comment = ev.target.value
      const postId = this.post._id
      if (comment.length) {
        this.postsService.commentPost(postId, {comment}).subscribe((data) => {
          if (!this.post.comments)
            this.post.comments = []
          let commentToAdd = {
            userId: this.authHelperService.getUserIdFromToken(),
            username: this.authHelperService.getUsernameFromToken(),
            comment: comment
          }
          this.post.comments.push(commentToAdd)
          this.post.commentsCount += 1
          this.post.showComments = true
        }, (error) => {
          if (error.status === 401) {
            this.toastService.warningToast("Log in to comment.")
          }
        })
        ev.target.value = null
      }
    }
  }

  likePost() {
    const postId = this.post._id
    this.postsService.likePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = true
      this.post.likesCount += 1
    }, (error) => {
      if (error.status === 401) {
        this.toastService.warningToast("Log in to like.")
      }
      console.log(error)
    })
  }

  unLikePost() {
    const postId = this.post._id
    this.postsService.unLikePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = false
      this.post.likesCount -= 1
    }, (error) => {
      console.log(error)
    })
  }

  deletePost() {
    const postId = this.post._id
    this.postsService.deletePost(postId).subscribe((data) => {
      this.onPostDeleted.emit(this.post);
      this.closeDeleteModal()
      console.log(data)
    }, (error) => {
      console.log(error)
    })
  }

  editPost() {
  }

  postAction() {
    if (this.post.isLikedByCurrentUser) {
      this.unLikePost()
    } else {
      this.likePost()
    }
  }

  loadComments() {
    const postId = this.post._id
    this.postsService.getComments(postId).subscribe((comments) => {
      if (comments.success) {
        this.post.comments = comments.data
        this.post.showComments = true
      }
    }, (error) => {
      console.log(error)
      this.toastService.toast("Couldn't load comments.")
    })
  }
}
