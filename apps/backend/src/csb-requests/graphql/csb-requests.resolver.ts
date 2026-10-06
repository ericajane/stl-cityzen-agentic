import { Args, Query, Resolver } from '@nestjs/graphql';
import type { CsbRequestSearchParams } from '@org/types';
import { CsbRequestsService } from '../csb-requests.service';
import { CsbRequestSearchInput } from './csb-request-search.input';
import { CsbRequestSearchResultType } from './csb-request-search-result.type';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

@Resolver(() => CsbRequestSearchResultType)
export class CsbRequestsResolver {
  constructor(private readonly csbRequestsService: CsbRequestsService) {}

  /**
   * GraphQL counterpart to `GET /api/csb-requests`. Reuses
   * `CsbRequestsService.search()` directly -- no duplicated filtering/SQL logic.
   * Defaults and the pageSize cap mirror the REST controller exactly so both
   * transports behave identically for the same inputs.
   */
  @Query(() => CsbRequestSearchResultType, { name: 'csbRequests' })
  csbRequests(
    @Args('input', { type: () => CsbRequestSearchInput, nullable: true })
    input?: CsbRequestSearchInput,
  ): CsbRequestSearchResultType {
    const params: CsbRequestSearchParams = {
      keyword: input?.keyword,
      neighborhood: input?.neighborhood,
      ward: input?.ward,
      status: input?.status,
      group: input?.group,
      problemCode: input?.problemCode,
      year: input?.year || undefined,
      month: input?.month || undefined,
      dateFrom: input?.dateFrom,
      dateTo: input?.dateTo,
      page: input?.page ?? DEFAULT_PAGE,
      pageSize: Math.min(input?.pageSize ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    };

    return this.csbRequestsService.search(params);
  }
}
