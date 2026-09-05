import { render } from '@testing-library/react-native';

import { ThemeProvider } from '@/core/theme';

import { RiskBadge } from '../RiskBadge';

function renderBadge(level: 'unknown' | 'low' | 'moderate' | 'high') {
  return render(
    <ThemeProvider forceScheme="light">
      <RiskBadge level={level} />
    </ThemeProvider>,
  );
}

describe('RiskBadge', () => {
  it('affiche un libellé prudent pour un risque élevé, avec un label accessible', async () => {
    const { getByText, getByLabelText } = await renderBadge('high');
    expect(getByText('Nombre élevé de signalements')).toBeTruthy();
    expect(getByLabelText('Niveau de risque : Nombre élevé de signalements')).toBeTruthy();
  });

  it('ne promet jamais la sécurité en l’absence de signalement', async () => {
    const { getByText, queryByText } = await renderBadge('unknown');
    expect(getByText('Aucun signalement connu')).toBeTruthy();
    expect(queryByText(/sûr|fiable/i)).toBeNull();
  });
});
