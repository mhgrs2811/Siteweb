import { assessRisk, type EntityStats } from '../risk';

const base: EntityStats = {
  totalReports: 0,
  recentReports: 0,
  distinctReporters: 0,
  lastReportedAt: null,
  categories: [],
};

describe('assessRisk', () => {
  it('retourne « inconnu » sans signalement', () => {
    const r = assessRisk(base);
    expect(r.level).toBe('unknown');
    expect(r.reasons).toEqual(['no_reports']);
  });

  it("un signalement isolé ne dépasse jamais « faible » (principe de prudence)", () => {
    const r = assessRisk({
      ...base,
      totalReports: 1,
      recentReports: 1,
      distinctReporters: 1,
      lastReportedAt: new Date().toISOString(),
      categories: [{ category: 'phishing', count: 1 }],
    });
    expect(r.level).toBe('low');
  });

  it('plusieurs signaleurs récents → risque élevé', () => {
    const r = assessRisk({
      ...base,
      totalReports: 12,
      recentReports: 6,
      distinctReporters: 9,
      lastReportedAt: new Date().toISOString(),
      categories: [{ category: 'fake_bank', count: 10 }, { category: 'other', count: 2 }],
    });
    expect(r.level).toBe('high');
    expect(r.reasons).toEqual(
      expect.arrayContaining(['many_reports', 'recent_activity', 'multiple_reporters', 'dominant_category']),
    );
  });

  it('des signalements anciens uniquement pondèrent à la baisse', () => {
    const r = assessRisk({
      ...base,
      totalReports: 4,
      recentReports: 0,
      distinctReporters: 3,
      lastReportedAt: '2024-01-01T00:00:00Z',
      categories: [{ category: 'fake_shop', count: 4 }],
    });
    expect(r.level).toBe('moderate');
    expect(r.reasons).toContain('old_reports_only');
  });

  it('le score reste borné entre 0 et 100', () => {
    const r = assessRisk({
      ...base,
      totalReports: 10_000,
      recentReports: 500,
      distinctReporters: 800,
      lastReportedAt: new Date().toISOString(),
      categories: [],
    });
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.level).toBe('high');
  });
});
