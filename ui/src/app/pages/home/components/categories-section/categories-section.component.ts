import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Category } from '../../home.models';

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.scss'],
})
export class CategoriesSectionComponent {
  @Input({ required: true }) categories: Category[] = [];
  @Output() viewAll = new EventEmitter<void>();
  @Output() categoryClick = new EventEmitter<Category>();
}
