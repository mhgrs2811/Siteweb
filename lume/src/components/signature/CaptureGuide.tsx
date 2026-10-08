import {
  Blur,
  Canvas,
  Circle,
  DashPathEffect,
  Group,
  Oval,
  Path,
  Rect,
  Skia,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';

import { hexToRgb, useTheme } from '@/theme';

export interface CaptureGuideProps {
  width: number;
  height?: number;
}

/**
 * Abstract viewfinder for the capture guide: a soft light source, the dashed face oval and
 * four corner marks, drawn in Skia. It rehearses the real camera overlay of Phase 2.
 */
export function CaptureGuide({ width, height = 260 }: CaptureGuideProps) {
  const theme = useTheme();
  const { colors } = theme;

  const corners = useMemo(() => {
    const inset = 20;
    const length = 22;
    const path = Skia.Path.Make();
    const points: [number, number, number, number][] = [
      [inset, inset, 1, 1],
      [width - inset, inset, -1, 1],
      [inset, height - inset, 1, -1],
      [width - inset, height - inset, -1, -1],
    ];
    for (const [x, y, dx, dy] of points) {
      path.moveTo(x, y + dy * length);
      path.lineTo(x, y);
      path.lineTo(x + dx * length, y);
    }
    return path;
  }, [height, width]);

  const ovalWidth = Math.min(width * 0.46, 170);
  const ovalHeight = ovalWidth * 1.3;
  const ovalX = (width - ovalWidth) / 2;
  const ovalY = (height - ovalHeight) / 2;

  const light = hexToRgb(colors.aura.champagne);
  const lightColor = `rgba(${light.r}, ${light.g}, ${light.b}, ${theme.isDark ? 0.9 : 1})`;

  return (
    <Canvas style={{ width, height }}>
      <Rect x={0} y={0} width={width} height={height} color={colors.surfaceSunken} />
      <Circle cx={width * 0.18} cy={height * 0.12} r={width * 0.32} color={lightColor}>
        <Blur blur={40} />
      </Circle>
      <Group>
        <Oval
          x={ovalX}
          y={ovalY}
          width={ovalWidth}
          height={ovalHeight}
          style="stroke"
          strokeWidth={1.5}
          color={colors.accent.base}
        >
          <DashPathEffect intervals={[6, 6]} />
        </Oval>
        <Oval
          x={ovalX + 10}
          y={ovalY + 10}
          width={ovalWidth - 20}
          height={ovalHeight - 20}
          color={colors.surface}
          opacity={theme.isDark ? 0.08 : 0.45}
        />
      </Group>
      <Path
        path={corners}
        style="stroke"
        strokeWidth={1.5}
        strokeCap="round"
        strokeJoin="round"
        color={colors.lineStrong}
      />
    </Canvas>
  );
}
