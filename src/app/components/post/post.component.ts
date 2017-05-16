import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { ToastService } from "../../services/toast.service";
import { PicturesService } from "../../services/pictures.service";
import { PostsService } from "../../services/posts.service";
import { MaterializeAction } from "angular2-materialize";
import { StaticDataService } from "../../services/static-data.service";
import { ValidateService } from "../../services/validate.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  @Input() post;
  @ViewChild('postElement') postElement: ElementRef;
  deleteModal = new EventEmitter<string | MaterializeAction>();
  editModal = new EventEmitter<string | MaterializeAction>();
  newComment: string;

  constructor(private toastService: ToastService,
              private picturesService: PicturesService,
              private authHelperService: AuthHelperService,
              private postsService: PostsService,
              private staticDataService: StaticDataService,
              private validateService: ValidateService) {
  }

  ngOnInit() {
    this.post.pictureUrl = this.postsService.getPictureUrlForPost(this.post);
    this.post.profilePicUrl = this.picturesService.getProfilePicUrl(this.post.username);
    this.post.canEdit = (this.post.userId === this.authHelperService.getUserIdFromToken());
    this.post.hasMetadata = (this.post.metadata && Object.keys(this.post.metadata).length)
    this.newComment = '';
  }

  openDeleteModal() {
    this.post.showDeleteModal = true;
    setTimeout(() => {
      this.deleteModal.emit({action: 'modal', params: ['open']});
    }, 200);
  }

  closeDeleteModal() {
    this.deleteModal.emit({action: "modal", params: ['close']});
  }

  openEditModal() {
    this.post.showEditModal = true;
    setTimeout(() => {
      this.editModal.emit({action: 'modal', params: ['open']});
    }, 200);
  }

  closeEditModal() {
    this.editModal.emit({action: "modal", params: ['close']});
  }

  commentPost() {
    if (!this.post.comments && this.post.commentsCount > 0) {
      this.loadComments();
    }
    const comment = this.newComment;
    const postId = this.post._id;
    if (comment.length) {
      this.postsService.commentPost(postId, {comment}).subscribe((data) => {
        if (!this.post.comments)
          this.post.comments = [];
        let commentToAdd = {
          userId: this.authHelperService.getUserIdFromToken(),
          username: this.authHelperService.getUsernameFromToken(),
          comment: comment
        };
        this.post.comments.push(commentToAdd);
        this.post.commentsCount += 1;
        this.post.showComments = true;
      }, (error) => {
        if (error.status === 401) {
          this.toastService.warningToast("Log in to comment.");
        }
      });
      this.newComment = '';
    }
  }

  likePost() {
    const postId = this.post._id;
    this.postsService.likePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = true;
      this.post.likesCount += 1;
    }, (error) => {
      if (error.status === 401) {
        this.toastService.warningToast("Log in to like.");
      }
      console.log(error);
    });
  }

  unLikePost() {
    const postId = this.post._id;
    this.postsService.unLikePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = false;
      this.post.likesCount -= 1;
    }, (error) => {
      console.log(error);
    });
  }

  deletePost() {
    const postId = this.post._id;
    this.postsService.deletePost(postId).subscribe((data) => {
      this.postElement.nativeElement.remove();
      this.closeDeleteModal();
    }, (error) => {
      console.log(error);
    });
  }

  editPost(eventPayload) {
    const postId = this.post._id;
    let dataToSend = {...eventPayload};
    delete dataToSend.newDroneSelector;
    dataToSend.newTags = this.validateService.getTags(dataToSend.newTags)
    if (!dataToSend.newTags) dataToSend.newTags = []
    this.postsService.editPost(postId, dataToSend).subscribe((response) => {
      if (response.success) {
        this.post.caption = dataToSend.newCaption;
        this.post.tags = dataToSend.newTags.map((x) => x.substr(1));
        this.post.droneTaken = dataToSend.newSelectedDroneName;
        this.closeEditModal();
      }
    }, (error) => {
      if (error.status === 401) {
        this.toastService.warningToast("Log in to edit.");
      }
      console.log(error);
    });
  }

  postRateAction() {
    if (this.post.isLikedByCurrentUser) {
      this.unLikePost();
    } else {
      this.likePost();
    }
  }

  loadComments() {
    const postId = this.post._id;
    this.postsService.getComments(postId).subscribe((comments) => {
      if (comments.success) {
        this.post.comments = comments.data;
        this.post.showComments = true;
      }
    }, (error) => {
      console.log(error);
      this.toastService.toast("Couldn't load comments.");
    });
  }
}

