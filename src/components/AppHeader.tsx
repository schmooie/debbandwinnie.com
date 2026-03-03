import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../AppContext.tsx'

function LogoHeader() {
  return (
    <header className="flex items-center justify-center h-14 px-4 border-b border-white/10 bg-brand-dark/95 backdrop-blur shrink-0">
      <span
        className="font-extrabold text-2xl bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text"
        style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        Unhinged
      </span>
    </header>
  )
}

function BackHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  return (
    <header className="flex items-center h-14 px-4 border-b border-white/10 bg-brand-dark/95 backdrop-blur shrink-0 gap-3">
      <button
        onClick={() => navigate(-1)}
        className="text-brand-pink p-1 -ml-1"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <span className="font-semibold text-base truncate">{title}</span>
    </header>
  )
}

function ProfileDetailHeader() {
  const { id } = useParams()
  const { profiles } = useApp()
  const profile = profiles.find(p => p.id === id)
  return <BackHeader title={profile?.name ?? 'Profile'} />
}

function ChatDetailHeader() {
  const { id } = useParams()
  const { messages } = useApp()
  const convo = messages.find(m => m.id === id)
  return <BackHeader title={convo?.name ?? 'Chat'} />
}

export default function AppHeader() {
  const location = useLocation()
  const path = location.pathname

  if (path.startsWith('/profile/')) return <ProfileDetailHeader />
  if (path.startsWith('/chat/')) return <ChatDetailHeader />
  return <LogoHeader />
}
