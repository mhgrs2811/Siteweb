import type { Icon as PhosphorIcon } from 'phosphor-react-native';
import { ArrowsClockwiseIcon } from 'phosphor-react-native/src/icons/ArrowsClockwise';
import { BarcodeIcon } from 'phosphor-react-native/src/icons/Barcode';
import { BellIcon } from 'phosphor-react-native/src/icons/Bell';
import { CalendarCheckIcon } from 'phosphor-react-native/src/icons/CalendarCheck';
import { CameraIcon } from 'phosphor-react-native/src/icons/Camera';
import { CaretLeftIcon } from 'phosphor-react-native/src/icons/CaretLeft';
import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { ChartLineUpIcon } from 'phosphor-react-native/src/icons/ChartLineUp';
import { CheckIcon } from 'phosphor-react-native/src/icons/Check';
import { CheckCircleIcon } from 'phosphor-react-native/src/icons/CheckCircle';
import { CirclesThreeIcon } from 'phosphor-react-native/src/icons/CirclesThree';
import { DeviceMobileIcon } from 'phosphor-react-native/src/icons/DeviceMobile';
import { DropIcon } from 'phosphor-react-native/src/icons/Drop';
import { EyeIcon } from 'phosphor-react-native/src/icons/Eye';
import { FeatherIcon } from 'phosphor-react-native/src/icons/Feather';
import { FlameIcon } from 'phosphor-react-native/src/icons/Flame';
import { GlobeIcon } from 'phosphor-react-native/src/icons/Globe';
import { HandTapIcon } from 'phosphor-react-native/src/icons/HandTap';
import { HouseIcon } from 'phosphor-react-native/src/icons/House';
import { InfoIcon } from 'phosphor-react-native/src/icons/Info';
import { LeafIcon } from 'phosphor-react-native/src/icons/Leaf';
import { ListChecksIcon } from 'phosphor-react-native/src/icons/ListChecks';
import { MoonIcon } from 'phosphor-react-native/src/icons/Moon';
import { PaletteIcon } from 'phosphor-react-native/src/icons/Palette';
import { RulerIcon } from 'phosphor-react-native/src/icons/Ruler';
import { ScanIcon } from 'phosphor-react-native/src/icons/Scan';
import { ShareNetworkIcon } from 'phosphor-react-native/src/icons/ShareNetwork';
import { SlidersHorizontalIcon } from 'phosphor-react-native/src/icons/SlidersHorizontal';
import { SparkleIcon } from 'phosphor-react-native/src/icons/Sparkle';
import { SunIcon } from 'phosphor-react-native/src/icons/Sun';
import { SunHorizonIcon } from 'phosphor-react-native/src/icons/SunHorizon';
import { TargetIcon } from 'phosphor-react-native/src/icons/Target';
import { TextAaIcon } from 'phosphor-react-native/src/icons/TextAa';
import { TranslateIcon } from 'phosphor-react-native/src/icons/Translate';
import { UserIcon } from 'phosphor-react-native/src/icons/User';
import { VibrateIcon } from 'phosphor-react-native/src/icons/Vibrate';
import { WarningCircleIcon } from 'phosphor-react-native/src/icons/WarningCircle';
import { WavesIcon } from 'phosphor-react-native/src/icons/Waves';
import { WaveSineIcon } from 'phosphor-react-native/src/icons/WaveSine';
import { XIcon } from 'phosphor-react-native/src/icons/X';
import type { StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

/**
 * The curated icon set. One family (Phosphor), one weight (light), two sizes. Icons are imported
 * one by one so the bundle only carries what the app uses.
 */
export const icons = {
  arrowsClockwise: ArrowsClockwiseIcon,
  barcode: BarcodeIcon,
  bell: BellIcon,
  calendarCheck: CalendarCheckIcon,
  camera: CameraIcon,
  caretLeft: CaretLeftIcon,
  caretRight: CaretRightIcon,
  chartLineUp: ChartLineUpIcon,
  check: CheckIcon,
  checkCircle: CheckCircleIcon,
  circlesThree: CirclesThreeIcon,
  deviceMobile: DeviceMobileIcon,
  drop: DropIcon,
  eye: EyeIcon,
  feather: FeatherIcon,
  flame: FlameIcon,
  globe: GlobeIcon,
  handTap: HandTapIcon,
  house: HouseIcon,
  info: InfoIcon,
  leaf: LeafIcon,
  listChecks: ListChecksIcon,
  moon: MoonIcon,
  palette: PaletteIcon,
  ruler: RulerIcon,
  scan: ScanIcon,
  shareNetwork: ShareNetworkIcon,
  slidersHorizontal: SlidersHorizontalIcon,
  sparkle: SparkleIcon,
  sun: SunIcon,
  sunHorizon: SunHorizonIcon,
  target: TargetIcon,
  textAa: TextAaIcon,
  translate: TranslateIcon,
  user: UserIcon,
  vibrate: VibrateIcon,
  warningCircle: WarningCircleIcon,
  waves: WavesIcon,
  waveSine: WaveSineIcon,
  x: XIcon,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof icons;

export const ICON_NAMES = Object.keys(icons) as IconName[];

export type IconSize = 16 | 20 | 24 | 32;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  /** Defaults to the ink colour of the current theme. */
  color?: string;
  style?: StyleProp<ViewStyle>;
  /** Decorative by default; pass a label only when the icon carries meaning on its own. */
  accessibilityLabel?: string;
}

export function Icon({ name, size = 24, color, style, accessibilityLabel }: IconProps) {
  const theme = useTheme();
  const Glyph = icons[name];
  return (
    <Glyph
      size={size}
      weight="light"
      color={color ?? theme.colors.ink}
      style={style}
      title={accessibilityLabel}
    />
  );
}
