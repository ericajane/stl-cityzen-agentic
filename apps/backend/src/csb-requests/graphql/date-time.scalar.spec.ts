import { Logger } from '@nestjs/common';
import { Kind } from 'graphql';
import { DateTimeScalar } from './date-time.scalar';

describe('DateTimeScalar', () => {
  let scalar: DateTimeScalar;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    scalar = new DateTimeScalar();
    warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  describe('serialize (server -> client, the path used for CsbRequest fields)', () => {
    it('returns null unchanged', () => {
      expect(scalar.serialize(null)).toBeNull();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('returns undefined as null', () => {
      expect(scalar.serialize(undefined)).toBeNull();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('serializes a valid ISO date string to ISO 8601', () => {
      expect(scalar.serialize('2025-03-01')).toBe(new Date('2025-03-01').toISOString());
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('serializes a valid date-time string to ISO 8601', () => {
      const input = '2025-03-01T10:15:00Z';
      expect(scalar.serialize(input)).toBe(new Date(input).toISOString());
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('serializes a common US-format date string to ISO 8601', () => {
      const input = '03/01/2025';
      expect(scalar.serialize(input)).toBe(new Date(input).toISOString());
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('falls back to the raw string for an unparseable value, without throwing, and logs a warning', () => {
      expect(() => scalar.serialize('not-a-real-date')).not.toThrow();
      expect(scalar.serialize('not-a-real-date')).toBe('not-a-real-date');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('not-a-real-date'),
      );
    });

    it('falls back to the raw string for an empty string and logs a warning', () => {
      expect(scalar.serialize('')).toBe('');
      expect(warnSpy).toHaveBeenCalled();
    });

    it('falls back to the raw string for garbled/partial data and logs a warning', () => {
      expect(scalar.serialize('2025-13-45garbage')).toBe('2025-13-45garbage');
      expect(warnSpy).toHaveBeenCalled();
    });
  });

  describe('parseValue (client -> server)', () => {
    it('parses a valid ISO string to ISO 8601', () => {
      expect(scalar.parseValue('2025-03-01')).toBe(new Date('2025-03-01').toISOString());
    });

    it('falls back to the raw string for an unparseable value', () => {
      expect(scalar.parseValue('garbage')).toBe('garbage');
      expect(warnSpy).toHaveBeenCalled();
    });
  });

  describe('parseLiteral (client -> server, from a GraphQL query AST)', () => {
    it('parses a valid string literal to ISO 8601', () => {
      const ast = { kind: Kind.STRING, value: '2025-03-01' } as never;
      expect(scalar.parseLiteral(ast)).toBe(new Date('2025-03-01').toISOString());
    });

    it('falls back to the raw string for a malformed string literal', () => {
      const ast = { kind: Kind.STRING, value: 'garbage' } as never;
      expect(scalar.parseLiteral(ast)).toBe('garbage');
      expect(warnSpy).toHaveBeenCalled();
    });

    it('returns null for a non-string literal (e.g. an int) without logging a warning', () => {
      const ast = { kind: Kind.INT, value: '123' } as never;
      expect(scalar.parseLiteral(ast)).toBeNull();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
