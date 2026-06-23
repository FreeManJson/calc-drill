import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { ROUTES } from './constants/routes'
import type { AppRoute } from './constants/routes'
import { ResultPage } from './pages/ResultPage'
import { PlayPage } from './pages/PlayPage'
import { ScorePage } from './pages/ScorePage'
import { SettingsPage } from './pages/SettingsPage'
import { TopPage } from './pages/TopPage'
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

function renderPage(route: AppRoute) {
  switch (route) {
    case ROUTES.settings:
      return <SettingsPage />
    case ROUTES.play:
      return <PlayPage />
    case ROUTES.score:
      return <ScorePage />
    case ROUTES.result:
      return <ResultPage />
    case ROUTES.top:
      return <TopPage />
  }
}

function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(getCurrentRoute)

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
    <>
      <nav className="app-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            aria-current={item.route === currentRoute ? 'page' : undefined}
            className="app-nav__link"
            href={item.route}
            key={item.route}
            onClick={(event) => handleNavigate(event, item.route)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <main className="page-shell">{renderPage(currentRoute)}</main>
    </>
  )
}

export default App
