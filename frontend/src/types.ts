export interface User {
  id: number
  email: string
  role: 'man' | 'woman'
  profile_complete?: boolean
}

export interface AuthState {
  token: string | null
  user: User | null
}

export type LookingFor = 'relationship' | 'casual' | 'commitment' | 'outing' | 'surprise'

export interface WomanProfile {
  id: number
  user_id: number
  first_name: string
  age: number
  bio?: string
  country?: string
  city?: string
  location?: string
  occupation?: string
  phone?: string
  instagram?: string
  telegram?: string
  tiktok?: string
  looking_for?: LookingFor
  is_complete: number
}

export interface ManProfile {
  user_id: number
  first_name: string
  age: number
  bio?: string
  country?: string
  city?: string
  occupation?: string
  photos: Photo[]
}

export interface Photo {
  id: number
  user_id: number
  file_path: string
  photo_url: string
  is_primary: number
  sort_order: number
}

export interface Subscription {
  id: number
  user_id: number
  plan: 'monthly' | 'yearly'
  status: 'active' | 'cancelled' | 'expired'
  started_at: string
  expires_at: string
  mock_payment_ref?: string
}

export interface WomanCard {
  user_id: number
  first_name: string
  age?: number
  country?: string
  city?: string
  looking_for?: LookingFor
  primary_photo_url?: string
  request_status?: 'pending' | 'accepted' | 'rejected' | null
}

export interface MatchRequest {
  id: number
  man_id: number
  woman_id: number
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  created_at: string
  updated_at: string
}

export interface PendingRequest {
  request_id: number
  man_id: number
  man_info?: ManSenderInfo
  message?: string
  gift_type?: string
  gift_message?: string
  reply_gift_type?: string
  reply_gift_message?: string
  created_at: string
  status: string
}

export interface ManSenderInfo {
  man_id: number
  first_name: string
  age?: number
  country?: string
  city?: string
  photo_url?: string
}

export interface FullProfile {
  user_id: number
  first_name: string
  age: number
  bio?: string
  country?: string
  city?: string
  location?: string
  occupation?: string
  phone?: string
  instagram?: string
  telegram?: string
  tiktok?: string
  looking_for?: LookingFor
  photos: Photo[]
}

export interface GiftReceived {
  request_id: number
  from_man_id: number
  man_info?: ManSenderInfo
  gift_type: string
  gift_emoji: string
  gift_label: string
  gift_message?: string
  woman_earning: number
  reply_gift_type?: string
  reply_gift_emoji?: string
  reply_gift_label?: string
  reply_gift_message?: string
  is_transaction: boolean
  request_status: string
  created_at: string
}

export interface GiftSummary {
  total_gifts: number
  total_earning: number
  gifts: GiftReceived[]
}

export interface GiftSent {
  request_id: number
  to_woman_id: number
  woman_name: string
  woman_photo?: string
  gift_type: string
  gift_emoji: string
  gift_label: string
  gift_message?: string
  gift_value: number
  reply_received: boolean
  reply_gift_type?: string
  reply_gift_emoji?: string
  reply_gift_label?: string
  reply_gift_message?: string
  is_transaction: boolean
  created_at: string
}

export interface GiftSentSummary {
  total_sent: number
  total_spent: number
  gifts: GiftSent[]
}

export interface ManRequestOut {
  request_id: number
  woman_id: number
  woman_name: string
  woman_photo?: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  gift_type?: string
  gift_emoji?: string
  gift_label?: string
  gift_message?: string
  gift_value?: number
  reply_gift_type?: string
  reply_gift_emoji?: string
  reply_gift_label?: string
  reply_gift_message?: string
  extra_gifts_sent: number
  created_at: string
}

export interface WithdrawalRequest {
  id:           number
  amount:       number
  method:       string
  account_info: string
  status:       'pending' | 'approved' | 'rejected'
  admin_notes?: string
  created_at:   string
}

export interface BalanceOut {
  total_earned:    number
  total_withdrawn: number
  pending_held:    number
  available:       number
  withdrawals:     WithdrawalRequest[]
}

export interface WithdrawalAdminOut {
  id:           number
  woman_id:     number
  woman_email:  string
  woman_name:   string
  amount:       number
  method:       string
  account_info: string
  status:       string
  admin_notes?: string
  created_at:   string
}

export interface ConversationGift {
  id: number
  source: string
  sender_role: 'man' | 'woman'
  gift_type: string
  gift_emoji: string
  gift_label: string
  gift_message?: string
  gift_value?: number
  created_at: string
}
