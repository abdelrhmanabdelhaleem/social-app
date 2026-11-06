import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  // Headers configuration matching Postman's Bearer Token format
  myHeaders: object = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken') || ''}`,
    },
  };

  // 1. Get All Posts
  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts`, this.myHeaders);
  }

  // 2. Get Single Post by ID
  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}`, this.myHeaders);
  }

  // 3. Create New Post
  createPost(postData: FormData): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts`, postData, this.myHeaders);
  }

  // 4. Update Post by ID
  updatePost(postId: string, postData: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}`, postData, this.myHeaders);
  }

  // 5. Delete Post by ID
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/posts/${postId}`, this.myHeaders);
  }
}
