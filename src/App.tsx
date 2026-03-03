import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './AppContext.tsx'
import IPhoneFrame from './components/IPhoneFrame.tsx'
import AppHeader from './components/AppHeader.tsx'
import BottomNav from './components/BottomNav.tsx'
import ForYou from './screens/ForYou.tsx'
import LikesYou from './screens/LikesYou.tsx'
import Chat from './screens/Chat.tsx'
import ChatDetail from './screens/ChatDetail.tsx'
import ProfileDetail from './screens/ProfileDetail.tsx'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <IPhoneFrame>
          <div
            className="relative w-full h-full flex flex-col bg-brand-dark text-white overflow-hidden md:pt-[34px]"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <AppHeader />
            <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <Routes>
                <Route path="/" element={<ForYou />} />
                <Route path="/likes-you" element={<LikesYou />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:id" element={<ChatDetail />} />
                <Route path="/profile/:id" element={<ProfileDetail />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </IPhoneFrame>
      </HashRouter>
    </AppProvider>
  )
}
