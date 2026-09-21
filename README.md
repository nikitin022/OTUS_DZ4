# «Капля» — PWA для доноров крови

Прогрессивное веб-приложение, которое показывает центры крови на интерактивной карте,
ведёт живую ленту потребностей и помогает донорам записываться, когда в их городе
нужна именно их группа крови.

**Демо:** https://nikitin022.github.io/OTUS_DZ4/ (GitHub Pages, HTTPS, устанавливается как PWA)

## Возможности

- **Карта центров** — маркеры с статусом «открыто/закрыто», поиск по названию/адресу,
  фильтры «Открыто сейчас» / «Есть срочные», карточка центра, маршрут во внешних картах;
- **Живая лента потребностей** — заявки с группой крови, объёмом, срочностью и прогрессом;
  фильтры, пагинация, автообновление каждые 45 секунд без перезагрузки;
- **Профиль донора** — группа крови, резус, радиус поиска 1–500 км, явные согласия
  на геолокацию и уведомления;
- **Запись на донацию** — дата и слоты времени, контроль интервала ≥ 60 дней,
  статус «Ожидает подтверждения»;
- **История донаций** — даты, места, объёмы, статусы и индикатор «Интервал соблюдён»;
- **PWA** — Service Worker, офлайн-кэш просмотренных данных, установка на устройство;
- Адаптивная вёрстка от 320px (нижняя таб-навигация на мобильных, меню в шапке на десктопе).

Данные в MVP — mock-слой на localStorage с задержкой сети и «живой» лентой
(прогресс заявок растёт, заполненные закрываются). Контракт API сохранён для
будущего бэкенда (раздел 8 ТЗ).

## Быстрый старт

Требуется Node.js 20+.

```bash
npm install
npm run dev      # дев-сервер Vite на http://localhost:5173
```

Прочие команды:

```bash
npm run test          # Vitest: 85 тестов в 17 файлах
npm run lint          # ESLint (0 ошибок / 0 предупреждений)
npm run build         # прод-сборка + Service Worker + manifest (dist/)
npm run preview       # локальный просмотр прод-сборки
npm run build:pages   # сборка для GitHub Pages (base=/OTUS_DZ4/ + 404.html)
npm run deploy        # сборка для Pages и публикация в ветку gh-pages
```

## Технологический стек

- **React 18 + TypeScript + Vite** — UI-фреймворк, сборка;
- **Tailwind CSS v4** — стилизация (концепция Minimalist, mobile-first, WCAG AA);
- **Leaflet + react-leaflet (OpenStreetMap)** — карта центров крови;
- **TanStack Query** — серверное состояние, автообновление ленты, офлайн-кэш;
- **React Router v6** — навигация;
- **vite-plugin-pwa (Workbox)** — Service Worker, manifest, установка на устройство;
- **Vitest + React Testing Library** — тестирование.

## Структура проекта

```
ДЗ4/
├── docs/                          # Проектная документация (см. ниже)
│   └── screenshots/               # Контрольные скриншоты адаптивности
├── public/                        # Иконки PWA, favicon
├── src/
│   ├── app/                       # Роутинг, Layout (адаптивная навигация), 404
│   ├── components/
│   │   ├── ui/                    # UI-кит: Button, Input, Field, Badge, Card,
│   │   │                          # ProgressBar, EmptyState, ErrorBanner, Skeleton,
│   │   │                          # PageGate (состояния экрана), LinkButton, ...
│   │   └── routing/               # RequireDonor — гостевой guard (FR-1.4)
│   ├── features/
│   │   ├── map/                   # Карта центров: Leaflet, фильтры, поиск (FR-2)
│   │   ├── feed/                  # Живая лента заявок + карточка заявки (FR-3, FR-8)
│   │   ├── centers/               # Карточка центра (FR-2.3/2.4)
│   │   ├── booking/               # Запись на донацию (FR-5)
│   │   ├── history/               # История донаций (FR-6)
│   │   ├── profile/               # Профиль донора (FR-1) + контекст
│   │   └── geo/                   # Хук геолокации useUserCoords
│   ├── api/                       # Контракт ApiClient (ТЗ, раздел 8), TanStack Query
│   │   └── mock/                  # Mock-реализация: localStorage, «живая» лента
│   ├── lib/                       # Утилиты: гео, рабочие часы, форматы, валидации
│   └── types/                     # Модели данных (Донор, Центр, Заявка, Запись, ...)
└── rules.md                       # Правила для AI-агента (стек, архитектура, UX)
```

## Документация

| Документ | Содержание |
|---|---|
| [technical_specification.md](./technical_specification.md) | Исходное ТЗ (стек-агностичное) |
| [docs/stack_decision.md](./docs/stack_decision.md) | Технологический стек и обоснования |
| [docs/functional_requirements.md](./docs/functional_requirements.md) | Функциональные требования MVP и матрица ошибок |
| [docs/testing_report.md](./docs/testing_report.md) | Отчёт о тестировании, отладке и адаптивности |
| [docs/ai_debugging_prompts.md](./docs/ai_debugging_prompts.md) | Промпт-шаблоны отладки с AI |
| [docs/ai_refactoring_prompts.md](./docs/ai_refactoring_prompts.md) | Промпты, проблемы и метрики рефакторинга |
| [docs/development_report.md](./docs/development_report.md) | Отчёт о процессе разработки |
| [rules.md](./rules.md) | Правила работы AI-агента с кодовой базой |

## Деплой

Приложение хостится на GitHub Pages из ветки `gh-pages`:

```bash
npm run deploy    # build:pages + публикация dist в gh-pages
```

Обновление страницы после нового деплоя может занять 1–2 минуты.

