import { useEffect, useRef } from 'react'
import { Profile } from '../types.ts'
import { attachSwipeGesture } from './SwipeGesture.ts'
import { generateAvatar } from '../utils/placeholder.ts'
import InterestTag from './InterestTag.tsx'

interface ProfileCardProps {
  profile: Profile
  index: number
  onSwipe: (direction: 'left' | 'right') => void
  onInfoClick: () => void
  behindRefs?: React.RefObject<HTMLDivElement | null>[]
  divRef?: React.RefObject<HTMLDivElement | null>
}

const scaleClasses = ['scale-100', 'scale-[0.96]', 'scale-[0.92]']
const zClasses = ['z-30', 'z-20', 'z-10']
const yClasses = ['translate-y-0', 'translate-y-3', 'translate-y-6']

export default function ProfileCard({ profile, index, onSwipe, onInfoClick, behindRefs, divRef }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (index !== 0 || !cardRef.current) return
    const behind = behindRefs?.map(r => r.current).filter((el): el is HTMLDivElement => el !== null)
    const cleanup = attachSwipeGesture(cardRef.current, {
      onSwipe,
      behindCards: behind,
    })
    return cleanup
  }, [index, onSwipe, behindRefs])

  const imageSrc = profile.type === 'person'
    ? profile.image
    : null

  function setRefs(el: HTMLDivElement | null) {
    ;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    if (divRef) (divRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }

  return (
    <div
      ref={setRefs}
      className={`absolute inset-0 rounded-2xl overflow-hidden bg-card-bg shadow-2xl ${zClasses[index] ?? 'z-10'} ${scaleClasses[index] ?? 'scale-90'} ${yClasses[index] ?? 'translate-y-8'} ${index === 0 ? 'cursor-grab' : ''}`}
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* NOPE overlay */}
      <div className="swipe-nope-overlay absolute inset-0 z-40 flex items-start justify-end p-6 pointer-events-none">
        <span className="border-4 border-red-400 text-red-400 text-3xl font-black rounded-lg px-3 py-1 rotate-12">
          NOPE
        </span>
      </div>

      {/* LIKE overlay */}
      <div className="swipe-like-overlay absolute inset-0 z-40 flex items-start justify-start p-6 pointer-events-none">
        <span className="border-4 border-green-400 text-green-400 text-3xl font-black rounded-lg px-3 py-1 -rotate-12">
          LIKE
        </span>
      </div>

      {/* Card content */}
      {profile.type === 'tourDates' ? (
        <div className="w-full h-full flex flex-col bg-card-bg overflow-hidden">
          {/* Info button */}
          {index === 0 && (
            <button
              onClick={e => { e.stopPropagation(); onInfoClick() }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white z-20"
              aria-label="View all dates"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </button>
          )}

          {/* Header */}
          <div className="bg-gradient-to-br from-brand-purple/60 to-brand-pink/30 px-5 pt-10 pb-5 flex flex-col gap-2">
            <span className="text-5xl">🎟️</span>
            <div>
              <p className="font-bold text-xl leading-tight">{profile.name}</p>
              <p className="text-white/50 text-xs mt-0.5">{profile.role} · {profile.distance}</p>
            </div>
            <p className="text-white/70 text-sm leading-snug line-clamp-2">{profile.bio}</p>
          </div>

          {/* Date list — first 4 */}
          <div className="flex-1 overflow-hidden px-4 py-3 flex flex-col gap-2">
            {profile.dates.slice(0, 4).map((d, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${i === 0 ? 'bg-brand-purple/30 border border-brand-purple/50' : 'bg-brand-dark/60'}`}
              >
                <div className="text-center shrink-0 w-10">
                  <p className="text-brand-pink font-bold text-xs uppercase leading-none">
                    {d.date.split(' ')[0]}
                  </p>
                  <p className="font-bold text-lg leading-none">{d.date.split(' ')[1]?.replace(',', '')}</p>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{d.venue}</p>
                  <p className="text-white/50 text-xs truncate">{d.city}</p>
                </div>
                {i === 0 && <span className="text-brand-pink text-xs font-semibold shrink-0 ml-auto">Next</span>}
              </div>
            ))}
            {profile.dates.length > 4 && (
              <p className="text-white/30 text-xs text-center pt-1">+{profile.dates.length - 4} more shows</p>
            )}
          </div>
        </div>
      ) : profile.type === 'single' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-card-bg p-6 gap-4">
          {/* Info button — top-right for singles */}
          {index === 0 && (
            <button
              onClick={e => { e.stopPropagation(); onInfoClick() }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white z-20"
              aria-label="View profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </button>
          )}
          <div className="w-20 h-20 rounded-full bg-brand-purple/30 flex items-center justify-center text-4xl">
            🎵
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{profile.name}</p>
            <p className="text-white/50 text-sm mt-1">{profile.role}</p>
            <p className="text-white/40 text-xs mt-0.5">{profile.distance}</p>
          </div>
          <p className="text-white/60 text-sm text-center leading-snug">{profile.bio}</p>
          <div className="w-full">
            {profile.embedHtml.startsWith('REPLACE') ? (
              <div className="bg-brand-dark rounded-xl p-3 text-center text-white/40 text-sm border border-white/10">
                [ Add embed HTML in profiles.json ]
              </div>
            ) : (() => {
              const src = profile.embedHtml.match(/src="([^"]+)"/)?.[1]
              return src ? (
                <iframe
                  src={src}
                  width="100%"
                  height="80"
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: 12 }}
                />
              ) : null
            })()}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {profile.interests.map(tag => <InterestTag key={tag} label={tag} />)}
          </div>
        </div>
      ) : (
        <>
          <img
            src={imageSrc!}
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = generateAvatar(profile.name) }}
            draggable={false}
          />
          {/* Gradient overlay — taller to cover info panel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Info panel at bottom — person only */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-4 z-20">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-bold text-2xl leading-tight">
                  {profile.name}
                  <span className="font-normal text-xl ml-2">{profile.age}</span>
                </h2>
                <p className="text-white/60 text-xs mt-0.5">{profile.role}</p>
                <p className="text-white/50 text-xs">{profile.distance}</p>
              </div>
              {index === 0 && (
                <button
                  onClick={e => { e.stopPropagation(); onInfoClick() }}
                  className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white shrink-0 mt-0.5"
                  aria-label="View profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                </button>
              )}
            </div>
            <p className="text-white/80 text-sm mt-2 leading-snug line-clamp-2">{profile.bio}</p>
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {profile.interests.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-white/15 backdrop-blur text-white text-xs rounded-full px-2.5 py-0.5">
                    {tag}
                  </span>
                ))}
                {profile.interests.length > 3 && (
                  <span className="text-white/40 text-xs self-center">+{profile.interests.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
