import type { MouseEvent, ReactNode } from 'react'
import type { AppRoute } from '../constants/routes'

type NavItem = {
  label: string
  route: AppRoute
}

type AppLayoutProps = {
  children: ReactNode
  currentRoute: AppRoute
  navItems: NavItem[]
  onNavigate: (
    event: MouseEvent<HTMLAnchorElement>,
    route: AppRoute,
  ) => void
}

export function AppLayout({
  children,
  currentRoute,
  navItems,
  onNavigate,
}: AppLayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__inner">
          <p className="app-title">Calc Drill</p>
          <nav className="app-nav" aria-label="Main navigation">
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
