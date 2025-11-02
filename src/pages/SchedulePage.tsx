import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import Calendar from 'react-calendar'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  RefreshCw,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import 'react-calendar/dist/Calendar.css'

export function SchedulePage() {
  const { 
    assignments, 
    studySessions, 
    courses, 
    generateSchedule, 
    addStudySession,
    updateStudySession 
  } = useAppStore()
  
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  const handleGenerateSchedule = () => {
    const newSessions = generateSchedule()
    // In a real app, you'd replace existing sessions or merge them
    newSessions.forEach(session => {
      addStudySession(session)
    })
  }

  const getSessionsForDate = (date: Date) => {
    return studySessions.filter(session => 
      isSameDay(new Date(session.date), date)
    )
  }

  const selectedDateSessions = getSessionsForDate(selectedDate)

  const tileContent = ({ date }: { date: Date }) => {
    const sessions = getSessionsForDate(date)
    if (sessions.length > 0) {
      return (
        <div className="flex justify-center">
          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
        </div>
      )
    }
    return null
  }

  const upcomingDeadlines = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Study Schedule</h1>
          <p className="text-gray-600 mt-1">Plan and track your study sessions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
          </button>
          <button
            onClick={handleGenerateSchedule}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Schedule
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar/List View */}
        <div className="lg:col-span-2">
          {viewMode === 'calendar' ? (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Calendar View</h2>
              <Calendar
                value={selectedDate}
                onChange={(date) => setSelectedDate(date as Date)}
                tileContent={tileContent}
                className="w-full"
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">All Study Sessions</h2>
              </div>
              <div className="p-6">
                {studySessions.length > 0 ? (
                  <div className="space-y-4">
                    {studySessions
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map(session => {
                        const assignment = assignments.find(a => a.id === session.assignmentId)
                        const course = courses.find(c => c.id === assignment?.courseId)
                        
                        return (
                          <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: course?.color || '#3b82f6' }}
                              />
                              <div>
                                <p className="font-medium text-gray-900">{assignment?.title}</p>
                                <p className="text-sm text-gray-600">{course?.name}</p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(session.date), 'MMM d, yyyy')} • {session.startTime} - {session.endTime}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => updateStudySession(session.id, { completed: !session.completed })}
                              className={`px-3 py-1 rounded text-sm ${
                                session.completed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {session.completed ? 'Completed' : 'Pending'}
                            </button>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No study sessions scheduled yet.</p>
                    <button
                      onClick={handleGenerateSchedule}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Your First Schedule
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Sessions */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
              </div>
              <div className="p-4">
                {selectedDateSessions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateSessions.map(session => {
                      const assignment = assignments.find(a => a.id === session.assignmentId)
                      const course = courses.find(c => c.id === assignment?.courseId)
                      
                      return (
                        <div key={session.id} className="flex items-start space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full mt-1.5"
                            style={{ backgroundColor: course?.color || '#3b82f6' }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {assignment?.title}
                            </p>
                            <p className="text-xs text-gray-600">{course?.name}</p>
                            <p className="text-xs text-gray-500">
                              {session.startTime} - {session.endTime}
                            </p>
                          </div>
                          <button
                            onClick={() => updateStudySession(session.id, { completed: !session.completed })}
                            className={`w-4 h-4 rounded-full border-2 ${
                              session.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300'
                            }`}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No sessions scheduled for this date
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
            </div>
            <div className="p-4">
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDeadlines.map(assignment => {
                    const course = courses.find(c => c.id === assignment.courseId)
                    const daysLeft = Math.ceil(
                      (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    )
                    
                    return (
                      <div key={assignment.id} className="flex items-start space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5"
                          style={{ backgroundColor: course?.color || '#3b82f6' }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {assignment.title}
                          </p>
                          <p className="text-xs text-gray-600">{course?.name}</p>
                          <p className={`text-xs ${
                            daysLeft <= 1 ? 'text-red-600' : 
                            daysLeft <= 3 ? 'text-orange-600' : 
                            'text-gray-500'
                          }`}>
                            {daysLeft <= 0 ? 'Overdue' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming deadlines
                </p>
              )}
            </div>
          </div>

          {/* Study Progress */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
            </div>
            <div className="p-4">
              {(() => {
                const todaySessions = getSessionsForDate(new Date())
                const completedToday = todaySessions.filter(s => s.completed).length
                const totalToday = todaySessions.length
                const progress = totalToday > 0 ? (completedToday / totalToday) * 100 : 0
                
                return (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Sessions completed</span>
                      <span>{completedToday}/{totalToday}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      {totalToday === 0 ? 'No sessions today' : `${Math.round(progress)}% complete`}
                    </p>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
