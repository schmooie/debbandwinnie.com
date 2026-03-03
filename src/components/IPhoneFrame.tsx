import { type ReactNode } from 'react'

export default function IPhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="iphone-wrapper">
      <div className="iphone-outer">

        {/* Side buttons — desktop only (hidden on mobile via CSS) */}
        <div className="iphone-silencer" />
        <div className="iphone-vol-up" />
        <div className="iphone-vol-down" />
        <div className="iphone-power" />

        {/* Inner bezel + screen */}
        <div className="iphone-inner">

          {/* Notch — desktop only */}
          <div className="iphone-notch">
            <div className="iphone-notch-cam">
              <div className="iphone-notch-cam-dot" />
            </div>
            <div className="iphone-notch-speaker" />
          </div>

          {/* App content */}
          <div className="iphone-content">
            {children}
          </div>

          {/* Home indicator — desktop only */}
          <div className="iphone-home-bar" />

        </div>
      </div>
    </div>
  )
}
