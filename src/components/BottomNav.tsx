import { NavLink } from 'react-router-dom'

function FlameIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c0 0-5 5.5-5 10a5 5 0 0010 0C17 7.5 12 2 12 2zm0 15a3 3 0 01-3-3c0-2.5 3-6.5 3-6.5s3 4 3 6.5a3 3 0 01-3 3z"/>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 py-2 px-4 text-xs transition-colors ${isActive ? 'text-brand-pink' : 'text-white/40'}`

export default function BottomNav() {
  return (
    <nav className="bottom-nav bg-brand-dark/95 backdrop-blur border-t border-white/10 flex justify-around">
      <NavLink to="/" end className={navClass}>
        <FlameIcon />
        <span>For You</span>
      </NavLink>
      <NavLink to="/likes-you" className={navClass}>
        <HeartIcon />
        <span>Likes You</span>
      </NavLink>
      <NavLink to="/chat" className={navClass}>
        <ChatIcon />
        <span>Chat</span>
      </NavLink>
    </nav>
  )
}
