import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../../../core/auth/service/posts.service';
import { IPost } from '../../../../core/models/ipost.interface';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  @Input() post!: IPost;
  @Output() postDeleted = new EventEmitter<string>();
  // Add this property inside PostCardComponent class
  showComments: boolean = false;

  // Toggle function when clicking the Comment action button
  toggleComments(): void {
    this.showComments = !this.showComments;
  }
  private readonly _PostsService = inject(PostsService);

  isDropdownOpen: boolean = false;
  currentUserId: string = '';
  isDeleting: boolean = false;

  ngOnInit(): void {
    this.getCurrentUserId();
  }

  // Retrieve current logged-in user ID from localStorage
  getCurrentUserId(): void {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserId = user._id || user.id || '';
      } catch (error) {
        console.error('Error parsing userInfo from localStorage', error);
      }
    }
  }

  // Check if the post belongs to the currently authenticated user
  get isMyPost(): boolean {
    return this.post?.user?._id === this.currentUserId;
  }

  // Toggle options dropdown menu visibility
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close dropdown menu after an action
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // Delete post method calling PostsService
  onDeletePost(): void {
    const postId = this.post._id || this.post.id;
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.isDeleting = true;
    this._PostsService.deletePost(postId).subscribe({
      next: (res) => {
        this.isDeleting = false;
        this.closeDropdown();
        console.log('Post deleted successfully:', res);

        // Emit deleted post ID to parent (FeedComponent) to update UI list
        this.postDeleted.emit(postId);
      },
      error: (err) => {
        this.isDeleting = false;
        console.error('Error deleting post:', err);
      },
    });
  }
}
