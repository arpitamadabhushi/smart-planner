<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# StudyPlanner - Project Context

This is a React TypeScript web application built with Vite for student academic planning and management.

## Project Structure
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Data Fetching**: TanStack Query
- **UI Components**: Custom components with Lucide React icons
- **Calendar**: React Calendar component
- **Drag & Drop**: @dnd-kit (planned feature)

## Key Features
1. **User Authentication** - Login/Register with mock authentication
2. **Course Management** - Add, edit, delete courses with color coding
3. **Assignment Tracking** - Create assignments with deadlines and priorities
4. **Schedule Generation** - AI-powered study schedule creation
5. **Calendar Integration** - Interactive calendar view with study sessions
6. **Progress Dashboard** - Visual progress tracking and statistics
7. **Responsive Design** - Mobile-first approach with Tailwind CSS

## Development Guidelines
- Use TypeScript for all new code
- Follow React functional component patterns with hooks
- Implement proper error handling and loading states
- Maintain consistent styling with Tailwind utility classes
- Use Zustand store for global state management
- Validate forms with Zod schemas and React Hook Form
- Keep components small and focused on single responsibility
- Write accessible HTML with proper semantic elements

## API Integration (Future)
Currently uses mock data and local storage. Ready for backend integration:
- Authentication endpoints
- CRUD operations for courses/assignments
- Schedule generation API
- Google Calendar integration
- Push notifications

## Performance Considerations
- Lazy load components where appropriate
- Optimize bundle size with tree shaking
- Use React.memo for expensive renders
- Implement proper loading and error boundaries
