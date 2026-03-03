import { motion, useTransform, animate, type PanInfo, type MotionValue } from 'framer-motion'
import { Profile } from '../types.ts'
import { generateAvatar } from '../utils/placeholder.ts'
import InterestTag from './InterestTag.tsx'
import PersistentEmbed from './PersistentEmbed.tsx'

interface ProfileCardProps {
  profile: Profile
  index: number
  onSwipe: (direction: 'left' | 'right') => void
  onInfoClick: () => void
  dragX: MotionValue<number>
}

const zClasses = ['z-30', 'z-20', 'z-10']

const INFO_BTN = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
)

export default function ProfileCard({ profile, index, onSwipe, onInfoClick, dragX }: ProfileCardProps) {
  const rotate   = useTransform(dragX, [-200, 0, 200], [-20, 0, 20])
  const nopeOpacity = useTransform(dragX, [-100, -20, 0], [1, 0, 0])
  const likeOpacity = useTransform(dragX, [0, 20, 100], [0, 0, 1])

  // Behind-card scale + y driven by top card's drag progress
  const absX    = useTransform(dragX, v => Math.abs(v))
  const progress = useTransform(absX, [0, 150], [0, 1], { clamp: true })
  const cardScale = useTransform(progress, [0, 1], [1 - index * 0.04, 1 - Math.max(0, index - 1) * 0.04])
  const cardY     = useTransform(progress, [0, 1], [index * 12, Math.max(0, index - 1) * 12])

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const SWIPE_PX  = 100  // px offset to commit
    const SWIPE_VEL = 600  // px/s velocity to commit

    if (Math.abs(info.offset.x) > SWIPE_PX || Math.abs(info.velocity.x) > SWIPE_VEL) {
      const direction: 'left' | 'right' =
        Math.abs(info.offset.x) > 50
          ? info.offset.x < 0 ? 'left' : 'right'
          : info.velocity.x < 0 ? 'left' : 'right'

      animate(dragX, direction === 'left' ? -600 : 600, {
        type: 'spring', stiffness: 400, damping: 40,
      }).then(() => onSwipe(direction))
    } else {
      animate(dragX, 0, { type: 'spring', stiffness: 500, damping: 35 })
    }
  }

  return (
    <motion.div
      className={`absolute inset-0 rounded-2xl overflow-hidden bg-card-bg shadow-2xl ${zClasses[index] ?? 'z-10'} ${index === 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{
        x: index === 0 ? dragX : 0,
        rotate: index === 0 ? rotate : 0,
        scale: cardScale,
        y: cardY,
        transformOrigin: 'bottom center',
      }}
      drag={index === 0 ? 'x' : false}
      dragMomentum={false}
      onDragEnd={index === 0 ? handleDragEnd : undefined}
    >
      {/* NOPE / LIKE overlays — top card only */}
      {index === 0 && (
        <>
          <motion.div
            className="absolute inset-0 z-40 flex items-start justify-end p-6 pointer-events-none"
            style={{ opacity: nopeOpacity }}
          >
            <span className="border-4 border-red-400 text-red-400 text-3xl font-black rounded-lg px-3 py-1 rotate-12">NOPE</span>
          </motion.div>
          <motion.div
            className="absolute inset-0 z-40 flex items-start justify-start p-6 pointer-events-none"
            style={{ opacity: likeOpacity }}
          >
            <span className="border-4 border-green-400 text-green-400 text-3xl font-black rounded-lg px-3 py-1 -rotate-12">LIKE</span>
          </motion.div>
        </>
      )}

      {/* ── Card content ─────────────────────────────────────── */}
      {profile.type === 'tourDates' ? (
        <div className="w-full h-full flex flex-col bg-card-bg overflow-hidden">
          {index === 0 && (
            <button
              onClick={e => { e.stopPropagation(); onInfoClick() }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white z-20"
              aria-label="View all dates"
            >{INFO_BTN}</button>
          )}
          <div className="bg-gradient-to-br from-brand-purple/60 to-brand-pink/30 px-5 pt-10 pb-5 flex flex-col gap-2">
            <span className="text-5xl">🎟️</span>
            <div>
              <p className="font-bold text-xl leading-tight">{profile.name}</p>
              <p className="text-white/50 text-xs mt-0.5">{profile.role} · {profile.distance}</p>
            </div>
            <p className="text-white/70 text-sm leading-snug line-clamp-2">{profile.bio}</p>
          </div>
          <div className="flex-1 overflow-hidden px-4 py-3 flex flex-col gap-2">
            {profile.dates.slice(0, 4).map((d, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${i === 0 ? 'bg-brand-purple/30 border border-brand-purple/50' : 'bg-brand-dark/60'}`}>
                <div className="text-center shrink-0 w-10">
                  <p className="text-brand-pink font-bold text-xs uppercase leading-none">{d.date.split(' ')[0]}</p>
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
        <div className="w-full h-full flex flex-col bg-card-bg overflow-hidden">
          {index === 0 && (
            <button
              onClick={e => { e.stopPropagation(); onInfoClick() }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white z-20"
              aria-label="View profile"
            >{INFO_BTN}</button>
          )}
          <div className="bg-gradient-to-br from-brand-purple/60 to-brand-pink/30 px-5 pt-10 pb-5 flex flex-col gap-2">
            <span className="text-5xl">🎵</span>
            <div>
              <p className="font-bold text-xl leading-tight line-clamp-2">{profile.name}</p>
              <p className="text-white/50 text-xs mt-0.5">{profile.role} · {profile.distance}</p>
            </div>
            <p className="text-white/70 text-sm leading-snug line-clamp-2">{profile.bio}</p>
          </div>
          <div className="px-4 pt-4">
            {profile.embedHtml.startsWith('REPLACE') ? (
              <div className="bg-brand-dark rounded-xl p-3 text-center text-white/40 text-sm border border-white/10">
                [ Add embed HTML in profiles.json ]
              </div>
            ) : (
              <PersistentEmbed embedHtml={profile.embedHtml} height={80} />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 px-4 pt-3">
            {profile.interests.slice(0, 4).map(tag => <InterestTag key={tag} label={tag} />)}
          </div>
        </div>

      ) : (
        <>
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = generateAvatar(profile.name) }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
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
                >{INFO_BTN}</button>
              )}
            </div>
            <p className="text-white/80 text-sm mt-2 leading-snug line-clamp-2">{profile.bio}</p>
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {profile.interests.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-white/15 backdrop-blur text-white text-xs rounded-full px-2.5 py-0.5">{tag}</span>
                ))}
                {profile.interests.length > 3 && (
                  <span className="text-white/40 text-xs self-center">+{profile.interests.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
