import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';

/** Экран 404: некорректный адрес. */
export function NotFoundPage() {
  return (
    <div>
      <PageHeader title="Страница не найдена" />
      <EmptyState
        icon="🔍"
        title="Такой страницы нет"
        description="Проверьте адрес или вернитесь на карту центров."
        action={
          <Link
            to="/map"
            className="inline-flex min-h-11 items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-800"
          >
            На карту
          </Link>
        }
      />
    </div>
  );
}
