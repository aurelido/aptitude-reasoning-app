# Responsive Design - Mobile-First Approach

## Overview
The Aptitude Reasoning App follows a mobile-first responsive design strategy, ensuring optimal user experience across all device sizes from smartphones to desktop computers.

---

## 📱 Breakpoint System

### Standard Breakpoints
```scss
// Mobile (default)
// 0px - 639px

// Small tablets
@media (min-width: 640px) { }

// Tablets & large phones
@media (min-width: 768px) { }

// Desktop & laptops
@media (min-width: 1024px) { }

// Large desktops
@media (min-width: 1280px) { }
```

### Application-Specific Breakpoints
Most commonly used in the app:
- **Mobile**: < 640px (primary target)
- **Tablet**: 640px - 1023px
- **Desktop**: ≥ 1024px

---

## 🎯 Mobile-First Strategy

### Core Principles
1. **Design for mobile first** - Start with smallest screen
2. **Progressive enhancement** - Add features for larger screens
3. **Content priority** - Most important content first
4. **Touch-optimized** - Finger-friendly interactions
5. **Performance-focused** - Fast load times on mobile networks

### Implementation Pattern
```scss
// Base styles (mobile)
.component {
  font-size: 1rem;
  padding: 1rem;
}

// Tablet enhancements
@media (min-width: 768px) {
  .component {
    font-size: 1.125rem;
    padding: 1.5rem;
  }
}

// Desktop enhancements
@media (min-width: 1024px) {
  .component {
    font-size: 1.25rem;
    padding: 2rem;
  }
}
```

---

## 📐 Layout Adaptations

### Home Screen Sections

#### Continue Learning Card
**Mobile** (< 768px):
```scss
padding: 1.25rem;
font-size: 1.25rem (title);
```

**Tablet** (≥ 768px):
```scss
padding: 1.5rem;
font-size: 1.5rem (title);
```

#### Daily Challenge Card
**Mobile**:
- Compact layout
- Stacked content
- Icon: 32px

**Tablet**:
- More spacious padding (1.5rem)
- Larger typography
- Enhanced visual hierarchy

#### Quick Practice Grid
**Mobile** (< 640px):
```scss
grid-template-columns: 1fr; // Single column
gap: 0.875rem;
```

**Tablet** (≥ 640px):
```scss
grid-template-columns: repeat(2, 1fr); // Two columns
gap: 1rem;
```

#### Categories Horizontal Scroll
**Mobile**:
```scss
.category-card {
  flex: 0 0 140px; // Fixed width
  padding: 1rem 0.75rem;
  
  .icon-container {
    width: 64px;
    height: 64px;
  }
}
```

**Tablet** (≥ 768px):
```scss
.category-card {
  flex: 0 0 160px; // Larger width
  padding: 1.25rem 1rem;
  
  .icon-container {
    width: 72px;
    height: 72px;
  }
}
```

#### Recommended Topics List
**Mobile**:
```scss
.topic-card {
  .topic-content {
    padding: 1rem;
  }
  
  .topic-title {
    font-size: 1rem;
  }
}
```

**Tablet**:
```scss
.topic-card {
  .topic-content {
    padding: 1.25rem;
  }
  
  .topic-title {
    font-size: 1.063rem;
  }
}
```

---

## 📱 Touch Targets

### Minimum Sizes
- **Buttons**: 44x44px minimum (Apple guideline)
- **Touch areas**: 48x48px minimum (Material Design)
- **Text links**: 44px height with padding
- **Icon buttons**: 48x48px touch area

### Implementation
```scss
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 8px; // Ensures 44px with content
  
  @media (min-width: 768px) {
    min-width: 48px;
    min-height: 48px;
  }
}
```

---

## 🔤 Typography Scaling

### Font Size Adjustments

#### Headings
```scss
// Section titles
.section-title {
  font-size: 1.125rem; // Mobile
  
  @media (min-width: 768px) {
    font-size: 1.25rem; // Tablet
  }
}

// Page titles
.page-title {
  font-size: 1.5rem; // Mobile
  
  @media (min-width: 768px) {
    font-size: 1.75rem; // Tablet
  }
  
  @media (min-width: 1024px) {
    font-size: 2rem; // Desktop
  }
}
```

#### Body Text
```scss
.body-text {
  font-size: 0.875rem; // Mobile (14px)
  line-height: 1.5;
  
  @media (min-width: 768px) {
    font-size: 1rem; // Tablet (16px)
    line-height: 1.6;
  }
}
```

#### Small Text
```scss
.small-text {
  font-size: 0.75rem; // Mobile (12px)
  
  @media (min-width: 768px) {
    font-size: 0.813rem; // Tablet (13px)
  }
}
```

---

## 🖼️ Image Handling

### Responsive Images
```html
<img 
  src="image-small.jpg"
  srcset="
    image-small.jpg 640w,
    image-medium.jpg 1024w,
    image-large.jpg 1920w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Description"
/>
```

### SVG Icons
- Scale perfectly at any size
- Use viewBox for proper scaling
- Apply `width` and `height` via CSS
- Support color customization via `currentColor`

### Avatar Sizing
```scss
.avatar {
  width: 48px;
  height: 48px;
  
  @media (min-width: 768px) {
    width: 56px;
    height: 56px;
  }
  
  @media (min-width: 1024px) {
    width: 64px;
    height: 64px;
  }
}
```

---

## 📏 Spacing Scale

### Padding Adjustments
```scss
.container {
  padding: 1rem; // Mobile (16px)
  
  @media (min-width: 768px) {
    padding: 1.5rem; // Tablet (24px)
  }
  
  @media (min-width: 1024px) {
    padding: 2rem; // Desktop (32px)
  }
}
```

### Gap Sizing
```scss
.grid {
  gap: 0.75rem; // Mobile (12px)
  
  @media (min-width: 768px) {
    gap: 1rem; // Tablet (16px)
  }
  
  @media (min-width: 1024px) {
    gap: 1.5rem; // Desktop (24px)
  }
}
```

---

## 🎛️ Navigation Adaptations

### Bottom Tab Bar
**Mobile & Tablet**:
- Fixed bottom position
- Always visible
- 4 primary tabs
- Icon + label

**Desktop** (future):
- Side navigation option
- Expanded labels
- Sub-navigation visible

### Top Bar
**Mobile**:
```scss
.home-header {
  padding: 0.5rem 1rem;
  
  .user-name {
    max-width: 200px;
  }
}
```

**Tablet**:
```scss
.home-header {
  padding: 0.75rem 1.5rem;
  
  .user-name {
    max-width: 300px;
  }
}
```

---

## 📊 Content Density

### Card Layouts

#### Compact (Mobile)
- Minimal padding
- Stacked layout
- Essential information only
- Single column grids

#### Comfortable (Tablet)
- Increased padding
- Two-column grids
- Additional metadata visible
- Larger typography

#### Spacious (Desktop)
- Generous white space
- Three+ column grids
- Full metadata visible
- Sidebar navigation possible

---

## 🔄 Orientation Handling

### Portrait (Primary)
- Vertical scrolling
- Stacked content
- Bottom navigation
- Full-width cards

### Landscape
```scss
@media (orientation: landscape) {
  .continue-learning-card {
    // Adjust height to fit viewport
    max-height: 50vh;
  }
  
  .categories-scroll {
    // More items visible
    .category-card {
      flex: 0 0 120px;
    }
  }
}
```

---

## 🎨 Visual Adjustments

### Shadow Intensity
```scss
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); // Mobile
  
  @media (min-width: 768px) {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); // Tablet
  }
}
```

### Border Radius
```scss
.card {
  border-radius: 12px; // Mobile
  
  @media (min-width: 1024px) {
    border-radius: 16px; // Desktop
  }
}
```

### Icon Sizing
```scss
.icon {
  font-size: 20px; // Mobile
  
  @media (min-width: 768px) {
    font-size: 24px; // Tablet
  }
}
```

---

## 📱 Platform-Specific Optimizations

### iOS
- Safe area insets for notch devices
- Momentum scrolling
- Native-feeling animations

### Android
- Material Design motion
- System back button support
- Status bar integration

### Web
- Progressive Web App (PWA) support
- Install prompt
- Offline functionality

---

## 🚀 Performance Considerations

### Mobile Optimization
- Lazy load images
- Code splitting
- Minimize JavaScript bundle
- Optimize CSS delivery
- Use system fonts

### Network Awareness
```typescript
// Adapt based on connection
if (navigator.connection?.effectiveType === '4g') {
  // Load high-quality images
} else {
  // Load optimized images
}
```

---

## 🧪 Testing Strategy

### Device Testing
- **Physical Devices**:
  - iPhone SE (smallest modern iOS)
  - iPhone 14 Pro (notch)
  - Samsung Galaxy S23 (Android)
  - iPad Pro (tablet)

- **Browser DevTools**:
  - Chrome DevTools device mode
  - Responsive design mode
  - Network throttling

### Breakpoint Testing
```
Test at these specific widths:
- 320px (small phones)
- 375px (iPhone SE)
- 390px (iPhone 14)
- 412px (Pixel 7)
- 640px (breakpoint)
- 768px (tablet breakpoint)
- 1024px (desktop breakpoint)
- 1440px (large desktop)
```

---

## 🎯 Accessibility Considerations

### Responsive Text
- Maintain readability at all sizes
- Ensure sufficient line height
- Avoid truncation of important text
- Support dynamic type sizing

### Touch Accessibility
- Adequate spacing between touch targets
- No overlapping interactive elements
- Visual feedback on touch
- Support for assistive touch

### Viewport Configuration
```html
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

---

## 📝 Best Practices

### Do's ✅
- Start with mobile design
- Test on real devices
- Consider thumb zones
- Use flexible layouts
- Optimize images for each size
- Provide appropriate touch targets
- Test landscape orientation

### Don'ts ❌
- Don't hide essential content on mobile
- Don't use fixed pixel widths
- Don't ignore orientation changes
- Don't make touch targets too small
- Don't assume screen size = capabilities
- Don't forget about tablets
- Don't use hover-only interactions

---

## 🔮 Future Enhancements

### Planned Improvements
- Foldable device support
- Enhanced tablet layouts
- Desktop-optimized views
- Adaptive loading strategies
- Dynamic viewport units
- Container queries adoption
- Responsive typography with clamp()

### Advanced Responsive Patterns
```scss
// Future: Container Queries
@container (min-width: 768px) {
  .card {
    // Respond to container, not viewport
  }
}

// Future: Fluid Typography
.heading {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```
