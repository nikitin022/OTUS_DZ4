import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800',
  secondary: 'border border-primary-700 bg-transparent text-primary-700 hover:bg-primary-50',
  danger: 'bg-danger-600 text-white hover:bg-red-700',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** При загрузке кнопка блокируется и показывает статус */
  loading?: boolean;
  children: ReactNode;
}

/**
 * Базовая кнопка. Минимальная высота 44px — удобная зона нажатия на мобильных.
 */
export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Загрузка…' : children}
    </button>
  );
}
