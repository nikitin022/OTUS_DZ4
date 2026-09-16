import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/map', label: 'Карта' },
  { to: '/feed', label: 'Лента' },
  { to: '/profile', label: 'Профиль' },
];

/**
 * Базовый каркас приложения: шапка, навигация, контент экранов.
 */
export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-slate-200 bg-surface">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold text-primary-700">Капля</span>
          <nav aria-label="Основная навигация">
            <ul className="flex gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-700 text-white'
                          : 'text-ink-600 hover:bg-primary-50 hover:text-primary-700'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-surface">
        <p className="mx-auto w-full max-w-3xl px-4 py-3 text-xs text-ink-600">
          Капля — помощь донорам крови
        </p>
      </footer>
    </div>
  );
}
