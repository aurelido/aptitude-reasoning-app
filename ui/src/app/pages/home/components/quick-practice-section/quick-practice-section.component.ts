import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QuickPractice } from '../../home.models';

@Component({
  selector: 'app-quick-practice-section',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './quick-practice-section.component.html',
  styleUrls: ['./quick-practice-section.component.scss'],
})
export class QuickPracticeSectionComponent {
  @Input({ required: true }) options: QuickPractice[] = [];
  @Output() startPractice = new EventEmitter<QuickPractice>();
}
