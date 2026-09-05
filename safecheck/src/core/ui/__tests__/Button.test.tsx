import { fireEvent, render } from '@testing-library/react-native';

import { ThemeProvider } from '@/core/theme';

import { Button } from '../Button';

jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(), ImpactFeedbackStyle: { Light: 'light' } }));

describe('Button', () => {
  it('déclenche onPress et expose un rôle bouton', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <ThemeProvider forceScheme="light">
        <Button label="Vérifier" onPress={onPress} />
      </ThemeProvider>,
    );
    await fireEvent.press(getByRole('button', { name: 'Vérifier' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('est désactivé et annoncé occupé pendant le chargement', async () => {
    const onPress = jest.fn();
    const { getByRole } = await render(
      <ThemeProvider forceScheme="light">
        <Button label="Envoyer" onPress={onPress} loading />
      </ThemeProvider>,
    );
    const btn = getByRole('button', { name: 'Envoyer' });
    expect(btn.props.accessibilityState).toMatchObject({ disabled: true, busy: true });
    await fireEvent.press(btn);
    expect(onPress).not.toHaveBeenCalled();
  });
});
