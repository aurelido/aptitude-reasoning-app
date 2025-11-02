import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

type Category = {
  slug: string;
  name: string;
  icon?: string;
  iconSvg?: string;
  description: string;
  topics: number;
};

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {
  readonly categories: Category[] = [
    {
      slug: 'abstract-reasoning',
      name: 'Abstract Reasoning',
      icon: 'shapes-outline',
      description: 'Pattern recognition and logical sequences',
      topics: 24,
    },
    {
      slug: 'verbal-reasoning',
      name: 'Verbal Reasoning',
      iconSvg: 'assets/categories/verbal-reasoning.svg',
      description: 'Reading comprehension and language skills',
      topics: 32,
    },
    {
      slug: 'numerical-reasoning',
      name: 'Numerical Reasoning',
      iconSvg: 'assets/categories/numerical-reasoning.svg',
      description: 'Mathematical problems and data analysis',
      topics: 28,
    },
    {
      slug: 'logical-reasoning',
      name: 'Logical Reasoning',
      iconSvg: 'assets/categories/logical-reasoning.svg',
      description: 'Critical thinking and deductive reasoning',
      topics: 30,
    },
    {
      slug: 'spatial-reasoning',
      name: 'Spatial Reasoning',
      icon: 'cube-outline',
      description: 'Visual and spatial problem solving',
      topics: 20,
    },
    {
      slug: 'diagrammatic-reasoning',
      name: 'Diagrammatic Reasoning',
      iconSvg: 'assets/categories/diagrammatic-reasoning.svg',
      description: 'Process diagrams and flowcharts',
      topics: 18,
    },
    {
      slug: 'data-interpretation',
      name: 'Data Interpretation',
      iconSvg: 'assets/categories/data-interpretation.svg',
      description: 'Charts, graphs, and statistical data',
      topics: 26,
    },
    {
      slug: 'critical-thinking',
      name: 'Critical Thinking',
      iconSvg: 'assets/categories/critical-thinking.svg',
      description: 'Analytical and evaluative thinking',
      topics: 22,
    },
  ];

  search = signal('');
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.categories;
    return this.categories.filter(c =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  });

  onSearch(ev: CustomEvent) {
    // ion-searchbar emits detail.value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (ev as any).detail?.value ?? '';
    this.search.set(value);
  }

  getCategoryColorClass(slug: string): string {
    const colorMap: Record<string, string> = {
      'abstract-reasoning': 'purple',
      'verbal-reasoning': 'blue',
      'numerical-reasoning': 'green',
      'logical-reasoning': 'amber',
      'spatial-reasoning': 'cyan',
      'diagrammatic-reasoning': 'pink',
      'data-interpretation': 'indigo',
      'critical-thinking': 'red',
    };
    return colorMap[slug] || 'purple';
  }
}
