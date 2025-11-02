# Tailwind CSS

This project uses Tailwind CSS in the Ionic/Angular app.

## Configuration

- Config file: `ui/tailwind.config.js`
- PostCSS: `ui/postcss.config.js`
- Global styles: `ui/src/global.scss`

## Usage

Use Tailwind utility classes in templates:

```html
<div class="p-4 bg-primary text-white rounded-md shadow">
  Aptitude Reasoning App
</div>
```

## Customization

- Extend theme in `tailwind.config.js`
- Add custom colors, spacing, and typography
- Purge enabled by default in production via Angular build

## Tips

- Keep utility-first approach; avoid deep custom CSS unless necessary
- Use component-level styles for scoped overrides
