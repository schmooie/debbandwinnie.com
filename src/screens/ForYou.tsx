import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMotionValue, animate } from 'framer-motion'
import { useApp } from '../AppContext.tsx'
import ProfileCard from '../components/ProfileCard.tsx'
import { Profile } from '../types.ts'

export default function ForYou() {
  const { cardStack, swipeCard } = useApp()
  const navigate = useNavigate()
  const [swiping, setSwiping] = useState(false)

  // Shared motion value — top card drags it, behind cards read it for their scale/y
  const topCardX = useMotionValue(0)

  const topCard = cardStack[0]

  const handleSwipe = useCallback((direction: 'left' | 'right', profile: Profile) => {
    topCardX.set(0)
    swipeCard(direction, profile)
    setSwiping(false)
  }, [swipeCard, topCardX])

  function handleButtonSwipe(direction: 'left' | 'right') {
    if (!topCard || swiping) return
    setSwiping(true)
    animate(topCardX, direction === 'left' ? -600 : 600, {
      type: 'tween', duration: 0.45, ease: [0.32, 0, 0.67, 0],
    }).then(() => {
      topCardX.set(0)
      swipeCard(direction, topCard)
      setSwiping(false)
    })
  }

  if (cardStack.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <span className="text-6xl">💔</span>
        <h2 className="text-xl font-bold">You've seen everyone</h2>
        <p className="text-white/50 text-sm">Check back later for new profiles</p>
      </div>
    )
  }

  const visibleCards = cardStack.slice(0, 3)

  return (
    <div className="flex flex-col h-full">
      {/* Card stack */}
      <div className="flex-1 relative mx-4 mt-4 mb-2">
        {visibleCards.map((profile, i) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            index={i}
            onSwipe={(dir) => handleSwipe(dir, profile)}
            onInfoClick={() => navigate(`/profile/${profile.id}`)}
            dragX={topCardX}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 py-4 shrink-0">
        <button
          onClick={() => handleButtonSwipe('left')}
          className="border-2 border-red-400 text-red-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-red-400/10 active:scale-95 transition-transform"
          aria-label="Nope"
        >✕</button>
        <button
          onClick={() => handleButtonSwipe('right')}
          className="border-2 border-green-400 text-green-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-green-400/10 active:scale-95 transition-transform"
          aria-label="Like"
        >♥</button>
      </div>
    </div>
  )
}
