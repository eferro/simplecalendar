# Cheerful Calendar View 📅

A modern, quarter-aware calendar application built with React and TypeScript. Features an intuitive interface for tracking dates, weeks, and quarters throughout the year.

## ✨ Features

- **Quarter-Based Visualization**: Color-coded quarters for easy period tracking
- **Week & Day Tracking**: Display of week numbers and day of year
- **Navigation**:
  - Previous/Next month navigation
  - Quick "Today" button
  - Mini calendars for adjacent months
- **Print Support**: Dedicated print view for calendar export
- **Keyboard Navigation**: Arrow keys support for date selection
- **Responsive Design**: Works on both desktop and mobile devices

## 🛠 Tech Stack

- **Framework**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Date Utilities**: date-fns

## 📁 Project Structure

```
src/
├── components/
│   └── Calendar/
│       ├── Calendar.tsx       # Main calendar component
│       ├── CalendarDay.tsx    # Individual day cell
│       ├── CalendarGrid.tsx   # Calendar grid layout
│       ├── MiniCalendar.tsx   # Previous/Next month previews
│       └── PrintCalendar.tsx  # Print-specific view
├── utils/
│   └── calendarUtils.ts      # Date and calendar helpers
└── pages/
    └── Index.tsx             # Main page component
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cheerful-calendar-view.git
cd cheerful-calendar-view
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📦 Deployment

### GitHub Pages

1. Configure your repository:
   - Go to Settings > Pages
   - Set source to "GitHub Actions"

2. Push to main branch:
```bash
git push origin main
```

The calendar will be automatically deployed to:
`https://[your-username].github.io/cheerful-calendar-view/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for any purpose.

---
Made with ❤️ by eferro
