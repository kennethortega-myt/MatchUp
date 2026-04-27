import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WomanDashboard from './pages/woman/WomanDashboard'
import ProfileSetupPage from './pages/woman/ProfileSetupPage'
import PhotoUploadPage from './pages/woman/PhotoUploadPage'
import MatchRequestsPage from './pages/woman/MatchRequestsPage'
import PublicPreviewPage from './pages/woman/PublicPreviewPage'
import GiftsPage from './pages/woman/GiftsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManDashboard from './pages/man/ManDashboard'
import SubscribePage from './pages/man/SubscribePage'
import BrowsePage from './pages/man/BrowsePage'
import MatchedProfilesPage from './pages/man/MatchedProfilesPage'
import ManGiftsPage from './pages/man/ManGiftsPage'
import ManProfilePage from './pages/man/ManProfilePage'
import ManPhotosPage from './pages/man/ManPhotosPage'
import ManSentRequestsPage from './pages/man/ManSentRequestsPage'
import Navbar from './components/Navbar'
import ManGate from './components/ManGate'
import VerifyEmailSentPage from './pages/VerifyEmailSentPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function ProtectedRoute({ children, role }: { children: JSX.Element; role?: 'man' | 'woman' }) {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { token, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-4xl animate-pulse">💘</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={token ? <Navigate to={user?.role === 'woman' ? '/woman/profile' : '/man/profile'} /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to={user?.role === 'woman' ? '/woman/profile' : '/man/profile'} /> : <RegisterPage />}
        />

        {/* Woman routes */}
        <Route
          path="/woman"
          element={<ProtectedRoute role="woman"><Navigate to="/woman/profile" replace /></ProtectedRoute>}
        />
        <Route
          path="/woman/profile"
          element={<ProtectedRoute role="woman"><ProfileSetupPage /></ProtectedRoute>}
        />
        <Route
          path="/woman/photos"
          element={<ProtectedRoute role="woman"><Navigate to="/woman/profile" replace /></ProtectedRoute>}
        />
        <Route
          path="/woman/requests"
          element={<ProtectedRoute role="woman"><MatchRequestsPage /></ProtectedRoute>}
        />
        <Route
          path="/woman/preview"
          element={<ProtectedRoute role="woman"><PublicPreviewPage /></ProtectedRoute>}
        />
        <Route
          path="/woman/gifts"
          element={<ProtectedRoute role="woman"><GiftsPage /></ProtectedRoute>}
        />

        {/* Email verification & password reset */}
        <Route path="/verify-email-sent" element={<VerifyEmailSentPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Man routes */}
        <Route
          path="/man"
          element={<ProtectedRoute role="man"><Navigate to="/man/profile" replace /></ProtectedRoute>}
        />
        <Route
          path="/man/subscribe"
          element={<ProtectedRoute role="man"><SubscribePage /></ProtectedRoute>}
        />
        <Route
          path="/man/browse"
          element={<ProtectedRoute role="man"><ManGate><BrowsePage /></ManGate></ProtectedRoute>}
        />
        <Route
          path="/man/matches"
          element={<ProtectedRoute role="man"><Navigate to="/man/requests" replace /></ProtectedRoute>}
        />
        <Route
          path="/man/gifts"
          element={<ProtectedRoute role="man"><ManGate><ManGiftsPage /></ManGate></ProtectedRoute>}
        />
        <Route
          path="/man/profile"
          element={<ProtectedRoute role="man"><ManProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/man/photos"
          element={<ProtectedRoute role="man"><ManPhotosPage /></ProtectedRoute>}
        />
        <Route
          path="/man/requests"
          element={<ProtectedRoute role="man"><ManGate><ManSentRequestsPage /></ManGate></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
