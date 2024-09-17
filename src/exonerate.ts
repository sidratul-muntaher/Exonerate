import {
  IsDate,
  IsDecimal,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidationOptions,
  ValidateNested,
  IsArray,
  IsNumber,
  Matches,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsExist, IsUnique } from './is-unique.validator';
import {Type} from "class-transformer";

type ValidationRule =
    | 'required'
    | 'email'
    | 'string'
    | 'unique'
    | 'exist'
    | 'enum'
    | 'max'
    | 'min'
    | 'float'
    | 'int'
    | 'number'
    | 'decimal'
    | 'date'
    | 'uuid'
    | 'optional'
    | 'object'
    | 'array'
    | 'pattern';

export function Exonerate({
                            rules,
                            enumType,
                            validationOption,
                            classType,
                            arrayType,
                            regexPattern,
                            entity,
                            example,
                          }: {
  rules: string;
  enumType?: object;
  validationOption?: ValidationOptions;
  classType?: Function;
  arrayType?: Function | string | 'number';
  regexPattern?: RegExp;
  entity?: Function;
  example?: any;
}) {
  const decorators = rules
      .split('|')
      .map((rule) => {
        const [ruleName, arg] = rule.split(':');

        switch (ruleName as ValidationRule) {
          case 'required':
            return [IsNotEmpty(validationOption), ApiProperty({ example })];
          case 'optional':
            return [IsOptional(validationOption), ApiPropertyOptional({ example })];
          case 'email':
            return [IsEmail({}, validationOption), ApiProperty({ format: 'email', example })];
          case 'string':
            return [IsString(validationOption), ApiProperty({ type: 'string', example })];
          case 'pattern':
            if (!regexPattern) throw new Error('Regex pattern is required for regex validation');
            return [Matches(regexPattern, validationOption), ApiProperty({ pattern: regexPattern.toString().substring(1), example })];
          case 'min':
            if (!arg) throw new Error('Min length is required');
            return [MinLength(parseInt(arg), validationOption), ApiProperty({ minLength: parseInt(arg), example })];
          case 'max':
            if (!arg) throw new Error('Max length is required');
            return [MaxLength(parseInt(arg), validationOption), ApiProperty({ maxLength: parseInt(arg), example })];
          case 'enum':
            if (!enumType) throw new Error('Enum type is required for enum validation');
            return [IsEnum(enumType, validationOption), ApiProperty({ enum: Object.values(enumType), example })];
          case 'float':
            return [IsDecimal({}, validationOption), ApiProperty({ type: 'number', format: 'float', example })];
          case 'int':
            return [IsInt(validationOption), ApiProperty({ type: 'integer', example })];
          case 'number':
            return [IsNumber({}, validationOption), ApiProperty({ type: 'number', example })];
          case 'decimal':
            return [IsDecimal({}, validationOption), ApiProperty({ type: 'number', format: 'decimal', example })];
          case 'date':
            return [Type(() => Date), IsDate(validationOption), ApiProperty({ type: 'string', format: 'date-time', example })];
          case 'uuid':
            return [IsUUID('4', validationOption), ApiProperty({ format: 'uuid', example })];
          case 'unique':
            if (!entity || !arg) throw new Error('Entity and field name are required for unique validation');
            return [IsUnique(entity, arg, validationOption), ApiProperty({ uniqueItems: true, example })];
          case 'exist':
            if (!entity || !arg) throw new Error('Entity and field name are required for exist validation');
            return [IsExist(entity, arg, { message: `${arg} must exist in database` }), ApiProperty({ example })];
          case 'object':
            if (!classType) throw new Error('Class type is required for instance validation');
            return [Type(() => classType), ValidateNested(validationOption), ApiProperty({ type: () => classType, example })];
          case 'array':
            if (!arrayType) throw new Error('Array type is required');
            const arrayDecorators = [IsArray(validationOption), ApiProperty({ type: 'array', example })];

            if (arrayType === 'string') {
              arrayDecorators.push(IsString({ each: true }), ApiProperty({ type: 'string', isArray: true, example }));
            } else if (arrayType === 'number') {
              arrayDecorators.push(IsNumber({}, { each: true }), ApiProperty({ type: 'number', isArray: true, example }));
            } else if (typeof arrayType === 'function') {
              arrayDecorators.push(
                  ValidateNested({ each: true }),
                  Type(() => arrayType),
                  ApiProperty({ type: () => arrayType, isArray: true, example })
              );
            }

            return arrayDecorators;
          default:
            throw new Error(`Unknown validation rule: ${ruleName}`);
        }
      })
      .flat()
      .filter(Boolean);

  return applyDecorators(...(decorators) as any[]);
}
