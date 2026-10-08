import { StyleSheet, View } from 'react-native';

import { Aura } from '@/components/signature/Aura';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useTheme } from '@/theme';

import { BenefitList, type BenefitItem } from './BenefitList';

export interface PermissionPrimerProps {
  icon: IconName;
  benefits: readonly BenefitItem[];
}

const MEDALLION = 132;

/**
 * Explains the value of a system permission before the OS prompt: a medallion lit by the
 * aura, then three concrete benefits. Reused for notifications now and the camera in Phase 2.
 */
export function PermissionPrimer({ icon, benefits }: PermissionPrimerProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing[6] }}>
      <View style={styles.medallionWrap}>
        <View
          style={[
            styles.medallion,
            { borderRadius: MEDALLION / 2, borderColor: theme.colors.line },
            theme.shadows.soft,
          ]}
        >
          <Aura width={MEDALLION} height={MEDALLION} fade={false} grain={0.5} />
          <View style={[StyleSheet.absoluteFill, styles.center]}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface }]}>
              <Icon name={icon} size={32} color={theme.colors.accent.text} />
            </View>
          </View>
        </View>
      </View>

      <BenefitList items={benefits} initialDelayMs={120} />
    </View>
  );
}

const styles = StyleSheet.create({
  medallionWrap: {
    alignItems: 'center',
  },
  medallion: {
    width: MEDALLION,
    height: MEDALLION,
    overflow: 'hidden',
    borderWidth: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
