let pending: Promise<void> | null = null;

/**
 * Web only: React Native Skia renders through CanvasKit (WebAssembly), which must be fetched
 * before the first <Canvas> mounts. The .wasm file is copied into /public by
 * `npx setup-skia-web public` (see the `setup:web` script) and served from the site root.
 */
export function loadSkiaWeb(): Promise<void> {
  if (!pending) {
    pending = import('@shopify/react-native-skia/lib/module/web').then(({ LoadSkiaWeb }) =>
      LoadSkiaWeb({ locateFile: (file: string) => `/${file}` }),
    );
  }
  return pending;
}
