import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { format } from 'date-fns'

const assignmentSchema = z.object({
  title: z.string().min(1, 'Assignment title is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']),
  estimatedHours: z.number().min(0.5, 'Estimated hours must be at least 0.5').max(100, 'Estimated hours cannot exceed 100'),
})

type AssignmentForm = z.infer<typeof assignmentSchema>

interface AssignmentFormProps {
  courseId: string
  assignmentId?: string
  onClose: () => void
}

export function AssignmentForm({ courseId, assignmentId, onClose }: AssignmentFormProps) {
  const { courses, assignments, addAssignment, updateAssignment } = useAppStore()
  const isEditing = !!assignmentId
  
  const course = courses.find(c => c.id === courseId)
  const existingAssignment = isEditing ? assignments.find(a => a.id === assignmentId) : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: existingAssignment?.title || '',
      description: existingAssignment?.description || '',
      dueDate: existingAssignment ? format(new Date(existingAssignment.dueDate), 'yyyy-MM-dd') : '',
      priority: existingAssignment?.priority || 'medium',
      estimatedHours: existingAssignment?.estimatedHours || 2,
    }
  })

  const watchedPriority = watch('priority')

  const onSubmit = async (data: AssignmentForm) => {
    try {
      const assignmentData = {
        ...data,
        courseId,
        completed: false,
        dueDate: new Date(data.dueDate),
      }

      if (isEditing && assignmentId) {
        updateAssignment(assignmentId, assignmentData)
      } else {
        addAssignment(assignmentData)
      }
      onClose()
    } catch (error) {
      console.error('Error saving assignment:', error)
    }
  }

  if (!course) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Assignment' : 'Add New Assignment'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{course.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Assignment Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Title
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Problem Set 3, Final Essay"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Assignment details, requirements, etc."
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <div className="relative">
              <input
                {...register('dueDate')}
                type="date"
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' },
                { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
              ].map((priority) => (
                <label
                  key={priority.value}
                  className={`
                    flex items-center justify-center px-3 py-2 border-2 rounded-md cursor-pointer transition-all
                    ${watchedPriority === priority.value 
                      ? priority.color 
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  <input
                    {...register('priority')}
                    type="radio"
                    value={priority.value}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{priority.label}</span>
                </label>
              ))}
            </div>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
            )}
          </div>

          {/* Estimated Hours */}
          <div>
            <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Study Hours
            </label>
            <input
              {...register('estimatedHours', { valueAsNumber: true })}
              type="number"
              step="0.5"
              min="0.5"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 4.5"
            />
            {errors.estimatedHours && (
              <p className="mt-1 text-sm text-red-600">{errors.estimatedHours.message}</p>
            )}
          </div>

          {/* Assignment Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="flex items-start space-x-3">
              <div 
                className="w-3 h-3 rounded-full mt-1"
                style={{ backgroundColor: course.color }}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {watch('title') || 'Assignment Title'}
                </p>
                <p className="text-sm text-gray-600">{course.name}</p>
                {watch('description') && (
                  <p className="text-sm text-gray-500 mt-1">{watch('description')}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  {watch('dueDate') && (
                    <span>Due: {format(new Date(watch('dueDate')), 'MMM d, yyyy')}</span>
                  )}
                  <span>{watch('estimatedHours')} hours</span>
                  <span className={`px-2 py-1 rounded ${
                    watchedPriority === 'high' ? 'bg-red-100 text-red-800' :
                    watchedPriority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {watchedPriority} priority
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Assignment' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
