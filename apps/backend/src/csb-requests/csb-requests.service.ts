import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import proj4 from 'proj4';
import { DATABASE_TOKEN } from '../database/database.module';
import { NeighborhoodLookupService } from '../neighborhoods/neighborhood-lookup.service';
import type {
  CsbRequest,
  CsbRequestSearchParams,
  CsbRequestSearchResult,
  CsbFilterOptions,
  MonthlyCount,
  GroupCount,
  MapPoint,
} from '@org/types';

// Web Mercator — matches srx/sry in the database (see neighborhood-lookup.service.ts).
const WEB_MERCATOR =
  '+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 ' +
  '+x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs';
const WGS84 = '+proj=longlat +datum=WGS84 +no_defs';
const toWgs84 = proj4(WEB_MERCATOR, WGS84);

/**
 * Repairs known data-quality issues in raw srx/sry (Web Mercator) coordinates
 * before conversion:
 * - null/null (no coordinates captured): passed through as null.
 * - 0/0 (true junk, not a real location): treated as unrecoverable, returns null.
 * - positive srx (sign-flipped — St. Louis srx is always negative/west of the
 *   prime meridian): sign is flipped back to repair the value.
 * - otherwise: returned unchanged.
 */
export function repairMercatorPoint(
  srx: number | null,
  sry: number | null,
): { x: number; y: number } | null {
  if (srx === null || sry === null) return null;
  if (srx === 0 && sry === 0) return null;
  if (srx > 0) return { x: -srx, y: sry };
  return { x: srx, y: sry };
}

/**
 * Normalizes a raw neighborhood string to a zero-padded 2-digit code (e.g. "01", "27"),
 * or null for junk values (non-numeric, out-of-range, whitespace-only, etc.).
 */
export function normalizeNeighborhood(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/\s+/g, '').replace(/o$/i, '0');
  if (!/^\d+$/.test(cleaned)) return null;
  const n = parseInt(cleaned, 10);
  if (n < 1 || n > 99) return null;
  return cleaned.padStart(2, '0');
}

/** Maps DB snake_case column names to CsbRequest camelCase fields. */
function rowToRequest(row: Record<string, unknown>): CsbRequest {
  return {
    requestId: row['request_id'] as string,
    callerType: row['caller_type'] as string,
    city: row['city'] as string,
    dateCancelled: (row['date_cancelled'] as string) || null,
    dateInvtDone: (row['date_invt_done'] as string) || null,
    dateTimeClosed: (row['date_time_closed'] as string) || null,
    dateTimeInit: (row['date_time_init'] as string) || null,
    description: row['description'] as string,
    explanation: row['explanation'] as string,
    grandparentId: row['grandparent_id'] as string,
    grandparentNode: row['grandparent_node'] as string,
    group: row['group_name'] as string,
    neighborhood: row['neighborhood'] as string,
    parentId: row['parent_id'] as string,
    parentNode: row['parent_node'] as string,
    plainEnglishNameForProblemCode: row['plain_english_name'] as string,
    prjCompleteDate: (row['prj_complete_date'] as string) || null,
    probAddress: row['prob_address'] as string,
    probAddType: row['prob_add_type'] as string,
    problemCode: row['problem_code'] as string,
    problemsId: row['problems_id'] as string,
    probZip: row['prob_zip'] as string,
    publicResolution: row['public_resolution'] as string,
    srx: row['srx'] as number | null,
    sry: row['sry'] as number | null,
    status: row['status'] as string,
    submitTo: row['submit_to'] as string,
    ward: row['ward'] as string,
  };
}

@Injectable()
export class CsbRequestsService implements OnModuleInit {
  private readonly logger = new Logger(CsbRequestsService.name);

  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Database.Database,
    private readonly neighborhoodLookup: NeighborhoodLookupService,
  ) {}

  onModuleInit() {
    const result = this.db
      .prepare('SELECT COUNT(*) as n FROM csb_requests')
      .get() as { n: number };
    this.logger.log(
      result.n > 0
        ? `SQLite ready — ${result.n.toLocaleString()} records`
        : 'SQLite ready — database is empty. Run: npx nx run backend:ingest',
    );
    this.migrateNeighborhoods();
  }

  /**
   * One-time migration: normalizes all neighborhood values in the DB to a
   * consistent zero-padded 2-digit format (e.g. "1" → "01", "5 1" → "51",
   * "56o" → null). Runs at startup; skips records that are already correct.
   */
  private migrateNeighborhoods(): void {
    const rows = this.db
      .prepare(
        "SELECT DISTINCT neighborhood FROM csb_requests WHERE neighborhood IS NOT NULL AND neighborhood != ''",
      )
      .all() as { neighborhood: string }[];

    const update = this.db.prepare(
      'UPDATE csb_requests SET neighborhood = ? WHERE neighborhood = ?',
    );

    let changed = 0;
    const migrate = this.db.transaction(() => {
      for (const { neighborhood } of rows) {
        const normalized = normalizeNeighborhood(neighborhood);
        if (normalized !== neighborhood) {
          update.run(normalized, neighborhood);
          changed++;
        }
      }
    });
    migrate();

    if (changed > 0) {
      this.logger.log(`Neighborhood migration: normalized ${changed} distinct value(s)`);
    }
  }

  search(params: CsbRequestSearchParams): CsbRequestSearchResult {
    const {
      keyword,
      neighborhood,
      ward,
      status,
      group,
      problemCode,
      year,
      month,
      dateFrom,
      dateTo,
      page = 1,
      pageSize = 25,
    } = params;

    const conditions: string[] = [];
    const bindings: unknown[] = [];

    if (keyword) {
      conditions.push(`(
        description       LIKE ? OR
        plain_english_name LIKE ? OR
        prob_address      LIKE ? OR
        public_resolution LIKE ? OR
        request_id        LIKE ?
      )`);
      const kw = `%${keyword}%`;
      bindings.push(kw, kw, kw, kw, kw);
    }
    if (neighborhood) { conditions.push('neighborhood = ?'); bindings.push(neighborhood); }
    if (ward)         { conditions.push('ward = ?');         bindings.push(ward); }
    if (status)       { conditions.push('status = ?');       bindings.push(status); }
    if (group)        { conditions.push('group_name = ?');   bindings.push(group); }
    if (problemCode)  { conditions.push('problem_code = ?'); bindings.push(problemCode); }
    if (year)         { conditions.push("CAST(strftime('%Y', date_time_init) AS INTEGER) = ?"); bindings.push(year); }
    if (month)        { conditions.push("CAST(strftime('%m', date_time_init) AS INTEGER) = ?"); bindings.push(month); }
    if (dateFrom)     { conditions.push('date_time_init >= ?'); bindings.push(dateFrom); }
    if (dateTo)       { conditions.push('date_time_init <= ?'); bindings.push(dateTo); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * pageSize;

    const total = (
      this.db.prepare(`SELECT COUNT(*) as n FROM csb_requests ${where}`).get(...bindings) as { n: number }
    ).n;

    const rows = this.db
      .prepare(
        `SELECT * FROM csb_requests ${where}
         ORDER BY date_time_init DESC
         LIMIT ? OFFSET ?`,
      )
      .all(...bindings, pageSize, offset) as Record<string, unknown>[];

    return { data: rows.map(rowToRequest), total, page, pageSize };
  }

  getMonthlyStats(neighborhood?: string): MonthlyCount[] {
    const conditions = [
      "date_time_init IS NOT NULL AND date_time_init != ''",
      "strftime('%Y-%m', date_time_init) < strftime('%Y-%m', 'now')",
    ];
    const bindings: unknown[] = [];
    if (neighborhood) {
      conditions.push('neighborhood = ?');
      bindings.push(neighborhood);
    }

    const rows = this.db
      .prepare(`
        SELECT
          CAST(strftime('%Y', date_time_init) AS INTEGER) AS year,
          CAST(strftime('%m', date_time_init) AS INTEGER) AS month,
          COUNT(*) AS count
        FROM csb_requests
        WHERE ${conditions.join(' AND ')}
        GROUP BY year, month
        ORDER BY year, month
      `)
      .all(...bindings) as { year: number; month: number; count: number }[];

    return rows.map(({ year, month, count }) => ({
      year,
      month,
      label: new Date(year, month - 1).toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      count,
    }));
  }

  getFilterOptions(): CsbFilterOptions {
    const distinct = (col: string): string[] =>
      (
        this.db
          .prepare(
            `SELECT DISTINCT ${col} FROM csb_requests
             WHERE ${col} IS NOT NULL AND ${col} != ''
             ORDER BY ${col}`,
          )
          .all() as Record<string, string>[]
      ).map((r) => r[col]);

    const years = (
      this.db
        .prepare(
          `SELECT DISTINCT CAST(strftime('%Y', date_time_init) AS INTEGER) AS year
           FROM csb_requests
           WHERE date_time_init IS NOT NULL AND date_time_init != ''
           ORDER BY year DESC`,
        )
        .all() as { year: number }[]
    ).map((r) => r.year);

    return {
      neighborhoods: distinct('neighborhood'),
      wards: distinct('ward'),
      statuses: distinct('status'),
      groups: distinct('group_name'),
      problemCodes: distinct('problem_code'),
      years,
    };
  }

  /**
   * Fills in the neighborhood column for records that have srx/sry coordinates
   * but no neighborhood value. Returns the number of records updated.
   */
  backfillNeighborhoods(): number {
    const rows = this.db
      .prepare(
        `SELECT request_id, srx, sry FROM csb_requests
         WHERE (neighborhood IS NULL OR neighborhood = '')
           AND srx IS NOT NULL AND sry IS NOT NULL`,
      )
      .all() as { request_id: string; srx: number; sry: number }[];

    const update = this.db.prepare(
      'UPDATE csb_requests SET neighborhood = ? WHERE request_id = ?',
    );

    let updated = 0;
    const run = this.db.transaction(() => {
      for (const row of rows) {
        const code = this.neighborhoodLookup.lookup(row.srx, row.sry);
        if (code) {
          update.run(code, row.request_id);
          updated++;
        }
      }
    });
    run();

    this.logger.log(
      `Neighborhood backfill: ${updated} of ${rows.length} records updated`,
    );
    return updated;
  }

  /**
   * Returns request locations as WGS84 lat/lng points for the map view.
   * Rows with unrecoverable coordinates (null/null or true 0/0) are excluded.
   * Sign-flipped srx values are repaired before conversion (see repairMercatorPoint).
   */
  getMapPoints(params: {
    neighborhood?: string;
    ward?: string;
    status?: string;
    group?: string;
    problemCode?: string;
    year?: number;
    month?: number;
  }): MapPoint[] {
    const { neighborhood, ward, status, group, problemCode, year, month } = params;

    const conditions: string[] = ['srx IS NOT NULL AND sry IS NOT NULL'];
    const bindings: unknown[] = [];

    if (neighborhood) { conditions.push('neighborhood = ?'); bindings.push(neighborhood); }
    if (ward)         { conditions.push('ward = ?');         bindings.push(ward); }
    if (status)       { conditions.push('status = ?');       bindings.push(status); }
    if (group)        { conditions.push('group_name = ?');   bindings.push(group); }
    if (problemCode)  { conditions.push('problem_code = ?'); bindings.push(problemCode); }
    if (year)         { conditions.push("CAST(strftime('%Y', date_time_init) AS INTEGER) = ?"); bindings.push(year); }
    if (month)        { conditions.push("CAST(strftime('%m', date_time_init) AS INTEGER) = ?"); bindings.push(month); }

    const rows = this.db
      .prepare(
        `SELECT request_id, srx, sry, neighborhood, ward, plain_english_name,
                prob_address, status, date_time_init
         FROM csb_requests
         WHERE ${conditions.join(' AND ')}`,
      )
      .all(...bindings) as Record<string, unknown>[];

    const points: MapPoint[] = [];
    for (const row of rows) {
      const repaired = repairMercatorPoint(row['srx'] as number, row['sry'] as number);
      if (!repaired) continue;

      const [lng, lat] = toWgs84.forward([repaired.x, repaired.y]);
      points.push({
        requestId: row['request_id'] as string,
        lat,
        lng,
        neighborhood: (row['neighborhood'] as string) || null,
        ward: (row['ward'] as string) || null,
        problemName: (row['plain_english_name'] as string) || null,
        address: (row['prob_address'] as string) || null,
        status: (row['status'] as string) || null,
        dateTimeInit: (row['date_time_init'] as string) || null,
      });
    }

    return points;
  }

  getGroupStats(neighborhood?: string, year?: number, month?: number): GroupCount[] {
    const conditions: string[] = [
      "group_name IS NOT NULL AND group_name != ''",
    ];
    const bindings: unknown[] = [];

    if (neighborhood) { conditions.push('neighborhood = ?');                                          bindings.push(neighborhood); }
    if (year)         { conditions.push("CAST(strftime('%Y', date_time_init) AS INTEGER) = ?");       bindings.push(year); }
    if (month)        { conditions.push("CAST(strftime('%m', date_time_init) AS INTEGER) = ?");       bindings.push(month); }

    return (
      this.db
        .prepare(
          `SELECT group_name AS \`group\`, COUNT(*) AS count
           FROM csb_requests
           WHERE ${conditions.join(' AND ')}
           GROUP BY group_name
           ORDER BY count DESC`,
        )
        .all(...bindings) as GroupCount[]
    );
  }
}
