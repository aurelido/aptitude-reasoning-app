import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserProfile } from '../../home.models';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent {
  @Input({ required: true }) user!: UserProfile;
  @Input({ required: true }) greeting!: string;
  @Input({ required: true }) unreadNotifications!: number;

  @Output() profileClick = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
}
