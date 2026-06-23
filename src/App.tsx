import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { ROUTES } from './constants/routes'
import type { AppRoute } from './constants/routes'
import { AppLayout } from './layouts/AppLayout'
import { ResultPage } from './pages/ResultPage'
import { PlayPage } from './pages/PlayPage'
import { ScorePage } from './pages/ScorePage'
import { SettingsPage } from './pages/SettingsPage'
import { TopPage } from './pages/TopPage'
import { loadSettings, saveSettings } from './services/settingsStorage'
import type { DrillSettings } from './types/drill'
import './App.css'

type NavItem = {
  label: string
  route: AppRoute
}

const navItems: NavItem[] = [
  { label: 'Top', route: ROUTES.top },
  { label: 'Settings', route: ROUTES.settings },
  { label: 'Play', route: ROUTES.play },
  { label: 'Score', route: ROUTES.score },
  { label: 'Result', route: ROUTES.result },
]

function isAppRoute(pathname: string): pathname is AppRoute {
  return navItems.some((item) => item.route === pathname)
}

function getCurrentRoute(): AppRoute {
  return isAppRoute(window.location.pathname)
    ? window.location.pathname
    : ROUTES.top
}

function renderPage(
  route: AppRoute,
  settings: DrillSettings,
  onSettingsChange: (settings: DrillSettings) => void,
) {
  switch (route) {
    case ROUTES.settings:
      return (
        <SettingsPage
          onSettingsChange={onSettingsChange}
          settings={settings}
        />
      )
    case ROUTES.play:
      return <PlayPage />
    case ROUTES.score:
      return <ScorePage />
    case ROUTES.result:
      return <ResultPage />
    case ROUTES.top:
      return <TopPage settings={settings} />
  }
}

function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getCurrentRoute)
  const [settings, setSettings] = useState<DrillSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    route: AppRoute,
  ) => {
    event.preventDefault()

    if (route === currentRoute) {
      return
    }

    window.history.pushState(null, '', route)
    setCurrentRoute(route)
  }

  return (
    <AppLayout
      currentRoute={currentRoute}
      navItems={navItems}
      onNavigate={handleNavigate}
    >
      {renderPage(currentRoute, settings, setSettings)}
    </AppLayout>
  )
}

export default App
