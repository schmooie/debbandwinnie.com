import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../AppContext.tsx'
import { generateAvatar } from '../utils/placeholder.ts'
import InterestTag from '../components/InterestTag.tsx'

export default function ProfileDetail() {
  const { id } = useParams()
  const { profiles, swipeCard } = useApp()
  const navigate = useNavigate()
  const profile = profiles.find(p => p.id === id)

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        Profile not found
      </div>
    )
  }

  if (profile.type === 'tourDates') {
    return (
      <div className="flex flex-col pb-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-purple/60 to-brand-pink/30 px-5 pt-10 pb-6 flex flex-col gap-3">
          <span className="text-6xl">🎟️</span>
          <div>
            <h1 className="font-bold text-2xl leading-tight">{profile.name}</h1>
            <p className="text-white/50 text-sm mt-1">{profile.role} · {profile.distance}</p>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>
        </div>

        {/* Full date list */}
        <div className="px-4 pt-5 flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-wider text-white/40">Upcoming Shows</h2>
          {profile.dates.map((d, i) => (
            <div key={i} className={`flex items-center gap-4 rounded-xl px-4 py-3 ${i === 0 ? 'bg-brand-purple/30 border border-brand-purple/50' : 'bg-card-bg'}`}>
              <div className="text-center shrink-0 w-12">
                <p className="text-brand-pink font-bold text-xs uppercase leading-none">
                  {d.date.split(' ')[0]}
                </p>
                <p className="font-bold text-2xl leading-tight">{d.date.split(' ')[1]?.replace(',', '')}</p>
                <p className="text-white/40 text-xs">{d.date.split(' ')[2]}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{d.venue}</p>
                <p className="text-white/50 text-sm truncate">{d.city}</p>
              </div>
              {d.ticketUrl && (
                <a
                  href={d.ticketUrl}
                  onClick={e => e.stopPropagation()}
                  className="shrink-0 bg-brand-pink text-white text-xs font-semibold rounded-full px-3 py-1.5"
                >
                  Tickets
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        {profile.interests.length > 0 && (
          <div className="px-4 pt-5">
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Vibes</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(tag => <InterestTag key={tag} label={tag} />)}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 px-4 pt-6">
          <button
            onClick={() => { swipeCard('left', profile); navigate(-1) }}
            className="border-2 border-red-400 text-red-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-red-400/10 active:scale-95 transition-transform"
            aria-label="Nope"
          >
            ✕
          </button>
          <button
            onClick={() => { swipeCard('right', profile); navigate(-1) }}
            className="border-2 border-green-400 text-green-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-green-400/10 active:scale-95 transition-transform"
            aria-label="Like"
          >
            ♥
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-6">
      {/* Hero */}
      {profile.type === 'person' ? (
        <div className="relative aspect-[3/4] w-full shrink-0">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = generateAvatar(profile.name) }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h1 className="font-bold text-3xl">
              {profile.name}
              <span className="font-normal text-2xl ml-2">{profile.age}</span>
            </h1>
            <p className="text-white/70">{profile.role}</p>
            <p className="text-white/50 text-sm">{profile.distance}</p>
          </div>
        </div>
      ) : (
        <div className="w-full bg-card-bg px-4 py-8 flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-brand-purple/30 flex items-center justify-center text-5xl">
            🎵
          </div>
          <div className="text-center">
            <h1 className="font-bold text-2xl">{profile.name}</h1>
            <p className="text-white/50 text-sm mt-1">{profile.role}</p>
            <p className="text-white/40 text-xs mt-1">{profile.distance}</p>
          </div>
          {profile.embedHtml.startsWith('REPLACE') ? (
            <div className="w-full bg-brand-dark rounded-xl p-6 text-center text-white/30 text-sm border border-white/10">
              [ Add embed HTML in src/data/profiles.json ]
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: profile.embedHtml }}
              className="embed-wrapper w-full"
            />
          )}
        </div>
      )}

      {/* Bio & details */}
      <div className="px-4 pt-5 flex flex-col gap-4">
        <p className="text-white/80 text-sm leading-relaxed">{profile.bio}</p>

        {profile.interests.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-white/40 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(tag => <InterestTag key={tag} label={tag} />)}
            </div>
          </div>
        )}

        {profile.type === 'person' && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>🎸</span>
            <span>{profile.commonInterests} interests in common</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <button
            onClick={() => { swipeCard('left', profile); navigate(-1) }}
            className="border-2 border-red-400 text-red-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-red-400/10 active:scale-95 transition-transform"
            aria-label="Nope"
          >
            ✕
          </button>
          <button
            onClick={() => { swipeCard('right', profile); navigate(-1) }}
            className="border-2 border-green-400 text-green-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-green-400/10 active:scale-95 transition-transform"
            aria-label="Like"
          >
            ♥
          </button>
        </div>
      </div>
    </div>
  )
}
