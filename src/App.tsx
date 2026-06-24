import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { DevTools } from './components/dev/DevTools'
import { DEFAULT_SCORE_SUMMARY, DEFAULT_SETTINGS } from './constants/defaults'
import { ROUTES } from './constants/routes'
import type { AppRoute } from './constants/routes'
import { AppLayout } from './layouts/AppLayout'
import { ResultPage } from './pages/ResultPage'
import { PlayPage } from './pages/PlayPage'
import { ScorePage } from './pages/ScorePage'
import { SettingsPage } from './pages/SettingsPage'
import { TopPage } from './pages/TopPage'
import {
  loadScoreSummary,
  recordPlayResult,
  saveScoreSummary,
} from './services/scoreStorage'
import { loadSettings, saveSettings } from './services/settingsStorage'
import type { DrillSettings, PlayResult, ScoreSummary } from './types/drill'
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
  scoreSummary: ScoreSummary,
  onPlayComplete: (result: PlayResult) => void,
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
      return <PlayPage onComplete={onPlayComplete} settings={settings} />
    case ROUTES.score:
      return <ScorePage scoreSummary={scoreSummary} />
    case ROUTES.result:
      return <ResultPage result={scoreSummary.latestResult} />
    case ROUTES.top:
      return <TopPage settings={settings} />
  }
}

function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getCurrentRoute)
  const [settings, setSettings] = useState<DrillSettings>(loadSettings)
  const [scoreSummary, setScoreSummary] =
    useState<ScoreSummary>(loadScoreSummary)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    saveScoreSummary(scoreSummary)
  }, [scoreSummary])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const navigateTo = (route: AppRoute) => {
    if (route === currentRoute) {
      return
    }

    window.history.pushState(null, '', route)
    setCurrentRoute(route)
  }

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    route: AppRoute,
  ) => {
    event.preventDefault()
    navigateTo(route)
  }

  const handlePlayComplete = (result: PlayResult) => {
    setScoreSummary((currentScoreSummary) => {
      return recordPlayResult(currentScoreSummary, result)
    })
    navigateTo(ROUTES.result)
  }

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    saveSettings(DEFAULT_SETTINGS)
  }

  const handleResetScore = () => {
    setScoreSummary(DEFAULT_SCORE_SUMMARY)
    saveScoreSummary(DEFAULT_SCORE_SUMMARY)
  }

  return (
    <AppLayout
      currentRoute={currentRoute}
      navItems={navItems}
      onNavigate={handleNavigate}
    >
      {renderPage(
        currentRoute,
        settings,
        setSettings,
        scoreSummary,
        handlePlayComplete,
      )}
      {import.meta.env.DEV && (
        <DevTools
          onResetScore={handleResetScore}
          onResetSettings={handleResetSettings}
        />
      )}
    </AppLayout>
  )
}

export default App
