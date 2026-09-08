import { Test } from '@nestjs/testing';
import { CsbRequestsResolver } from './csb-requests.resolver';
import { CsbRequestsService } from '../csb-requests.service';
import type { CsbRequestSearchResult } from '@org/types';

const mockSearch = jest.fn();

describe('CsbRequestsResolver', () => {
  let resolver: CsbRequestsResolver;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        CsbRequestsResolver,
        { provide: CsbRequestsService, useValue: { search: mockSearch } },
      ],
    }).compile();

    resolver = module.get(CsbRequestsResolver);
  });

  const emptyResult: CsbRequestSearchResult = {
    data: [],
    total: 0,
    page: 1,
    pageSize: 25,
  };

  it('applies default page and pageSize when no input is given', () => {
    mockSearch.mockReturnValue(emptyResult);

    resolver.csbRequests();

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, pageSize: 25 }),
    );
  });

  it('forwards all filter fields from the input', () => {
    mockSearch.mockReturnValue(emptyResult);

    resolver.csbRequests({
      keyword: 'pothole',
      neighborhood: '27',
      ward: '6',
      status: 'OPEN',
      group: 'Streets',
      problemCode: 'POT',
      year: 2025,
      month: 3,
      dateFrom: '2025-01-01',
      dateTo: '2025-12-31',
      page: 2,
      pageSize: 10,
    });

    expect(mockSearch).toHaveBeenCalledWith({
      keyword: 'pothole',
      neighborhood: '27',
      ward: '6',
      status: 'OPEN',
      group: 'Streets',
      problemCode: 'POT',
      year: 2025,
      month: 3,
      dateFrom: '2025-01-01',
      dateTo: '2025-12-31',
      page: 2,
      pageSize: 10,
    });
  });

  it('converts year=0 and month=0 to undefined, same as the REST controller', () => {
    mockSearch.mockReturnValue(emptyResult);

    resolver.csbRequests({ year: 0, month: 0 });

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({ year: undefined, month: undefined }),
    );
  });

  it('caps pageSize at 100, same as the REST controller', () => {
    mockSearch.mockReturnValue(emptyResult);

    resolver.csbRequests({ pageSize: 9999 });

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({ pageSize: 100 }),
    );
  });

  it('leaves an explicit pageSize under the cap untouched', () => {
    mockSearch.mockReturnValue(emptyResult);

    resolver.csbRequests({ pageSize: 10 });

    expect(mockSearch).toHaveBeenCalledWith(
      expect.objectContaining({ pageSize: 10 }),
    );
  });

  it('returns the service result directly', () => {
    const result: CsbRequestSearchResult = {
      data: [{ requestId: 'r1' } as never],
      total: 1,
      page: 1,
      pageSize: 25,
    };
    mockSearch.mockReturnValue(result);

    expect(resolver.csbRequests()).toBe(result);
  });

  it('handles null values in returned records without throwing', () => {
    const result: CsbRequestSearchResult = {
      data: [
        {
          requestId: 'r1',
          callerType: 'Web',
          city: 'St. Louis',
          dateCancelled: null,
          dateInvtDone: null,
          dateTimeClosed: null,
          dateTimeInit: '2025-01-01',
          description: 'desc',
          explanation: 'expl',
          grandparentId: 'g1',
          grandparentNode: 'n1',
          group: 'Streets',
          neighborhood: '27',
          parentId: 'p1',
          parentNode: 'pn1',
          plainEnglishNameForProblemCode: 'Pothole',
          prjCompleteDate: null,
          probAddress: '123 Main St',
          probAddType: 'Address',
          problemCode: 'POT',
          problemsId: 'pr1',
          probZip: '63101',
          publicResolution: '',
          srx: null,
          sry: null,
          status: 'OPEN',
          submitTo: 'Streets Dept',
          ward: '6',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 25,
    };
    mockSearch.mockReturnValue(result);

    const returned = resolver.csbRequests();
    expect(returned.data[0].dateCancelled).toBeNull();
    expect(returned.data[0].srx).toBeNull();
  });
});
