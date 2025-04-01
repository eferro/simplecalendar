# Simple Calendar View 📅

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
- **Calendar Configuration**: Customizable settings for calendar display

## 🛠 Tech Stack

- **Framework**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Date Utilities**: date-fns
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Data Visualization**: Recharts

## 📁 Project Structure

```
src/
├── components/
│   ├── Calendar/
│   │   ├── Calendar.tsx         # Main calendar component
│   │   ├── CalendarConfig.tsx   # Calendar configuration panel
│   │   ├── CalendarDay.tsx      # Individual day cell
│   │   ├── CalendarGrid.tsx     # Calendar grid layout
│   │   ├── CalendarHeader.tsx   # Calendar header with navigation
│   │   ├── MiniCalendar.tsx     # Previous/Next month previews
│   │   └── PrintCalendar.tsx    # Print-specific view
│   └── ui/                      # Reusable UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries and configurations
├── pages/                       # Page components
├── stores/                      # Zustand state stores
└── utils/                       # Helper functions and utilities
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/simplecalendar.git
cd simplecalendar
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

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
`https://[your-username].github.io/simplecalendar/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for any purpose.

---
Made with ❤️ by eferro
