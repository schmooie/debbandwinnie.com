import { useNavigate } from 'react-router-dom'
import { useApp } from '../AppContext.tsx'
import { generateAvatar } from '../utils/placeholder.ts'

export default function Chat() {
  const { messages } = useApp()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col divide-y divide-white/10">
      {messages.map(convo => (
        <button
          key={convo.id}
          onClick={() => navigate(`/chat/${convo.id}`)}
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 active:bg-white/10 text-left transition-colors"
        >
          <div className="relative shrink-0">
            <img
              src={convo.image}
              alt={convo.name}
              className="w-14 h-14 rounded-full object-cover"
              onError={e => { e.currentTarget.src = generateAvatar(convo.name) }}
            />
            {convo.unread && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-pink rounded-full border-2 border-brand-dark" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className={`font-semibold text-sm truncate ${convo.unread ? 'text-white' : 'text-white/80'}`}>
                {convo.name}
              </span>
              <span className="text-xs text-white/40 shrink-0">{convo.lastTime}</span>
            </div>
            <p className={`text-sm truncate mt-0.5 ${convo.unread ? 'text-white/80' : 'text-white/40'}`}>
              {convo.lastMessage}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
