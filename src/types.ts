export type ProfileType = 'person' | 'single' | 'tourDates'

export interface TourDate {
  date: string
  venue: string
  city: string
  ticketUrl?: string
}

export interface PersonProfile {
  id: string
  type: 'person'
  name: string
  age: number
  distance: string
  bio: string
  image: string
  interests: string[]
  commonInterests: number
  role: string
}

export interface SingleProfile {
  id: string
  type: 'single'
  name: string
  age: null
  distance: string
  bio: string
  image: string | null
  embedHtml: string
  interests: string[]
  commonInterests: null
  role: string
}

export interface TourDatesProfile {
  id: string
  type: 'tourDates'
  name: string
  age: null
  distance: string
  bio: string
  image: null
  interests: string[]
  commonInterests: null
  role: string
  dates: TourDate[]
}

export type Profile = PersonProfile | SingleProfile | TourDatesProfile

export interface ChatMessage {
  from: 'me' | 'them'
  text: string
  time: string
}

export interface Conversation {
  id: string
  profileId: string
  name: string
  image: string
  lastMessage: string
  lastTime: string
  unread: boolean
  messages: ChatMessage[]
}
