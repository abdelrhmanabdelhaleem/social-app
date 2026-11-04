import { Component } from '@angular/core';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SuggestedFriendsComponent } from './components/suggested-friends/suggested-friends.component';

@Component({
  selector: 'app-feed',
  imports: [SidebarComponent, CreatePostComponent, PostCardComponent, SuggestedFriendsComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.sass',
})
export class FeedComponent {}
