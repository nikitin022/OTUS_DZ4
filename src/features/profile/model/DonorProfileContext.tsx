import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Donor } from '../../../types';

const STORAGE_KEY = 'kaplya.donorProfile';

interface DonorProfileContextValue {
  /** null — гость (FR-1.4) */
  donor: Donor | null;
  saveDonor: (donor: Donor) => void;
  clearDonor: () => void;
}

const DonorProfileContext = createContext<DonorProfileContextValue | undefined>(
  undefined,
);

function loadFromStorage(): Donor | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Donor) : null;
  } catch {
    return null;
  }
}

/**
 * Профиль донора (FR-1). Гость = null; профиль сохраняется в localStorage.
 */
export function DonorProfileProvider({ children }: { children: ReactNode }) {
  const [donor, setDonor] = useState<Donor | null>(loadFromStorage);

  const saveDonor = useCallback((next: Donor) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setDonor(next);
  }, []);

  const clearDonor = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDonor(null);
  }, []);

  const value = useMemo(
    () => ({ donor, saveDonor, clearDonor }),
    [donor, saveDonor, clearDonor],
  );

  return (
    <DonorProfileContext.Provider value={value}>
      {children}
    </DonorProfileContext.Provider>
  );
}

export function useDonorProfile(): DonorProfileContextValue {
  const ctx = useContext(DonorProfileContext);
  if (!ctx) {
    throw new Error(
      'useDonorProfile должен использоваться внутри DonorProfileProvider',
    );
  }
  return ctx;
}
