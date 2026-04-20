import axios from 'axios'
import type { WomanProfile, ManProfile, Photo, Subscription, WomanCard, MatchRequest, PendingRequest, FullProfile, GiftSummary, GiftSentSummary, BalanceOut, WithdrawalAdminOut } from './types'

const api = axios.create({ baseURL: '/api', withCredentials: true })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Silent token refresh on 401
let isRefreshing = false
let failedQueue: { resolve: (t: string) => void; reject: (e: unknown) => void }[] = []

const flushQueue = (err: unknown, token: string | null) => {
  failedQueue.forEach(p => err ? p.reject(err) : p.resolve(token!))
  failedQueue = []
}

api.interceptors.response.use(
  r => r,
  async error => {
    const orig = error.config
    if (error.response?.status === 401 && !orig._retry && orig.url !== '/auth/refresh' && orig.url !== '/auth/login') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          orig.headers.Authorization = `Bearer ${token}`
          return api(orig)
        })
      }
      orig._retry = true
      isRefreshing = true
      try {
        const res = await api.post('/auth/refresh')
        const newToken: string = res.data.access_token
        localStorage.setItem('token', newToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        flushQueue(null, newToken)
        orig.headers.Authorization = `Bearer ${newToken}`
        return api(orig)
      } catch (refreshErr) {
        flushQueue(refreshErr, null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// Auth
export const register = (email: string, password: string, role: string) =>
  api.post('/auth/register', { email, password, role })

export const verifyEmail = (token: string) =>
  api.get(`/auth/verify/${token}`)

export const login = (email: string, password: string) => {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  return api.post('/auth/login', form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}

export const refreshToken      = () => api.post('/auth/refresh')
export const logoutApi         = () => api.post('/auth/logout')
export const forgotPassword    = (email: string) => api.post('/auth/forgot-password', { email })
export const resetPassword     = (token: string, password: string) => api.post('/auth/reset-password', { token, password })
export const googleLogin       = (credential: string, role?: string) => api.post('/auth/google', { credential, role })

export const getMe = () => api.get('/auth/me')

// Woman profile
export const getProfile = () => api.get<WomanProfile>('/women/profile')
export const updateProfile = (data: Partial<WomanProfile>) => api.put<WomanProfile>('/women/profile', data)
export const getMyPhotos = () => api.get<Photo[]>('/women/photos')
export const uploadPhoto = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api.post<Photo>('/women/photos', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const deletePhoto = (photoId: number) => api.delete(`/women/photos/${photoId}`)
export const setPrimaryPhoto = (photoId: number) => api.put<Photo>(`/women/photos/${photoId}/primary`)
export const getProfilePreview = () => api.get<FullProfile>('/women/profile/preview')
export const getCardPreview = () => api.get('/women/profile/card-preview')

// Man profile
export const getManProfile = () => api.get<ManProfile>('/men/profile')
export const updateManProfile = (data: Partial<ManProfile>) => api.put<ManProfile>('/men/profile', data)
export const getManPhotos = () => api.get<Photo[]>('/men/photos')
export const uploadManPhoto = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api.post<Photo>('/men/photos', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export const deleteManPhoto = (photoId: number) => api.delete(`/men/photos/${photoId}`)
export const setManPrimaryPhoto = (photoId: number) => api.put<Photo>(`/men/photos/${photoId}/primary`)
export const getManPublicProfile = (manId: number) => api.get<ManProfile>(`/men/public/${manId}`)
export const getManOwnPublicProfile = (manId: number) => api.get<ManProfile>(`/men/profile/${manId}`)

// Subscriptions
export const getSubscriptionStatus = () => api.get('/subscriptions/status')
export const checkout = (plan: string, cardNumber: string, cardExpiry: string, cardCvv: string) =>
  api.post<Subscription>('/subscriptions/checkout', { plan, card_number: cardNumber, card_expiry: cardExpiry, card_cvv: cardCvv })
export const cancelSubscription = () => api.delete('/subscriptions/cancel')

// Browse
export const browseWomen = (page = 1, country?: string, city?: string) => {
  const params: Record<string, string | number> = { page, size: 12 }
  if (country) params.country = country
  if (city) params.city = city
  return api.get<WomanCard[]>('/browse/women', { params })
}

// Matches
export const sendRequest = (womanUserId: number, message?: string, giftType?: string, giftMessage?: string) =>
  api.post<MatchRequest>(`/matches/request/${womanUserId}`, { message, gift_type: giftType, gift_message: giftMessage })
export const myRequests = () => api.get('/matches/my-requests')
export const getPendingRequests = () => api.get<PendingRequest[]>('/matches/pending')
export const acceptRequest = (requestId: number) => api.put<MatchRequest>(`/matches/${requestId}/accept`)
export const rejectRequest = (requestId: number) => api.put<MatchRequest>(`/matches/${requestId}/reject`)
export const getAcceptedMatches = () => api.get<FullProfile[]>('/matches/accepted')
export const getAcceptedProfile = (womanUserId: number) => api.get<FullProfile>(`/matches/accepted/${womanUserId}`)

// Gifts - woman
export const getReceivedGifts = () => api.get<GiftSummary>('/gifts/received')
export const replyToGift = (requestId: number, giftType: string, giftMessage?: string) =>
  api.post(`/gifts/reply/${requestId}`, { gift_type: giftType, gift_message: giftMessage })

// Man sent requests (enriched)
export const getMySentRequests = () => api.get('/matches/my-requests')

// Send additional gift on accepted request
export const sendGiftOnRequest = (requestId: number, giftType: string, giftMessage?: string) =>
  api.post(`/matches/gift/${requestId}`, { gift_type: giftType, gift_message: giftMessage })

// Conversation history for a request
export const getConversationHistory = (requestId: number) =>
  api.get(`/matches/conversation/${requestId}`)

// Gifts - man
export const getSentGifts = () => api.get<GiftSentSummary>('/gifts/sent')

// Withdrawals - woman
export const getBalance = () => api.get<BalanceOut>('/withdrawals/balance')
export const requestWithdrawal = (amount: number, method: string, account_info: string) =>
  api.post('/withdrawals/request', { amount, method, account_info })

// Admin (uses special header, no JWT)
export const getAdminDashboard = (adminKey: string, adminTotp?: string) =>
  axios.get('/api/admin/dashboard', { headers: { 'X-Admin-Key': adminKey, ...(adminTotp ? { 'X-Admin-Totp': adminTotp } : {}) } })
export const getAdminWithdrawals = (adminKey: string, adminTotp?: string, status = 'pending') =>
  axios.get<WithdrawalAdminOut[]>(`/api/admin/withdrawals?status=${status}`, { headers: { 'X-Admin-Key': adminKey, ...(adminTotp ? { 'X-Admin-Totp': adminTotp } : {}) } })
export const approveWithdrawal = (adminKey: string, adminTotp: string | undefined, id: number, notes?: string) =>
  axios.patch(`/api/admin/withdrawals/${id}/approve`, { notes }, { headers: { 'X-Admin-Key': adminKey, ...(adminTotp ? { 'X-Admin-Totp': adminTotp } : {}) } })
export const rejectWithdrawal = (adminKey: string, adminTotp: string | undefined, id: number, notes?: string) =>
  axios.patch(`/api/admin/withdrawals/${id}/reject`, { notes }, { headers: { 'X-Admin-Key': adminKey, ...(adminTotp ? { 'X-Admin-Totp': adminTotp } : {}) } })
