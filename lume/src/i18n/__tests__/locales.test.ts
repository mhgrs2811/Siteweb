import en from '../locales/en.json';
import fr from '../locales/fr.json';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      out.set(path, value);
    } else {
      for (const [childPath, childValue] of flatten(value, path)) {
        out.set(childPath, childValue);
      }
    }
  }
  return out;
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g)].map((m) => m[1] ?? '').sort();
}

const frFlat = flatten(fr as Tree);
const enFlat = flatten(en as Tree);

describe('locale files', () => {
  it('declare exactly the same keys in French and English', () => {
    const frKeys = [...frFlat.keys()].sort();
    const enKeys = [...enFlat.keys()].sort();
    expect(enKeys).toEqual(frKeys);
  });

  it.each([...frFlat.entries()])('fr %s is not empty', (_key, value) => {
    expect(value.trim().length).toBeGreaterThan(0);
  });

  it.each([...enFlat.entries()])('en %s is not empty', (_key, value) => {
    expect(value.trim().length).toBeGreaterThan(0);
  });

  it.each([...frFlat.keys()])('%s uses the same placeholders in both languages', (key) => {
    expect(placeholders(enFlat.get(key) ?? '')).toEqual(placeholders(frFlat.get(key) ?? ''));
  });

  it('keeps plural forms paired (_one / _other)', () => {
    for (const key of frFlat.keys()) {
      if (key.endsWith('_one')) {
        expect(frFlat.has(key.replace(/_one$/, '_other'))).toBe(true);
      }
    }
  });
});
