import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

type UserProfile = {
  name: string;
  firstName: string;
  email: string;
  avatar?: string;
  initials: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  // Mock user data - in real app, this would come from a service/store
  user = signal<UserProfile>({
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    email: 'sarah.johnson@example.com',
    avatar: '', // Empty string means no avatar, will show initials
    initials: 'SJ',
  });

  constructor(private router: Router) {}

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  navigateToSettings() {
    // TODO: Create settings page
    this.router.navigate(['/tabs/profile']); // Temporary redirect to profile
  }
}
