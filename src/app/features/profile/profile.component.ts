import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/auth/service/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private readonly _UsersService = inject(AuthService);

  userData: any = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.fetchProfileData();
  }

  fetchProfileData(): void {
    this.isLoading = true;
    this._UsersService.getProfileData().subscribe({
      next: (res) => {
        this.isLoading = false;
        // Map response matching your JSON structure
        this.userData = res.data?.user || res.user || null;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching profile data:', err);
      },
    });
  }
}
