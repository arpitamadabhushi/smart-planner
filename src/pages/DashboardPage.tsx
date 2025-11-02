import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { format, isToday, isTomorrow, addDays } from 'date-fns'

export function DashboardPage() {
  const { user, courses, assignments, studySessions } = useAppStore()

  const stats = useMemo(() => {
    const totalAssignments = assignments.length
    const completedAssignments = assignments.filter(a => a.completed).length
    const upcomingDeadlines = assignments.filter(a => 
      !a.completed && new Date(a.dueDate) <= addDays(new Date(), 7)
    ).length
    const todaySessions = studySessions.filter(s => 
      isToday(new Date(s.date))
    ).length

    return {
      totalCourses: courses.length,
      totalAssignments,
      completedAssignments,
      completionRate: totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0,
      upcomingDeadlines,
      todaySessions
    }
  }, [courses, assignments, studySessions])

  const upcomingTasks = useMemo(() => {
    return assignments
      .filter(a => !a.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
  }, [assignments])

  const todaySessions = useMemo(() => {
    return studySessions
      .filter(s => isToday(new Date(s.date)))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [studySessions])

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 📚
        </h1>
        <p className="text-primary-100">
          You have {stats.upcomingDeadlines} upcoming deadlines and {stats.todaySessions} study sessions today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-gray-600">Active Courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              <p className="text-gray-600">Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</p>
              <p className="text-gray-600">Due This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.todaySessions}</p>
              <p className="text-gray-600">Today's Sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
              <Link
                to="/courses"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {upcomingTasks.map(task => {
                  const course = courses.find(c => c.id === task.courseId)
                  const dueDate = new Date(task.dueDate)
                  const isOverdue = dueDate < new Date()
                  
                  return (
                    <div key={task.id} className="flex items-start space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full mt-2"
                        style={{ backgroundColor: course?.color || '#3b82f6' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">{course?.name}</p>
                        <p className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                          Due: {isToday(dueDate) ? 'Today' : 
                                isTomorrow(dueDate) ? 'Tomorrow' : 
                                format(dueDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">All caught up! No upcoming assignments.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center mt-2 text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add new assignment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Today's Study Sessions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <Link
                to="/schedule"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View calendar
              </Link>
            </div>
          </div>
          <div className="p-6">
            {todaySessions.length > 0 ? (
              <div className="space-y-4">
                {todaySessions.map(session => {
                  const assignment = assignments.find(a => a.id === session.assignmentId)
                  const course = courses.find(c => c.id === assignment?.courseId)
                  
                  return (
                    <div key={session.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {assignment?.title || 'Study Session'}
                        </p>
                        <p className="text-sm text-gray-600">{course?.name}</p>
                        <p className="text-xs text-gray-500">
                          {session.startTime} - {session.endTime}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        session.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No study sessions scheduled for today.</p>
                <Link
                  to="/schedule"
                  className="inline-flex items-center mt-2 text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create study schedule
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {courses.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Get Started</h3>
          <p className="text-blue-700 mb-4">
            Add your first course to start organizing your study schedule.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Add Your First Course
          </Link>
        </div>
      )}
    </div>
  )
}
