import { Component, inject } from '@angular/core';
import { PostsService } from '../../core/auth/service/posts.service';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SuggestedFriendsComponent } from './components/suggested-friends/suggested-friends.component';
import { IPost } from '../../core/models/ipost.interface';

@Component({
  selector: 'app-feed',
  imports: [SidebarComponent, CreatePostComponent, PostCardComponent, SuggestedFriendsComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.sass',
})
export class FeedComponent {
  private readonly _PostsService = inject(PostsService);

  postsList: IPost[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.isLoading = true;
    this._PostsService.getAllPosts().subscribe({
      next: (res) => {
        console.log('Posts fetched successfully:', res);
        this.isLoading = false;
        this.postsList = res.data.posts;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching posts:', err);
      },
    });
  }
  // Remove deleted post from local array to update UI instantly
  removePostFromList(deletedPostId: string): void {
    this.postsList = this.postsList.filter((p) => (p._id || p.id) !== deletedPostId);
  }
}
