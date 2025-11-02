import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

type TopicStatus = 'not-started' | 'in-progress' | 'completed';

type Topic = {
  name: string;
  progress: number;
  questions: number;
  status: TopicStatus;
};

type Category = {
  name: string;
  description: string;
  color: string;
  slug: string;
  topics: Topic[];
};

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage {
  slug: string = '';
  category: Category | null = null;
  searchQuery = signal('');
  filterStatus = signal<string>('all');
  filterQuestions = signal<string>('all');
  showFilterModal = false;

  private readonly categoryData: Record<string, Category> = {
    'abstract-reasoning': {
      name: 'Abstract Reasoning',
      description: 'Pattern recognition and logical sequences',
      color: 'purple',
      slug: 'abstract-reasoning',
      topics: [
        { name: 'Pattern Recognition', progress: 75, questions: 45, status: 'in-progress' },
        { name: 'Logical Sequences', progress: 100, questions: 38, status: 'completed' },
        { name: 'Analogies', progress: 45, questions: 42, status: 'in-progress' },
        { name: 'Odd One Out', progress: 0, questions: 35, status: 'not-started' },
        { name: 'Matrix Problems', progress: 20, questions: 50, status: 'in-progress' },
        { name: 'Figure Series', progress: 0, questions: 40, status: 'not-started' },
      ],
    },
    'verbal-reasoning': {
      name: 'Verbal Reasoning',
      description: 'Reading comprehension and language skills',
      color: 'blue',
      slug: 'verbal-reasoning',
      topics: [
        { name: 'Reading Comprehension', progress: 60, questions: 55, status: 'in-progress' },
        { name: 'Synonyms & Antonyms', progress: 100, questions: 40, status: 'completed' },
        { name: 'Sentence Completion', progress: 30, questions: 45, status: 'in-progress' },
        { name: 'Analogies', progress: 80, questions: 38, status: 'in-progress' },
        { name: 'Critical Reasoning', progress: 0, questions: 50, status: 'not-started' },
        { name: 'Verbal Logic', progress: 0, questions: 42, status: 'not-started' },
      ],
    },
    'numerical-reasoning': {
      name: 'Numerical Reasoning',
      description: 'Mathematical problems and data analysis',
      color: 'green',
      slug: 'numerical-reasoning',
      topics: [
        { name: 'Number Systems', progress: 90, questions: 48, status: 'in-progress' },
        { name: 'Percentages', progress: 100, questions: 42, status: 'completed' },
        { name: 'Ratios & Proportions', progress: 65, questions: 40, status: 'in-progress' },
        { name: 'Time & Work', progress: 40, questions: 45, status: 'in-progress' },
        { name: 'Speed & Distance', progress: 0, questions: 38, status: 'not-started' },
        { name: 'Profit & Loss', progress: 0, questions: 44, status: 'not-started' },
      ],
    },
    'logical-reasoning': {
      name: 'Logical Reasoning',
      description: 'Critical thinking and deductive reasoning',
      color: 'amber',
      slug: 'logical-reasoning',
      topics: [
        { name: 'Syllogisms', progress: 70, questions: 50, status: 'in-progress' },
        { name: 'Blood Relations', progress: 100, questions: 35, status: 'completed' },
        { name: 'Coding-Decoding', progress: 55, questions: 42, status: 'in-progress' },
        { name: 'Direction Sense', progress: 100, questions: 30, status: 'completed' },
        { name: 'Seating Arrangement', progress: 25, questions: 48, status: 'in-progress' },
        { name: 'Puzzles', progress: 0, questions: 52, status: 'not-started' },
      ],
    },
    'spatial-reasoning': {
      name: 'Spatial Reasoning',
      description: 'Visual and spatial problem solving',
      color: 'cyan',
      slug: 'spatial-reasoning',
      topics: [
        { name: 'Mental Rotation', progress: 50, questions: 40, status: 'in-progress' },
        { name: '3D Shapes', progress: 80, questions: 35, status: 'in-progress' },
        { name: 'Paper Folding', progress: 100, questions: 30, status: 'completed' },
        { name: 'Mirror Images', progress: 0, questions: 32, status: 'not-started' },
        { name: 'Cube & Dice', progress: 0, questions: 38, status: 'not-started' },
      ],
    },
    'diagrammatic-reasoning': {
      name: 'Diagrammatic Reasoning',
      description: 'Process diagrams and flowcharts',
      color: 'pink',
      slug: 'diagrammatic-reasoning',
      topics: [
        { name: 'Process Diagrams', progress: 40, questions: 35, status: 'in-progress' },
        { name: 'Flowcharts', progress: 70, questions: 40, status: 'in-progress' },
        { name: 'Network Diagrams', progress: 0, questions: 32, status: 'not-started' },
        { name: 'Venn Diagrams', progress: 100, questions: 28, status: 'completed' },
        { name: 'Input-Output', progress: 0, questions: 38, status: 'not-started' },
      ],
    },
    'data-interpretation': {
      name: 'Data Interpretation',
      description: 'Charts, graphs, and statistical data',
      color: 'indigo',
      slug: 'data-interpretation',
      topics: [
        { name: 'Bar Charts', progress: 85, questions: 45, status: 'in-progress' },
        { name: 'Line Graphs', progress: 100, questions: 42, status: 'completed' },
        { name: 'Pie Charts', progress: 60, questions: 38, status: 'in-progress' },
        { name: 'Tables', progress: 100, questions: 40, status: 'completed' },
        { name: 'Mixed Charts', progress: 0, questions: 50, status: 'not-started' },
        { name: 'Data Sufficiency', progress: 0, questions: 44, status: 'not-started' },
      ],
    },
    'critical-thinking': {
      name: 'Critical Thinking',
      description: 'Analytical and evaluative thinking',
      color: 'red',
      slug: 'critical-thinking',
      topics: [
        { name: 'Assumptions', progress: 55, questions: 40, status: 'in-progress' },
        { name: 'Conclusions', progress: 75, questions: 38, status: 'in-progress' },
        { name: 'Arguments', progress: 100, questions: 35, status: 'completed' },
        { name: 'Inferences', progress: 30, questions: 42, status: 'in-progress' },
        { name: 'Cause & Effect', progress: 0, questions: 36, status: 'not-started' },
        { name: 'Problem Solving', progress: 0, questions: 48, status: 'not-started' },
      ],
    },
  };

  filteredTopics = computed(() => {
    if (!this.category) return [];
    const query = this.searchQuery().toLowerCase();
    const status = this.filterStatus();
    const questions = this.filterQuestions();

    return this.category.topics.filter((topic) => {
      const matchesSearch = topic.name.toLowerCase().includes(query);
      const matchesStatus = status === 'all' || topic.status === status;
      let matchesQuestions = true;

      if (questions === '1-35') {
        matchesQuestions = topic.questions >= 1 && topic.questions <= 35;
      } else if (questions === '36-45') {
        matchesQuestions = topic.questions >= 36 && topic.questions <= 45;
      } else if (questions === '46+') {
        matchesQuestions = topic.questions >= 46;
      }

      return matchesSearch && matchesStatus && matchesQuestions;
    });
  });

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.filterStatus() !== 'all') count++;
    if (this.filterQuestions() !== 'all') count++;
    return count;
  });

  constructor(private route: ActivatedRoute, private router: Router) {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.category = this.categoryData[this.slug] || null;
  }

  getStatusIcon(status: TopicStatus): string {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'in-progress':
        return 'play-circle';
      default:
        return 'ellipse-outline';
    }
  }

  getStatusColor(status: TopicStatus): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      default:
        return 'medium';
    }
  }

  getButtonText(status: TopicStatus): string {
    if (status === 'completed') return 'Review';
    if (status === 'in-progress') return 'Resume';
    return 'Start';
  }

  getButtonColor(status: TopicStatus): string {
    if (status === 'completed') return 'success';
    if (status === 'in-progress') return 'primary';
    return 'secondary';
  }

  goBack() {
    this.router.navigate(['/categories']);
  }

  openFilterModal() {
    this.showFilterModal = true;
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  clearFilters() {
    this.filterStatus.set('all');
    this.filterQuestions.set('all');
  }

  navigateToTopic(topic: Topic) {
    this.router.navigate(['/categories', this.slug, 'topic', this.slugify(topic.name)]);
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}
