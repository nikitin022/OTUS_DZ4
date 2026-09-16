import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { MIN_DONATION_INTERVAL_DAYS } from '../../../lib/validation';

/**
 * Запись на донацию (FR-5). Доступ только для авторизованных доноров
 * (обёртка RequireDonor). Слоты и проверка интервала подключаются
 * вместе с данными на следующем шаге.
 */
export function BookingPage() {
  const { centerId } = useParams<{ centerId: string }>();

  return (
    <div>
      <PageHeader title="Запись на донацию" showBack />

      <Card>
        <p className="text-sm text-ink-600">
          Центр № {centerId ?? '—'} — название и график появятся после
          подключения данных.
        </p>

        <form className="mt-4 space-y-4" onSubmit={(event) => event.preventDefault()}>
          <Field label="Дата донации" htmlFor="booking-date">
            <Input id="booking-date" type="date" />
          </Field>

          <Field label="Время" hint="Слоты появятся после подключения данных">
            <Input type="time" disabled aria-label="Время слота" />
          </Field>

          <Button type="submit" disabled>
            Записаться
          </Button>
        </form>

        <p className="mt-3 text-xs text-ink-600">
          Интервал между донациями — не менее {MIN_DONATION_INTERVAL_DAYS} дней.
        </p>
      </Card>
    </div>
  );
}
