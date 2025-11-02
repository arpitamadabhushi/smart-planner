# StudyPlanner - Smart Academic Planner 📚

A modern web-based study planner that helps students organize courses, track deadlines, and generate optimized study schedules using AI-powered algorithms.

## 🚀 Features

### ✅ Core Features (Implemented)
- **User Authentication** - Secure login/register system
- **Course Management** - Add, edit, and organize courses with color coding
- **Assignment Tracking** - Create assignments with priorities and deadlines
- **Smart Scheduling** - AI-powered study schedule generation
- **Interactive Calendar** - Visual calendar with drag-and-drop functionality
- **Progress Dashboard** - Comprehensive analytics and progress tracking
- **Responsive Design** - Mobile-first design that works on all devices

### 🔄 Advanced Features (Planned)
- **Google Calendar Integration** - Sync with existing calendar
- **Smart Notifications** - Push notifications for deadlines and sessions
- **AI Schedule Optimization** - Machine learning for personalized scheduling
- **Collaborative Study Groups** - Share schedules with classmates
- **Performance Analytics** - Advanced study pattern analysis

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query
- **Calendar**: React Calendar
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout
│   ├── ProtectedRoute.tsx
│   ├── CourseForm.tsx
│   └── AssignmentForm.tsx
├── pages/              # Route-based page components
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   ├── CoursesPage.tsx
│   ├── SchedulePage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── store/              # Zustand state management
│   └── useAppStore.ts
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🎯 Usage Guide

### Getting Started
1. **Create Account**: Register with your email and name
2. **Add Courses**: Create your course list with custom colors
3. **Add Assignments**: Input assignments with deadlines and priorities
4. **Generate Schedule**: Use AI to create an optimized study plan
5. **Track Progress**: Monitor your academic progress on the dashboard

### Key Workflows

#### Course Management
- Add courses with custom colors and professor information
- Edit course details anytime
- Delete courses (removes all associated assignments)

#### Assignment Tracking
- Create assignments with titles, descriptions, and due dates
- Set priority levels (Low, Medium, High)
- Estimate study hours for better scheduling
- Mark assignments as completed

#### Schedule Generation
- Automatically generates study sessions based on deadlines and priorities
- Considers assignment difficulty and time requirements
- Creates balanced daily schedules
- Allows manual adjustments and customization

#### Progress Monitoring
- View completion rates and upcoming deadlines
- Track daily and weekly study goals
- Analyze study patterns and productivity
- Get insights for better time management

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type Checking
npm run type-check   # Check TypeScript types
```

### Environment Setup

The application uses local storage for data persistence in development. For production deployment, integrate with a backend API for:

- User authentication and authorization
- Data persistence and synchronization
- Real-time notifications
- Calendar API integration

### Key Development Notes

- **State Management**: All application state is managed through Zustand store
- **Form Validation**: Uses Zod schemas for type-safe form validation
- **Routing**: React Router handles client-side navigation
- **Styling**: Tailwind utility classes for consistent design
- **Type Safety**: Full TypeScript coverage for better developer experience

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service:
   - **Vercel**: Connect repository for automatic deployments
   - **Netlify**: Drag and drop the dist folder
   - **GitHub Pages**: Use GitHub Actions for automated builds
   - **Firebase Hosting**: Use Firebase CLI

### Environment Variables (Production)
```bash
VITE_API_URL=your-backend-api-url
VITE_GOOGLE_CALENDAR_API_KEY=your-google-api-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write TypeScript for all new code
- Follow React functional component patterns
- Use Tailwind for styling consistency
- Add proper error handling and loading states
- Write meaningful commit messages
- Test components before submitting PRs

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for beautiful icons
- All open-source contributors who made this project possible

## 📞 Support

For support, email support@studyplanner.com or open an issue on GitHub.

---

**Built with ❤️ for students everywhere**
