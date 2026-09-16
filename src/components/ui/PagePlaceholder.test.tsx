import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PagePlaceholder } from './PagePlaceholder';

describe('PagePlaceholder', () => {
  it('отображает заголовок и описание экрана', () => {
    render(
      <PagePlaceholder title="Карта центров" description="Текст описания" />,
    );

    expect(
      screen.getByRole('heading', { name: 'Карта центров' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Текст описания')).toBeInTheDocument();
  });
});
