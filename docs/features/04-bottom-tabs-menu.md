# Bottom Tabs Menu

## Overview
Fixed bottom navigation bar providing quick access to the four primary sections of the app. Designed with mobile-first principles and always visible for easy navigation.

---

## 🎯 Navigation Structure

### Four Primary Tabs

**1. Home Tab**
- Icon: `home` (outline)
- Active Icon: `home` (filled)
- Label: "Home"
- Route: `/tabs/home`
- Purpose: Dashboard and personalized content

**2. Explore Tab**
- Icon: `compass` (outline)
- Active Icon: `compass` (filled)
- Label: "Explore"
- Route: `/tabs/categories`
- Purpose: Browse all categories and topics

**3. Progress Tab**
- Icon: `stats-chart` (outline)
- Active Icon: `stats-chart` (filled)
- Label: "Progress"
- Route: `/tabs/progress`
- Purpose: View learning statistics and history

**4. Profile Tab**
- Icon: `person` (outline)
- Active Icon: `person` (filled)
- Label: "Profile"
- Route: `/tabs/profile`
- Purpose: User settings and account management

---

## 📱 Visual Design

### Layout
```scss
ion-tab-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 56px; // Standard mobile tab bar height
  border-top: 1px solid #e5e7eb;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}
```

### Tab Button Styling
```scss
ion-tab-button {
  // Inactive state
  color: #6b7280; // Gray
  
  // Active state
  &.tab-selected {
    color: var(--ion-color-primary);
    ion-icon {
      transform: scale(1.1);
    }
  }
  
  // Tap feedback
  &:active {
    opacity: 0.7;
  }
}
```

### Icon Sizing
- **Mobile**: 24px icons
- **Tablet**: 28px icons (optional enhancement)

### Label Typography
- **Font Size**: 12px
- **Weight**: 500 (medium)
- **Active Weight**: 600 (semi-bold)

---

## 🎨 States & Interactions

### Active State
- Icon changes to filled version
- Color changes to primary
- Label becomes semi-bold
- Subtle scale animation (1.1x)

### Inactive State
- Outline icons
- Gray color (#6b7280)
- Regular weight label
- Normal scale

### Tap/Press State
- Reduced opacity (0.7)
- Quick visual feedback
- Returns to normal on release

---

## 🛣️ Routing Configuration

### Tab Routes Structure
```typescript
// tabs-routing.module.ts
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module')
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            loadComponent: () => import('../pages/categories/categories.page')
          },
          {
            path: ':categorySlug',
            loadComponent: () => import('../pages/category/category.page')
          },
          {
            path: ':categorySlug/topics/:topicSlug',
            loadComponent: () => import('../pages/topic/topic.page')
          }
        ]
      },
      {
        path: 'progress',
        loadChildren: () => import('../pages/progress/progress.module')
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module')
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];
```

---

## 🔄 Navigation Behavior

### Deep Navigation
Tabs remain visible when navigating to:
- Category detail pages
- Topic detail pages
- Test/practice screens (configurable)

### Hidden Contexts
Tabs may be hidden for:
- Fullscreen test-taking
- Onboarding flow
- Authentication pages

### Back Navigation
- System back button navigates within tab
- Tapping active tab scrolls to top
- Deep links maintain tab context

---

## ♿ Accessibility

### ARIA Labels
```html
<ion-tab-button tab="home" aria-label="Home">
  <ion-icon name="home"></ion-icon>
  <ion-label>Home</ion-label>
</ion-tab-button>
```

### Touch Targets
- Minimum 44x44px touch area
- Adequate spacing between tabs
- No overlapping interactive elements

### Screen Readers
- Announce active tab
- Announce tab changes
- Semantic HTML structure

---

## 📐 Responsive Adaptations

### Mobile (< 768px)
- Fixed bottom position
- 4 evenly distributed tabs
- Icon + label both visible
- 56px height

### Tablet (≥ 768px)
- Larger icons (28px)
- More padding
- Same bottom position
- 64px height (optional)

### Desktop (Future)
- Side navigation alternative
- Persistent drawer
- Expanded labels
- Hierarchical menu

---

## 🎯 Badge Support

### Notification Badges
```html
<ion-tab-button tab="profile">
  <ion-icon name="person"></ion-icon>
  <ion-label>Profile</ion-label>
  <ion-badge>3</ion-badge>
</ion-tab-button>
```

**Use Cases**:
- Unread notifications
- Pending tasks
- New content available
- Achievement unlocked

**Styling**:
```scss
ion-badge {
  position: absolute;
  top: 4px;
  right: 20%;
  min-width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  font-size: 10px;
}
```

---

## 🔐 Authentication State

### Logged In
- All tabs accessible
- Normal navigation flow
- Progress data visible

### Logged Out
- Limited tab access
- Redirect to login on protected tabs
- Guest mode for Explore tab

---

## 🧪 Implementation Code

### TabsPage Component
```typescript
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(private router: Router) {}
  
  onTabChange(event: any) {
    // Track tab navigation
    console.log('Tab changed:', event.tab);
  }
}
```

### TabsPage Template
```html
<ion-tabs (ionTabsDidChange)="onTabChange($event)">
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="home">
      <ion-icon name="home"></ion-icon>
      <ion-label>Home</ion-label>
    </ion-tab-button>
    
    <ion-tab-button tab="categories">
      <ion-icon name="compass"></ion-icon>
      <ion-label>Explore</ion-label>
    </ion-tab-button>
    
    <ion-tab-button tab="progress">
      <ion-icon name="stats-chart"></ion-icon>
      <ion-label>Progress</ion-label>
    </ion-tab-button>
    
    <ion-tab-button tab="profile">
      <ion-icon name="person"></ion-icon>
      <ion-label>Profile</ion-label>
    </ion-tab-button>
  </ion-tab-bar>
</ion-tabs>
```

---

## 🎨 Theme Customization

### CSS Variables
```scss
ion-tab-bar {
  --background: white;
  --border: 1px solid #e5e7eb;
  --color: #6b7280;
  --color-selected: var(--ion-color-primary);
}

ion-tab-button {
  --padding-top: 8px;
  --padding-bottom: 8px;
  --ripple-color: var(--ion-color-primary-tint);
}
```

---

## 📊 Analytics Tracking

### Events to Track
- Tab selection
- Navigation patterns
- Time spent per tab
- Feature discovery

### Implementation
```typescript
onTabChange(event: any) {
  this.analytics.logEvent('tab_navigation', {
    from_tab: this.currentTab,
    to_tab: event.tab,
    timestamp: new Date()
  });
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Tabs disappear on navigation
**Solution**: Ensure child routes are defined within tabs routing module

### Issue: Wrong tab appears active
**Solution**: Check route paths match tab attribute exactly

### Issue: Back button exits app
**Solution**: Configure tab stack navigation properly

---

## 🔮 Future Enhancements

### Planned Features
- Swipe gestures between tabs
- Long-press for tab shortcuts
- Customizable tab order
- More than 4 tabs with overflow menu
- Tab animations
- Contextual tab badges
- Quick actions on long-press

### Advanced Patterns
- Tab pre-loading for performance
- Lazy loading improvements
- State preservation per tab
- Tab history management
