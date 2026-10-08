/**
 * Native platforms: Skia is ready as soon as the native module is linked.
 * The web implementation lives in skia-web.web.ts and loads CanvasKit first.
 */
export function loadSkiaWeb(): Promise<void> {
  return Promise.resolve();
}
