import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SlideGenerator from './pages/SlideGenerator'
import SlideList from './pages/SlideList'
import QuizGenerator from './pages/QuizGenerator'
import { QuizCreate, QuizList, QuizTake, QuizReview } from './pages/QuizCreate'
import { LivestreamList, LivestreamRoom } from './pages/LivestreamList'
import Layout from './components/Layout'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuthStore()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Slide Routes - Teacher only */}
        <Route path="slides">
          <Route index element={<SlideList />} />
          <Route path="generate" element={
            <ProtectedRoute requiredRole="teacher">
              <SlideGenerator />
            </ProtectedRoute>
          } />
        </Route>

        {/* Quiz Routes */}
        <Route path="quiz">
          <Route index element={<QuizList />} />
          <Route path="generate" element={
            <ProtectedRoute requiredRole="teacher">
              <QuizGenerator />
            </ProtectedRoute>
          } />
          <Route path="create" element={
            <ProtectedRoute requiredRole="teacher">
              <QuizCreate />
            </ProtectedRoute>
          } />
          <Route path="take/:id" element={<QuizTake />} />
          <Route path="review/:resultId" element={<QuizReview />} />
        </Route>

        {/* Livestream Routes */}
        <Route path="live">
          <Route index element={<LivestreamList />} />
          <Route path=":id" element={<LivestreamRoom />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
