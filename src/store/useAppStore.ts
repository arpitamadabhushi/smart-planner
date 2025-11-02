import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
}

export interface Course {
  id: string
  name: string
  color: string
  credits: number
  professor?: string
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  description?: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  estimatedHours: number
  completed: boolean
}

export interface StudySession {
  id: string
  assignmentId: string
  date: Date
  startTime: string
  endTime: string
  completed: boolean
}

interface AppState {
  user: User | null
  courses: Course[]
  assignments: Assignment[]
  studySessions: StudySession[]
  isAuthenticated: boolean
  
  // Actions
  login: (user: User) => void
  logout: () => void
  addCourse: (course: Omit<Course, 'id'>) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourse: (id: string) => void
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void
  updateAssignment: (id: string, updates: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void
  addStudySession: (session: Omit<StudySession, 'id'>) => void
  updateStudySession: (id: string, updates: Partial<StudySession>) => void
  generateSchedule: () => StudySession[]
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      courses: [],
      assignments: [],
      studySessions: [],
      isAuthenticated: false,

      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        courses: [],
        assignments: [],
        studySessions: []
      }),

      addCourse: (course) => set((state) => ({
        courses: [...state.courses, { ...course, id: crypto.randomUUID() }]
      })),

      updateCourse: (id, updates) => set((state) => ({
        courses: state.courses.map(course => 
          course.id === id ? { ...course, ...updates } : course
        )
      })),

      deleteCourse: (id) => set((state) => ({
        courses: state.courses.filter(course => course.id !== id),
        assignments: state.assignments.filter(assignment => assignment.courseId !== id)
      })),

      addAssignment: (assignment) => set((state) => ({
        assignments: [...state.assignments, { 
          ...assignment, 
          id: crypto.randomUUID(),
          dueDate: new Date(assignment.dueDate)
        }]
      })),

      updateAssignment: (id, updates) => set((state) => ({
        assignments: state.assignments.map(assignment => 
          assignment.id === id ? { 
            ...assignment, 
            ...updates,
            ...(updates.dueDate && { dueDate: new Date(updates.dueDate) })
          } : assignment
        )
      })),

      deleteAssignment: (id) => set((state) => ({
        assignments: state.assignments.filter(assignment => assignment.id !== id),
        studySessions: state.studySessions.filter(session => session.assignmentId !== id)
      })),

      addStudySession: (session) => set((state) => ({
        studySessions: [...state.studySessions, {
          ...session,
          id: crypto.randomUUID(),
          date: new Date(session.date)
        }]
      })),

      updateStudySession: (id, updates) => set((state) => ({
        studySessions: state.studySessions.map(session =>
          session.id === id ? {
            ...session,
            ...updates,
            ...(updates.date && { date: new Date(updates.date) })
          } : session
        )
      })),

      generateSchedule: () => {
        const { assignments } = get()
        const incompleteTasks = assignments.filter(a => !a.completed)
        
        // Simple scheduling algorithm - prioritize by due date and priority
        const sessions: StudySession[] = []
        const now = new Date()
        
        incompleteTasks
          .sort((a, b) => {
            const priorityWeight = { high: 3, medium: 2, low: 1 }
            const aPriority = priorityWeight[a.priority]
            const bPriority = priorityWeight[b.priority]
            
            if (aPriority !== bPriority) return bPriority - aPriority
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          })
          .forEach((assignment, index) => {
            const sessionsNeeded = Math.ceil(assignment.estimatedHours / 2) // 2-hour sessions
            
            for (let i = 0; i < sessionsNeeded; i++) {
              const sessionDate = new Date(now)
              sessionDate.setDate(now.getDate() + index + i)
              
              sessions.push({
                id: crypto.randomUUID(),
                assignmentId: assignment.id,
                date: sessionDate,
                startTime: '14:00', // 2 PM default
                endTime: '16:00', // 4 PM default
                completed: false
              })
            }
          })
        
        return sessions
      }
    }),
    {
      name: 'study-planner-storage',
    }
  )
)
