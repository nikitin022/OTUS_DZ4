import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Field } from '../../../components/ui/Field';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useCreateAppointment } from '../../../api/hooks';
import { useDonorProfile } from '../../profile/model/DonorProfileContext';
import { isDonationIntervalMet } from '../../../lib/validation';
import { formatDate } from '../../../lib/format';
import type { Appointment } from '../../../types';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00'];

/**
 * Запись на донацию (FR-5): дата и слот времени, проверка интервала,
 * создание записи со статусом «Ожидает подтверждения» (FR-5.1–FR-5.3).
 * Ошибки API показываются человекочитаемым текстом (матрица ошибок ТЗ).
 */
export function BookingPage() {
  const { centerId } = useParams<{ centerId: string }>();
  const { donor } = useDonorProfile();
  const createAppointment = useCreateAppointment();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [created, setCreated] = useState<Appointment | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!donor) return;
    if (!date) {
      setFormError('Выберите дату донации');
      return;
    }
    if (!time) {
      setFormError('Выберите время');
      return;
    }
    if (!isDonationIntervalMet(donor.lastDonationAt, new Date(date))) {
      setFormError(
        'Интервал не соблюдён — между донациями должно пройти не менее 60 дней',
      );
      return;
    }

    createAppointment.mutate(
      { donorId: donor.id, centerId: centerId ?? '', date, time },
      {
        onSuccess: (appointment) => setCreated(appointment),
        onError: (error) =>
          setFormError(
            error instanceof Error
              ? error.message
              : 'Не удалось создать запись. Попробуйте ещё раз.',
          ),
      },
    );
  }

  if (created) {
    return (
      <div>
        <PageHeader title="Запись на донацию" showBack />
        <Card>
          <p
            role="status"
            className="text-sm font-medium text-primary-700"
          >
            Запись создана — ожидает подтверждения центра
          </p>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-600">Дата</dt>
              <dd className="font-medium text-ink-900">
                {formatDate(created.date)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-600">Время</dt>
              <dd className="font-medium text-ink-900">{created.time}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-600">Центр</dt>
              <dd className="font-medium text-ink-900">
                № {created.centerId}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Запись на донацию" showBack />

      <Card>
        <p className="text-sm text-ink-600">Центр № {centerId ?? '—'}</p>

        <form
          className="mt-4 space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <Field label="Дата донации" htmlFor="booking-date">
            <Input
              id="booking-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Field>

          <fieldset>
            <legend className="text-sm font-medium text-ink-900">
              Время
            </legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={time === slot}
                  onClick={() => setTime(slot)}
                  className={`min-h-11 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                    time === slot
                      ? 'border-primary-700 bg-primary-700 text-white'
                      : 'border-slate-300 bg-surface text-ink-600 hover:border-primary-700 hover:text-primary-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </fieldset>

          {formError && (
            <p role="alert" className="text-sm text-danger-600">
              {formError}
            </p>
          )}

          <Button type="submit" loading={createAppointment.isPending}>
            Записаться
          </Button>
        </form>

        <p className="mt-3 text-xs text-ink-600">
          Интервал между донациями — не менее 60 дней.
        </p>
      </Card>
    </div>
  );
}
