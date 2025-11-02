import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'categories',
        loadComponent: () => import('../pages/categories/categories.page').then(m => m.CategoriesPage)
      },
      {
        path: 'categories/:slug',
        loadComponent: () => import('../pages/category/category.page').then(m => m.CategoryPage)
      },
      {
        path: 'categories/:slug/topic/:topicSlug',
        loadComponent: () => import('../pages/topic/topic.page').then(m => m.TopicPage)
      },
      {
        path: 'progress',
        loadComponent: () => import('../pages/progress/progress.page').then(m => m.ProgressPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('../pages/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
