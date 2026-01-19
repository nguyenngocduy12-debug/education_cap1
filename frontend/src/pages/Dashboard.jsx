import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FileText, BookOpen, Video, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuthStore()

  const teacherCards = [
    {
      title: 'Tạo Slide AI',
      description: 'Tạo slide bài giảng tự động với AI',
      icon: FileText,
      link: '/slides/generate',
      color: 'bg-blue-500'
    },
    {
      title: 'Tạo Quiz',
      description: 'Tạo bài kiểm tra cho học viên',
      icon: BookOpen,
      link: '/quiz/create',
      color: 'bg-green-500'
    },
    {
      title: 'Livestream',
      description: 'Bắt đầu phiên dạy trực tuyến',
      icon: Video,
      link: '/live',
      color: 'bg-purple-500'
    }
  ]

  const studentCards = [
    {
      title: 'Xem Slides',
      description: 'Xem tài liệu bài giảng',
      icon: FileText,
      link: '/slides',
      color: 'bg-blue-500'
    },
    {
      title: 'Làm Quiz',
      description: 'Làm bài kiểm tra và ôn tập',
      icon: BookOpen,
      link: '/quiz',
      color: 'bg-green-500'
    },
    {
      title: 'Tham gia Live',
      description: 'Tham gia buổi học trực tuyến',
      icon: Video,
      link: '/live',
      color: 'bg-purple-500'
    }
  ]

  const cards = user?.role === 'teacher' ? teacherCards : studentCards

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Chào mừng, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'teacher' 
            ? 'Quản lý lớp học và tạo nội dung giảng dạy'
            : 'Bắt đầu học tập và rèn luyện kiến thức'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {card.title}
            </h3>
            <p className="text-gray-600">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thống kê</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng Slides</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Bài Quiz</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <BookOpen className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Livestream</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
              </div>
              <Video className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
