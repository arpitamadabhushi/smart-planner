import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  color: z.string().min(1, 'Please select a color'),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
  professor: z.string().optional(),
})

type CourseForm = z.infer<typeof courseSchema>

interface CourseFormProps {
  courseId?: string
  onClose: () => void
}

const colorOptions = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6', '#a855f7'
]

export function CourseForm({ courseId, onClose }: CourseFormProps) {
  const { courses, addCourse, updateCourse } = useAppStore()
  const isEditing = !!courseId
  
  const existingCourse = isEditing ? courses.find(c => c.id === courseId) : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      color: colorOptions[0],
      credits: 3,
      professor: '',
    }
  })

  const watchedColor = watch('color')

  useEffect(() => {
    if (existingCourse) {
      reset({
        name: existingCourse.name,
        color: existingCourse.color,
        credits: existingCourse.credits,
        professor: existingCourse.professor || '',
      })
    }
  }, [existingCourse, reset])

  const onSubmit = async (data: CourseForm) => {
    try {
      if (isEditing && courseId) {
        updateCourse(courseId, data)
      } else {
        addCourse(data)
      }
      onClose()
    } catch (error) {
      console.error('Error saving course:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Course Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Introduction to Computer Science"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Professor */}
          <div>
            <label htmlFor="professor" className="block text-sm font-medium text-gray-700 mb-2">
              Professor (Optional)
            </label>
            <input
              {...register('professor')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Professor name"
            />
          </div>

          {/* Credits */}
          <div>
            <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
              Credits
            </label>
            <input
              {...register('credits', { valueAsNumber: true })}
              type="number"
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.credits && (
              <p className="mt-1 text-sm text-red-600">{errors.credits.message}</p>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Course Color
            </label>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    watchedColor === color 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>

          {/* Course Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: watchedColor }}
              />
              <div>
                <p className="font-medium text-gray-900">
                  {watch('name') || 'Course Name'}
                </p>
                {watch('professor') && (
                  <p className="text-sm text-gray-600">{watch('professor')}</p>
                )}
                <p className="text-xs text-gray-500">
                  {watch('credits')} credit{watch('credits') !== 1 ? 's' : ''}
                </p>
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
