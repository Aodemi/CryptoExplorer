import { computeSMA, computeVolatility, calculerNoteCrypto } from '../services/crypto.service';

describe('Services crypto - fonctions utilitaires', () => {
  it('computeSMA calcule correctement', () => {
    const result = computeSMA([1,2,3,4], 2);
    expect(result).toEqual([1.5, 2.5, 3.5]);
  });

  it('computeVolatility retourne un nombre >= 0', () => {
    const v = computeVolatility([10, 12, 8, 10, 9]);
    expect(typeof v).toBe('number');
    expect(v).toBeGreaterThanOrEqual(0);
  });

  it('calculerNoteCrypto lève une erreur si historique vide', () => {
    expect(() => calculerNoteCrypto('btc', [])).toThrow();
  });

  it('calculerNoteCrypto retourne un score et un message', () => {
    const hist = [10, 11, 12, 13, 14, 15];
    const note = calculerNoteCrypto('btc', hist);
    expect(note.coinId).toBe('btc');
    expect(note.score).toBeGreaterThanOrEqual(0);
    expect(note.score).toBeLessThanOrEqual(100);
    expect(typeof note.message).toBe('string');
    expect(note.variation).toBeGreaterThan(0);
  });
});
