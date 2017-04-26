import { Component, ElementRef, EventEmitter, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  }

  openDeleteModal(post) {
    post.showModal = true
    setTimeout(()=>{
      this.deleteModal.emit({action: 'modal', params: ['open']});
    },200)
  }

  closeDeleteModal(post){
    this.deleteModal.emit({action:"modal",params:['close']});
    setTimeout(()=>{
      post.showModal = false
    },200)
  }

  commentPost(ev, post) {
    if (!post.comments && post.commentsCount > 0) {
      this.loadComments(post)
    }
    if (ev.keyCode == 13) {
      const comment = ev.target.value
      /*TODO Filter comments.*/
      const postId = post._id
      this.postsService.commentPost(postId, {comment}).subscribe((data) => {
        if (!post.comments)
          post.comments = []
        let commentToAdd = {
          userId: this.authHelperService.getUserIdFromToken(),
          username: this.authHelperService.getUsernameFromToken(),
          comment: comment
        }
        post.comments.push(commentToAdd)
        post.commentsCount += 1
        post.showComments = true
      }, (error) => {
        if (error.status === 401) {
          this.toastService.warningToast("Log in to comment.")
        }
      })
      ev.target.value = null
    }
  }

  likePost(post) {
    const postId = post._id
    this.postsService.likePost(postId).subscribe((data) => {
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
    const postId = post._id
    this.postsService.unLikePost(postId).subscribe((data) => {
      post.isLikedByCurrentUser = false
      post.likesCount -= 1
    }, (error) => {
      console.log(error)
    })
  }

  deletePost(post, postElement) {
    console.log(typeof postElement)
    const postId = post._id
    this.postsService.deletePost(postId).subscribe((data) => {
      postElement.remove()
      this.closeDeleteModal(post)
      console.log(data)
    }, (error) => {
      console.log(error)
    })
  }

  editPost(post) {
    console.log(post)
  }

  loadComments(post) {
    const postId = post._id
    this.postsService.getComments(postId).subscribe((comments) => {
      if (comments.success) {
        post.comments = comments.data
        post.showComments = true
      }
    }, (error) => {
      console.log(error)
      this.toastService.toast("Couldn't load comments.")
    })

  }
}
