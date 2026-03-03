import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../AppContext.tsx'
import ProfileCard from '../components/ProfileCard.tsx'
import { Profile } from '../types.ts'

export default function ForYou() {
  const { cardStack, swipeCard } = useApp()
  const navigate = useNavigate()
  const [swiping, setSwiping] = useState<'left' | 'right' | null>(null)

  const cardRef0 = useRef<HTMLDivElement>(null)
  const cardRef1 = useRef<HTMLDivElement>(null)
  const cardRef2 = useRef<HTMLDivElement>(null)
  const behindRefs = [cardRef1, cardRef2]

  const topCard = cardStack[0]

  const handleSwipe = useCallback((direction: 'left' | 'right', profile: Profile) => {
    swipeCard(direction, profile)
    setSwiping(null)
  }, [swipeCard])

  function handleButtonSwipe(direction: 'left' | 'right') {
    if (!topCard || swiping) return
    setSwiping(direction)
    cardRef0.current?.classList.add(direction === 'left' ? 'card-swipe-left' : 'card-swipe-right')

    // Animate behind cards to their promoted positions simultaneously with the top card
    const promotedTransforms = ['scale(1) translateY(0px)', 'scale(0.96) translateY(0.75rem)']
    const behindCards = [cardRef1.current, cardRef2.current]
    behindCards.forEach((card, i) => {
      if (!card) return
      card.style.transition = 'transform 0.3s ease'
      card.style.transform = promotedTransforms[i]
    })

    setTimeout(() => {
      // Clear inline styles so Tailwind classes (new indices) take over cleanly
      behindCards.forEach((card) => {
        if (!card) return
        card.style.transition = ''
        card.style.transform = ''
      })
      swipeCard(direction, topCard)
      setSwiping(null)
    }, 300)
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
      {/* Card stack area */}
      <div className="flex-1 relative mx-4 mt-4 mb-2">
        {visibleCards.map((profile, i) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            index={i}
            onSwipe={(dir) => handleSwipe(dir, profile)}
            onInfoClick={() => navigate(`/profile/${profile.id}`)}
            behindRefs={i === 0 ? behindRefs : undefined}
            divRef={i === 0 ? cardRef0 : i === 1 ? cardRef1 : cardRef2}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 py-4 shrink-0">
        <button
          onClick={() => handleButtonSwipe('left')}
          className="border-2 border-red-400 text-red-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-red-400/10 active:scale-95 transition-transform"
          aria-label="Nope"
        >
          ✕
        </button>
        <button
          onClick={() => handleButtonSwipe('right')}
          className="border-2 border-green-400 text-green-400 rounded-full w-16 h-16 flex items-center justify-center text-2xl hover:bg-green-400/10 active:scale-95 transition-transform"
          aria-label="Like"
        >
          ♥
        </button>
      </div>
    </div>
  )
}
