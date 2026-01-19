import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuthStore } from '../store/authStore'
import { FileText, Plus, Trash2, Calendar } from 'lucide-react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'

const SlideList = () => {
  const { user } = useAuthStore()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['slides'],
    queryFn: async () => {
      const response = await api.get('/slides')
      return response.data.data
    }
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa slide này?')) return

    try {
      await api.delete(`/slides/${id}`)
      toast.success('Slide deleted successfully')
      refetch()
    } catch (error) {
      toast.error('Failed to delete slide')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slides</h1>
          <p className="text-gray-600 mt-2">
            Quản lý tài liệu bài giảng
          </p>
        </div>

        {user?.role === 'teacher' && (
          <Link
            to="/slides/generate"
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tạo Slide mới
          </Link>
        )}
      </div>

      {!data || data.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có slide nào
          </h3>
          <p className="text-gray-600 mb-6">
            {user?.role === 'teacher' 
              ? 'Bắt đầu tạo slide đầu tiên với AI'
              : 'Chưa có tài liệu nào được tạo'}
          </p>
          {user?.role === 'teacher' && (
            <Link to="/slides/generate" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Tạo Slide
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((slide) => (
            <div key={slide._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                {user?._id === slide.createdBy._id && (
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {slide.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">Chủ đề:</span> {slide.topic}
                </p>
                <p>
                  <span className="font-medium">Số slide:</span> {slide.slides.length}
                </p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(slide.createdAt), 'dd/MM/yyyy')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-gray-500">
                  {slide.createdBy.name}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {slide.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SlideList
