import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeedPage } from './FeedPage';
import { DonorProfileProvider } from '../../profile/model/DonorProfileContext';
import { apiClient } from '../../../api/client';
import type { BloodRequest } from '../../../types';

vi.mock('../../../api/client', () => ({
  apiClient: {
    getRequests: vi.fn(),
    getCenters: vi.fn(),
    getDonationHistory: vi.fn(),
    getRequestResponses: vi.fn(),
    createRequest: vi.fn(),
    updateRequest: vi.fn(),
    createAppointment: vi.fn(),
    updateAppointment: vi.fn(),
    subscribeToPush: vi.fn(),
  },
}));

const mockGetRequests = vi.mocked(apiClient.getRequests);
const mockGetCenters = vi.mocked(apiClient.getCenters);

const request: BloodRequest = {
  id: 'r-1',
  centerId: 'c-1',
  bloodGroup: '1',
  rhFactor: '+',
  volumeMl: 900,
  urgency: 'срочная',
  collectedMl: 450,
  status: 'active',
  createdAt: '2026-03-09T10:00:00.000Z',
  updatedAt: '2026-03-09T11:30:00.000Z',
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <DonorProfileProvider>
        <MemoryRouter>
          <FeedPage />
        </MemoryRouter>
      </DonorProfileProvider>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  mockGetCenters.mockResolvedValue([]);
});

describe('FeedPage — позитивный сценарий', () => {
  it('отображает карточки заявок после загрузки', async () => {
    mockGetRequests.mockResolvedValue([request]);
    renderPage();

    expect(await screen.findByText('I (0) Rh+')).toBeInTheDocument();
    expect(screen.getByText('срочная')).toBeInTheDocument();
    expect(
      screen.getByText('Лента обновляется автоматически каждые 45 секунд'),
    ).toBeInTheDocument();
  });
});

describe('FeedPage — фильтры и пустое состояние', () => {
  it('пустой результат по фильтру: «Ничего не найдено» + «Сбросить фильтры» (FR-3.2)', async () => {
    mockGetRequests.mockResolvedValue([request]);
    renderPage();
    await screen.findByText('I (0) Rh+');

    fireEvent.change(screen.getByLabelText('Фильтр по группе крови'), {
      target: { value: '4' },
    });

    expect(await screen.findByText('Ничего не найдено')).toBeInTheDocument();

    const resetButtons = screen.getAllByRole('button', {
      name: 'Сбросить фильтры',
    });
    fireEvent.click(resetButtons.at(-1)!);

    expect(await screen.findByText('I (0) Rh+')).toBeInTheDocument();
  });
});

describe('FeedPage — обработка ошибки сети', () => {
  it('баннер «Повторить» восстанавливает ленту', async () => {
    mockGetRequests.mockRejectedValueOnce(new Error('network down'));
    renderPage();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText(/Не удалось загрузить заявки/),
    ).toBeInTheDocument();

    mockGetRequests.mockResolvedValue([request]);
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));

    expect(await screen.findByText('I (0) Rh+')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
