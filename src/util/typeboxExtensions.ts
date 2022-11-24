import {
  TNumber,
  TInteger,
  TSchema,
  Kind,
  SchemaOptions,
  TNumeric,
} from '@sinclair/typebox';

export function convertNumericTypeV6ToV4(input: TInteger): TIntegerV4;
export function convertNumericTypeV6ToV4(input: TNumber): TNumberV4;
export function convertNumericTypeV6ToV4(input: TNumeric): TNumericV4 {
  const { exclusiveMinimum, exclusiveMaximum, minimum, maximum, ...rest } =
    input;

  const output = {
    ...rest,
    maximum: exclusiveMaximum ?? maximum,
    minimum: exclusiveMinimum ?? minimum,
    exclusiveMaximum: exclusiveMaximum ? true : false,
    exclusiveMinimum: exclusiveMinimum ? true : false,
  };
  return output as typeof output & TSchema;
}

export interface NumericOptionsV4 extends SchemaOptions {
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  maximum?: number;
  minimum?: number;
  multipleOf?: number;
}

export interface TIntegerV4 extends TSchema, NumericOptionsV4 {
  [Kind]: 'Integer';
  static: number;
  type: 'integer';
}

export interface TNumberV4 extends TSchema, NumericOptionsV4 {
  [Kind]: 'Number';
  static: number;
  type: 'number';
}

export type TNumericV4 = TIntegerV4 | TNumberV4;
