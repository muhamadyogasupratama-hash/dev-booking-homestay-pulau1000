import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute'
import { loadCurrentUser } from './features/auth/authSlice'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { BookingsPage, ProfilePage } from './pages/AccountPages'
import { BookingPage, HomestayDetailPage, HomestayFormPage, HomestayListPage } from './pages/HomestayPages'

export default function App() {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  useEffect(() => { if (token && !user) dispatch(loadCurrentUser()) }, [dispatch, token, user])

  return <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/users/register" element={<RegisterPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/homestays" element={<ProtectedRoute><HomestayListPage /></ProtectedRoute>} />
    <Route path="/homestays/:id" element={<ProtectedRoute><HomestayDetailPage /></ProtectedRoute>} />
    <Route path="/homestays/:id/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
    <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute admin><HomestayListPage admin /></ProtectedRoute>} />
    <Route path="/admin/homestays/add" element={<ProtectedRoute admin><HomestayFormPage /></ProtectedRoute>} />
    <Route path="/admin/homestays/:id/edit" element={<ProtectedRoute admin><HomestayFormPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
