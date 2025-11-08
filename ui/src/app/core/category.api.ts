import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon?: string;
  iconSvg?: string;
  color?: string;
  topics?: string[];
  topicCount?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryApi {
  private readonly api = inject(ApiService);
  list(params?: { includeProgress?: string; featured?: string; active?: string; }): Observable<CategoryDto[] | any> {
    return this.api.get<CategoryDto[]>('/categories', params as any);
  }
  bySlug(slug: string, params?: { includeProgress?: string; }): Observable<CategoryDto | any> {
    return this.api.get(`/categories/${slug}`, params as any);
  }
}
