import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Clock,
  Calendar,
  Target
} from 'lucide-react'
import { CourseForm } from '../components/CourseForm'
import { AssignmentForm } from '../components/AssignmentForm'

export function CoursesPage() {
  const { courses, assignments, addCourse, deleteCourse, deleteAssignment } = useAppStore()
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [editingCourse, setEditingCourse] = useState<string | null>(null)

  const handleAddAssignment = (courseId: string) => {
    setSelectedCourseId(courseId)
    setShowAssignmentForm(true)
  }

  const getCourseAssignments = (courseId: string) => {
    return assignments.filter(a => a.courseId === courseId)
  }

  const getUpcomingAssignments = (courseId: string) => {
    return assignments.filter(a => 
      a.courseId === courseId && 
      !a.completed && 
      new Date(a.dueDate) >= new Date()
    ).length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Manage your courses and assignments</p>
        </div>
        <button
          onClick={() => setShowCourseForm(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const courseAssignments = getCourseAssignments(course.id)
            const upcomingCount = getUpcomingAssignments(course.id)
            const completedCount = courseAssignments.filter(a => a.completed).length
            
            return (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                {/* Course Header */}
                <div 
                  className="p-4 rounded-t-lg"
                  style={{ backgroundColor: `${course.color}20` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        {course.professor && (
                          <p className="text-sm text-gray-600">{course.professor}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingCourse(course.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this course?')) {
                            deleteCourse(course.id)
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {courseAssignments.length}
                      </div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-orange-600">
                        {upcomingCount}
                      </div>
                      <div className="text-xs text-gray-600">Upcoming</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {completedCount}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                  </div>

                  {/* Recent Assignments */}
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Recent Assignments</h4>
                    {courseAssignments.slice(0, 3).map(assignment => (
                      <div key={assignment.id} className="flex items-center justify-between text-sm">
                        <span className={`flex-1 truncate ${assignment.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {assignment.title}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 text-xs rounded ${
                            assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                            assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {assignment.priority}
                          </span>
                          {!assignment.completed && (
                            <button
                              onClick={() => deleteAssignment(assignment.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {courseAssignments.length === 0 && (
                      <p className="text-sm text-gray-500">No assignments yet</p>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleAddAssignment(course.id)}
                    className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Assignment
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first course to organize your assignments and study schedule.
          </p>
          <button
            onClick={() => setShowCourseForm(true)}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Course
          </button>
        </div>
      )}

      {/* Modals */}
      {showCourseForm && (
        <CourseForm
          courseId={editingCourse || undefined}
          onClose={() => {
            setShowCourseForm(false)
            setEditingCourse(null)
          }}
        />
      )}

      {showAssignmentForm && (
        <AssignmentForm
          courseId={selectedCourseId}
          onClose={() => {
            setShowAssignmentForm(false)
            setSelectedCourseId('')
          }}
        />
      )}
    </div>
  )
}
