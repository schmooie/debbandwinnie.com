import { createContext, useContext, useState, ReactNode } from 'react'
import { Profile, Conversation } from './types.ts'
import profilesData from './data/profiles.json'
import messagesData from './data/messages.json'

interface AppContextValue {
  profiles: Profile[]
  messages: Conversation[]
  cardStack: Profile[]
  swipeCard: (direction: 'left' | 'right', profile: Profile) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }: { children: ReactNode }) {
  const profiles = profilesData as Profile[]
  const messages = messagesData as Conversation[]
  const [cardStack, setCardStack] = useState<Profile[]>([...profiles])

  function swipeCard(_direction: 'left' | 'right', _profile: Profile) {
    setCardStack(prev => prev.slice(1))
  }

  return (
    <AppContext.Provider value={{ profiles, messages, cardStack, swipeCard }}>
      {children}
    </AppContext.Provider>
  )
}
