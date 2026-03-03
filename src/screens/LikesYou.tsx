import { useNavigate } from 'react-router-dom'
import { useApp } from '../AppContext.tsx'
import { generateAvatar } from '../utils/placeholder.ts'

export default function LikesYou() {
  const { profiles } = useApp()
  const navigate = useNavigate()

  return (
    <div className="p-1">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {profiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => navigate(`/profile/${profile.id}`)}
            className="relative aspect-square overflow-hidden rounded-lg bg-card-bg"
          >
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.src = generateAvatar(profile.name) }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {profile.type === 'tourDates' ? '🎟️' : '🎵'}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-sm font-semibold leading-tight truncate">{profile.name}</p>
              {profile.type === 'person' && (
                <p className="text-xs text-white/60">{profile.age}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
