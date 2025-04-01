# Simple Calendar View 📅

A modern, quarter-aware calendar application built with React and TypeScript. Features an intuitive interface for tracking dates, weeks, and quarters throughout the year.

## ✨ Features

- **Quarter-Based Visualization**: 
  - Color-coded quarters for easy period tracking
  - Visual indicators for quarter transitions
  - Quarter legend with active/inactive states
- **Week & Day Tracking**: 
  - Dynamic week numbers based on selected date
  - Day of year tracking
  - Current day highlighting
- **Smart Navigation**:
  - Previous/Next month navigation with smooth transitions
  - Quick "Today" button with visual feedback
  - Mini calendars for adjacent months with live updates
- **Interactive Features**:
  - Click to select/unselect dates
  - Keyboard navigation (arrow keys)
  - Hover cards with detailed date information
- **Print Support**: 
  - Dedicated print view for calendar export
  - Print-specific styling and layout
- **Responsive Design**: 
  - Optimized for desktop and mobile
  - Adaptive layout for different screen sizes
- **Calendar Configuration**: 
  - Week start day customization
  - Quarter date range configuration
  - UI theme customization

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
- **Testing**: Vitest, React Testing Library, MSW

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
├── test/                        # Test setup and utilities
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
- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI interface

## 🧪 Testing Strategy

The project follows a comprehensive testing approach:

### Component Testing Architecture

- **Atomic Testing**: Each component is tested in isolation
- **Integration Testing**: Component interactions are verified
- **Behavioral Testing**: User interactions and state changes are validated

### Test Categories

1. **Rendering Tests**
   - Basic component rendering
   - Prop variations
   - Responsive behavior

2. **Interaction Tests**
   - Click events
   - Keyboard navigation
   - Touch interactions
   - Selection behavior

3. **State Management Tests**
   - Initial state
   - State transitions
   - Side effects

4. **Visual Tests**
   - Style applications
   - Theme variations
   - Layout consistency

### Current Test Coverage

Components with full test coverage:
- ✅ CalendarHeader (100%)
- ✅ CalendarDay (100%)
- ✅ CalendarGrid (100%)
- ✅ MiniCalendar (100%)
- ✅ Calendar (100%)
- ✅ Toast (100%)

Remaining components to test:
- ⏳ CalendarConfig
- ⏳ PrintCalendar

### View Test Results

1. Run tests with coverage:
```bash
npm run test:coverage
```

2. View coverage report:
   - Coverage report is generated in `coverage/` directory
   - Open `coverage/index.html` in your browser

3. Run tests with UI:
```bash
npm run test:ui
```
   - Visit `http://localhost:51204/__vitest__/` to view the test UI
   - Real-time test execution and results
   - Interactive test filtering and debugging

### Current Test Status

- **Total Tests**: 39 passing tests
- **Test Files**: 6 test suites
- **Coverage**:
  - Components: 100% of implemented components
  - Functions: 95%+ for tested components
  - Branches: 90%+ for tested components
  - Lines: 95%+ for tested components

> Note: Coverage percentages are for fully implemented components. Some components are still under development.

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
