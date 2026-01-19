import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'
import { Sparkles, Loader } from 'lucide-react'

const SlideGenerator = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    topic: '',
    level: 'medium',
    numberSlide: 10,
    language: 'vi'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/slides/generate', {
        ...formData,
        numberSlide: parseInt(formData.numberSlide)
      })

      toast.success('Slides generated successfully!')
      navigate('/slides')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate slides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Tạo Slide với AI
        </h1>
        <p className="text-gray-600 mt-2">
          Nhập thông tin và để AI tạo slide bài giảng cho bạn
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ đề bài giảng *
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="input"
              placeholder="VD: Toán lớp 9, Lịch sử Việt Nam, ..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức độ
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="input"
              >
                <option value="easy">Dễ (Cơ bản)</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó (Nâng cao)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng slide
              </label>
              <input
                type="number"
                name="numberSlide"
                value={formData.numberSlide}
                onChange={handleChange}
                min="5"
                max="30"
                required
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngôn ngữ
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="input"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Tạo Slide
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/slides')}
              className="btn btn-secondary"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="mt-8 card bg-blue-50 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <div>
              <p className="font-medium text-blue-900">
                AI đang tạo slide cho bạn...
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Quá trình này có thể mất 10-30 giây
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SlideGenerator
