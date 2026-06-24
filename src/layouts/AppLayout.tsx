import type { MouseEvent, ReactNode } from 'react'
import type { AppRoute } from '../constants/routes'
import type { AppMessages } from '../i18n/messages'

type NavItem = {
  label: string
  route: AppRoute
}

type AppLayoutProps = {
  children: ReactNode
  currentRoute: AppRoute
  messages: AppMessages
  navItems: NavItem[]
  onNavigate: (
    event: MouseEvent<HTMLAnchorElement>,
    route: AppRoute,
  ) => void
}

export function AppLayout({
  children,
  currentRoute,
  messages,
  navItems,
  onNavigate,
}: AppLayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__inner">
          <p className="app-title">{messages.appTitle}</p>
          <nav className="app-nav" aria-label={messages.appTitle}>
            {navItems.map((item) => (
              <a
                aria-current={item.route === currentRoute ? 'page' : undefined}
                className="app-nav__link"
                href={item.route}
                key={item.route}
                onClick={(event) => onNavigate(event, item.route)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="page-shell">{children}</main>
    </div>
  )
}
