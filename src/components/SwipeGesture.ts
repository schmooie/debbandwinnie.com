export interface SwipeGestureOptions {
  onSwipe: (direction: 'left' | 'right') => void
  behindCards?: HTMLElement[]
}

export function attachSwipeGesture(
  el: HTMLElement,
  options: SwipeGestureOptions
): () => void {
  let startX = 0
  let startY = 0
  let startTime = 0
  let isDragging = false

  function onPointerDown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest('button, a')) return
    el.setPointerCapture(e.pointerId)
    startX = e.clientX
    startY = e.clientY
    startTime = Date.now()
    isDragging = true
    el.classList.add('card-dragging')
    document.body.classList.add('is-dragging')
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const rotate = dx * 0.08
    el.style.transform = `translateX(${dx}px) translateY(${dy * 0.3}px) rotate(${rotate}deg)`

    if (dx < -20) {
      el.classList.add('card-drag-left')
      el.classList.remove('card-drag-right')
    } else if (dx > 20) {
      el.classList.add('card-drag-right')
      el.classList.remove('card-drag-left')
    } else {
      el.classList.remove('card-drag-left', 'card-drag-right')
    }

    // Scale behind cards proportionally
    const progress = Math.min(Math.abs(dx) / 150, 1)
    if (options.behindCards) {
      options.behindCards.forEach((card, i) => {
        const baseScale = 1 - (i + 1) * 0.04
        const targetScale = baseScale + (i + 1) * 0.04 * progress
        card.style.transform = `scale(${Math.min(targetScale, 1)})`
      })
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDragging) return
    isDragging = false
    el.classList.remove('card-dragging', 'card-drag-left', 'card-drag-right')
    document.body.classList.remove('is-dragging')

    const dx = e.clientX - startX
    const elapsed = Date.now() - startTime
    const velocity = Math.abs(dx) / elapsed

    if (Math.abs(dx) > 80 || velocity > 0.3) {
      const direction = dx > 0 ? 'right' : 'left'
      el.classList.add(direction === 'left' ? 'card-swipe-left' : 'card-swipe-right')

      // Animate behind cards to their promoted positions simultaneously
      const promotedTransforms = ['scale(1) translateY(0px)', 'scale(0.96) translateY(0.75rem)']
      if (options.behindCards) {
        options.behindCards.forEach((card, i) => {
          card.style.transition = 'transform 0.3s ease'
          card.style.transform = promotedTransforms[i] ?? ''
          setTimeout(() => {
            card.style.transition = ''
            card.style.transform = ''
          }, 300)
        })
      }

      setTimeout(() => {
        options.onSwipe(direction)
      }, 300)
    } else {
      // Snap back
      el.style.transition = 'transform 0.3s ease'
      el.style.transform = ''
      setTimeout(() => {
        el.style.transition = ''
      }, 300)

      // Reset behind cards to their original positions
      if (options.behindCards) {
        options.behindCards.forEach((card) => {
          card.style.transition = 'transform 0.3s ease'
          card.style.transform = ''
          setTimeout(() => {
            card.style.transition = ''
          }, 300)
        })
      }
    }
  }

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUp)
  el.addEventListener('pointercancel', onPointerUp)

  return () => {
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUp)
    el.removeEventListener('pointercancel', onPointerUp)
    document.body.classList.remove('is-dragging')
  }
}
