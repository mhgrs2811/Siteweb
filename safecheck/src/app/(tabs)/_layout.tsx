import { Ionicons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, type ColorValue } from 'react-native';

import { MIN_TOUCH_TARGET, useTheme } from '@/core/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(active: IconName, inactive: IconName) {
  function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={28} color={color} />;
  }
  return TabIcon;
}

/**
 * 4 onglets, libellés toujours visibles, icônes 28pt, barre haute (72pt) :
 * navigation compréhensible en un coup d'œil, y compris pour les publics
 * peu à l'aise avec la technologie.
 */
export default function TabsLayout() {
  const { t } = useTranslation();
  const { colors, typography } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { ...typography.heading, color: colors.text },
        headerRight: () => (
          <Link href="/account" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('tabs.account')}
              hitSlop={8}
              style={{ width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
            </Pressable>
          </Link>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 72, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600', paddingBottom: 6 },
        tabBarAllowFontScaling: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.check'),
          tabBarIcon: tabIcon('search', 'search-outline'),
          tabBarAccessibilityLabel: t('a11y.tabIcon', { name: t('tabs.check') }),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: t('tabs.report'),
          tabBarIcon: tabIcon('megaphone', 'megaphone-outline'),
          tabBarAccessibilityLabel: t('a11y.tabIcon', { name: t('tabs.report') }),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t('tabs.alerts'),
          tabBarIcon: tabIcon('notifications', 'notifications-outline'),
          tabBarAccessibilityLabel: t('a11y.tabIcon', { name: t('tabs.alerts') }),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('tabs.learn'),
          tabBarIcon: tabIcon('book', 'book-outline'),
          tabBarAccessibilityLabel: t('a11y.tabIcon', { name: t('tabs.learn') }),
        }}
      />
    </Tabs>
  );
}
