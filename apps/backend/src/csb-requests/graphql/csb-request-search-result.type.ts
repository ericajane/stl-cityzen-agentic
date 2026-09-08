import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { CsbRequestSearchResult } from '@org/types';
import { CsbRequestType } from './csb-request.type';

@ObjectType('CsbRequestSearchResult')
export class CsbRequestSearchResultType implements CsbRequestSearchResult {
  @Field(() => [CsbRequestType])
  data!: CsbRequestType[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;
}
