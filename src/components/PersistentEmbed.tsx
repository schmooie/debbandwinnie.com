import { useRef, useLayoutEffect } from 'react'

// One iframe host element per embed src URL, always kept in document.body
// when not actively displayed. Because the host is never detached from the
// document, the iframe's browsing context (and Spotify playback state) is
// preserved across navigation.
const hostCache = new Map<string, HTMLDivElement>()

function getOrCreateHost(src: string): HTMLDivElement {
  if (!hostCache.has(src)) {
    const host = document.createElement('div')
    host.style.width = '100%'
    host.style.display = 'none'

    const iframe = document.createElement('iframe')
    iframe.src = src
    iframe.width = '100%'
    iframe.frameBorder = '0'
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
    iframe.style.borderRadius = '12px'
    iframe.style.display = 'block'

    host.appendChild(iframe)
    // Park the host in body immediately so it's always in the document.
    document.body.appendChild(host)
    hostCache.set(src, host)
  } else {
    console.log('reusing')
  }
  return hostCache.get(src)!
}

interface PersistentEmbedProps {
  embedHtml: string
  height: number
}

export default function PersistentEmbed({ embedHtml, height }: PersistentEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const src = embedHtml.match(/src="([^"]+)"/)?.[1] ?? null

  useLayoutEffect(() => {
    if (!src || !containerRef.current) return
    const host = getOrCreateHost(src)

    const iframe = host.querySelector('iframe')
    if (iframe) iframe.height = String(height)

    host.style.display = ''
    containerRef.current.appendChild(host)

    return () => {
      // React runs useLayoutEffect cleanup BEFORE detaching the component's
      // DOM node from the document. Moving the host to body here keeps it
      // connected the entire time — so the iframe is never reset.
      host.style.display = 'none'
      document.body.appendChild(host)
    }
  }, [src, height])

  return <div ref={containerRef} style={{ width: '100%' }} />
}
