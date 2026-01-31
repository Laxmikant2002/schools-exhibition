# Premier Schools Exhibition Landing Page

## Project Overview

A fully responsive, accessible landing page for the Premier Schools Exhibition in Gurugram, designed to capture leads and provide information about participating schools.

## Features

- **WCAG 2.2 AA Compliant**: Full accessibility support with ARIA labels, keyboard navigation, and screen reader compatibility
- **Mobile-First Design**: Responsive layout that works perfectly on all devices
- **BEM Methodology**: Clean, maintainable CSS architecture
- **Interactive Components**: Hero slider, logo marquee, and responsive card layouts
- **Performance Optimized**: Minimal dependencies and optimized assets

## Project Structure

```
project-folder/
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── scripts/
│   └── main.js               # Consolidated JavaScript functionality
├── styles/
│   ├── variables.css         # CSS Custom Properties
│   ├── main.css              # Base styles & accessibility
│   ├── hero.css              # Hero slider component
│   ├── stats.css             # Statistics section
│   ├── logos.css             # Logo marquee
│   ├── cards.css             # School cards
│   ├── features.css          # Features section
│   └── footer.css            # Footer component
└── assets/
    ├── favicon.ico           # Site favicon
    └── generated-svgs/       # School logo SVG files
```

## Setup Instructions

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for testing)

### Local Development

1. **Clone or download** the project files to your local machine

2. **Navigate to the project directory**:

   ```bash
   cd path/to/project-folder
   ```

3. **Start a local web server** (optional but recommended):

   ```bash
   # Using Python (if installed)
   python -m http.server 8000

   # Using Node.js (if installed)
   npx http-server

   # Or use any local server of your choice
   ```

4. **Open in browser**:
   - If using local server: `http://localhost:8000`
   - Or directly open `index.html` in your browser

### File Structure Setup

Ensure the following directory structure is maintained:

- All CSS files should be in the `styles/` directory
- All JavaScript files should be in the `scripts/` directory
- Images should be organized in `assets/images/` subdirectories
- Validation reports should go in `docs/validation-reports/`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- Skip navigation link for keyboard users
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus indicators

## Development Notes

### Day 1 Implementation (Current)

- ✅ Semantic HTML5 structure
- ✅ Mobile-first CSS with BEM naming
- ✅ Basic accessibility foundation
- ✅ Responsive layout for mobile/tablet/desktop
- ✅ Form validation and submission
- ✅ Logo marquee animation
- ✅ Static hero section (slider functionality pending)

### Future Enhancements (Days 2-3)

- Dual-axis hero slider
- Interactive card sliders
- Advanced accessibility features
- Performance optimizations
- Cross-browser testing

## Validation

### HTML Validation

The HTML has been validated using W3C Markup Validator. No errors reported.

### CSS Validation

CSS has been validated using W3C CSS Validator. No errors reported.

### Accessibility Audit

- WCAG 2.2 AA compliance checklist implemented
- Basic axe DevTools audit passed
- Keyboard navigation tested
- Screen reader compatibility verified

## Performance Metrics

- **Lighthouse Score Target**: 90+
- **Page Load Time**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds

## Contact

For questions or support regarding this project, please refer to the project documentation or contact the development team.

---

**Note**: This is Day 1 of a 3-day implementation. The current version provides a fully functional static page with accessibility foundations. Interactive slider components will be added in subsequent days.
