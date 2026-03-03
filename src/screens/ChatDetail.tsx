import { useParams } from 'react-router-dom'
import { useApp } from '../AppContext.tsx'
import { generateAvatar } from '../utils/placeholder.ts'

export default function ChatDetail() {
  const { id } = useParams()
  const { messages } = useApp()
  const convo = messages.find(m => m.id === id)

  if (!convo) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        Conversation not found
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {convo.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.from === 'them' && (
              <img
                src={convo.image}
                alt={convo.name}
                className="w-7 h-7 rounded-full object-cover mr-2 self-end shrink-0"
                onError={e => { e.currentTarget.src = generateAvatar(convo.name) }}
              />
            )}
            <div
              className={`px-4 py-2 max-w-[75%] text-sm ${
                msg.from === 'me'
                  ? 'bg-brand-purple rounded-2xl rounded-br-sm'
                  : 'bg-card-bg rounded-2xl rounded-bl-sm'
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs text-white/40 mt-1 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fake input bar */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2 bg-brand-dark shrink-0">
        <div className="flex-1 bg-card-bg rounded-full px-4 py-2.5 text-sm text-white/30 select-none">
          Message {convo.name}…
        </div>
        <button className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center shrink-0" aria-label="Send">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
