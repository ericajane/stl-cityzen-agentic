import { Field, InputType, Int } from '@nestjs/graphql';
import type { CsbRequestSearchParams } from '@org/types';

/**
 * Flat input mirroring `CsbRequestSearchParams` 1:1 — filters and pagination
 * live together in one input, matching how the REST controller and
 * `CsbRequestsService.search()` already treat them as a single params bag.
 * All fields are optional, same as the shared interface.
 */
@InputType('CsbRequestSearchInput')
export class CsbRequestSearchInput implements CsbRequestSearchParams {
  @Field({ nullable: true })
  keyword?: string;

  @Field({ nullable: true })
  neighborhood?: string;

  @Field({ nullable: true })
  ward?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  group?: string;

  @Field({ nullable: true })
  problemCode?: string;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => Int, { nullable: true })
  month?: number;

  @Field({ nullable: true })
  dateFrom?: string;

  @Field({ nullable: true })
  dateTo?: string;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;
}
