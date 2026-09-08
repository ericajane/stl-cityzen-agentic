import { Field, Float, ObjectType } from '@nestjs/graphql';
import type { CsbRequest } from '@org/types';
// `DateTimeScalar` (see ./date-time.scalar.ts) is registered via `@Scalar('DateTime', () => Date)`,
// which maps GraphQL fields whose type function resolves to `Date` onto that scalar. The fields
// below hold raw strings at runtime (not `Date` instances) -- `Date` here is only the lookup key
// NestJS's schema builder uses to find the registered custom scalar, per its documented pattern.

/**
 * GraphQL object type mirroring the shared `CsbRequest` interface field-for-field.
 *
 * Kept as a backend-only class (rather than decorating the shared interface in
 * `libs/shared/types`) because that library is also consumed by the Angular
 * frontend, which should not need a `@nestjs/graphql` dependency.
 *
 * Nullability matches `CsbRequest` exactly: fields typed `string | null` in the
 * shared interface are nullable here; everything else is non-null.
 *
 * The five nullable date fields use the custom `DateTimeScalar` (see
 * `date-time.scalar.ts`) rather than plain `String`, so GraphQL clients get
 * ISO 8601 output when the underlying value is parseable, with a lenient
 * fallback to the raw string for malformed data. REST is unaffected and
 * continues to return the raw string as stored.
 */
@ObjectType('CsbRequest')
export class CsbRequestType implements CsbRequest {
  @Field()
  requestId!: string;

  @Field()
  callerType!: string;

  @Field()
  city!: string;

  @Field(() => Date, { nullable: true })
  dateCancelled!: string | null;

  @Field(() => Date, { nullable: true })
  dateInvtDone!: string | null;

  @Field(() => Date, { nullable: true })
  dateTimeClosed!: string | null;

  @Field(() => Date, { nullable: true })
  dateTimeInit!: string | null;

  @Field()
  description!: string;

  @Field()
  explanation!: string;

  @Field()
  grandparentId!: string;

  @Field()
  grandparentNode!: string;

  @Field()
  group!: string;

  @Field()
  neighborhood!: string;

  @Field()
  parentId!: string;

  @Field()
  parentNode!: string;

  @Field()
  plainEnglishNameForProblemCode!: string;

  @Field(() => Date, { nullable: true })
  prjCompleteDate!: string | null;

  @Field()
  probAddress!: string;

  @Field()
  probAddType!: string;

  @Field()
  problemCode!: string;

  @Field()
  problemsId!: string;

  @Field()
  probZip!: string;

  @Field()
  publicResolution!: string;

  @Field(() => Float, { nullable: true })
  srx!: number | null;

  @Field(() => Float, { nullable: true })
  sry!: number | null;

  @Field()
  status!: string;

  @Field()
  submitTo!: string;

  @Field()
  ward!: string;
}
