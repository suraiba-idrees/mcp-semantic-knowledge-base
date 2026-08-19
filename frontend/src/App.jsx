import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import AccountPage from './pages/AccountPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DocumentsPage from './pages/DocumentsPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import './styles/base.css'
import './styles/landing.css'
import './styles/auth.css'
import './styles/workspace.css'
import './styles/responsive.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
        </Route>

        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
