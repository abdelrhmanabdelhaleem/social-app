import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-suggested-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suggested-friends.component.html',
  styleUrls: ['./suggested-friends.component.css'],
})
export class SuggestedFriendsComponent {}
