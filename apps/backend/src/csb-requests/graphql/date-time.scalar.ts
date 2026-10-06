import { Logger } from '@nestjs/common';
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

const logger = new Logger('DateTimeScalar');

/**
 * Lenient `DateTime` scalar for the CSB date fields (`dateCancelled`,
 * `dateInvtDone`, `dateTimeClosed`, `dateTimeInit`, `prjCompleteDate`).
 *
 * The underlying data comes from two upstream sources (CSV export ingestion
 * and the Open311 sync API) with no guaranteed common date format and no
 * validation applied on the way in (see `tools/ingest-csv.ts` and
 * `csb-sync.service.ts`) — so this scalar must never throw on serialize.
 *
 * Behavior:
 *  - `null` in, `null` out.
 *  - A parseable date string is serialized to ISO 8601.
 *  - An unparseable string is passed through unchanged (not null, not an
 *    error) and a warning is logged, so a single malformed row never turns
 *    an entire `csbRequests` query into a 500.
 */
@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, string | null> {
  description =
    'A date/time value. Serializes to ISO 8601 when the underlying value is parseable; ' +
    'otherwise passes the original raw string through unchanged (source data is not ' +
    'guaranteed to be in a consistent format).';

  parseValue(value: unknown): string {
    // Client -> server (used if this scalar is ever accepted as an input).
    return this.toIsoOrRaw(value);
  }

  serialize(value: unknown): string | null {
    // Server -> client (the path used for CsbRequest date fields today).
    if (value === null || value === undefined) return null;
    return this.toIsoOrRaw(value);
  }

  parseLiteral(ast: ValueNode): string | null {
    if (ast.kind !== Kind.STRING) return null;
    return this.toIsoOrRaw(ast.value);
  }

  private toIsoOrRaw(value: unknown): string {
    const raw = String(value);
    const parsed = new Date(raw);

    if (isNaN(parsed.getTime())) {
      logger.warn(`Could not parse date value "${raw}" — returning raw value unchanged`);
      return raw;
    }

    return parsed.toISOString();
  }
}
