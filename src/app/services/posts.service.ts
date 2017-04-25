import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from "rxjs";

@Injectable()
export class PostsService {

  constructor(private apiService: ApiService) {
  }

  commentPost(id: string, data: any): Observable<any> {
    return this.apiService.post(`pictures/comment/${id}`, data)
  }

  getComments(id: string): Observable<any> {
    return this.apiService.get(`pictures/comments/${id}`)
  }

  likePost(id: string): Observable<any> {
    return this.apiService.post(`pictures/like/${id}`, {})
  }

  unLikePost(id: string): Observable<any> {
    return this.apiService.post(`pictures/unlike/${id}`, {})
  }

  deletePost(id: string): Observable<any> {
    return this.apiService.delete(`pictures/delete/${id}`)
  }

  getPictureUrlForPost(post: any): string {
    return `${this.apiService.apiUrl}pictures/big/${post._id}`
  }
}
