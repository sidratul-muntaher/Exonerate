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
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments, ValidateNested, IsArray, IsNumber, Matches,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import {Type} from "class-transformer";
import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import {IsExist, IsUnique} from "./is-unique.validator";

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
                          }: {
  rules: string;
  enumType?: object;
  validationOption?: ValidationOptions;
  classType?: Function;
  arrayType?:Function | string  ;
  regexPattern?:RegExp,
  entity?: Function;
}) {
  const decorators = rules
      .split('|')
      .map((rule) => {
        const [ruleName, arg] = rule.split(':');

        switch (ruleName as ValidationRule) {
          case 'required':
            return IsNotEmpty(validationOption);
          case 'optional':
            return IsOptional(validationOption);
          case 'email':
            return IsEmail({}, validationOption);
          case 'string':
            return IsString(validationOption);
          case "pattern":
            if (!regexPattern)
              throw new Error('Regex pattern is required for regex validation');
            return Matches(regexPattern, validationOption);
          case 'min':
            if (!arg) throw new Error(`Min length is required`);
            return MinLength(parseInt(arg), validationOption);
          case 'max':
            if (!arg) throw new Error(`Max length is required`);
            return MaxLength(parseInt(arg), validationOption);
          case 'enum':
            if (!enumType)
              throw new Error('Enum type is required for enum validation');
            return IsEnum(enumType, validationOption);
          case 'float':
            return IsDecimal({}, validationOption);
          case 'int':
            return IsInt(validationOption);
          case 'date':
            return [Type(() => classType), IsDate(validationOption)];
          case 'uuid':
            return IsUUID('4', validationOption);
          case 'unique':
            if (!entity || !arg) {
              throw new Error('Entity and field name are required for unique validation');
            }
            return IsUnique(entity, arg, validationOption);
            case 'exist':
            if (!entity || !arg) {
              throw new Error('Entity and field name are required for unique validation');
            }
            return IsExist(entity, arg, {message:`${arg} must be exist in database`});
          case 'object':
            if (!classType)
              throw new Error('Class type is required for instance validation');
            return [Type(() => classType), ValidateNested(validationOption)];
          case 'array':
            if (!arrayType) throw new Error('Array type is required');
            const arrayDecorators = [IsArray(validationOption)];

            if (arrayType === 'string') {
              arrayDecorators.push(IsString({ each: true }));
            } else if (typeof arrayType === 'function') {
              arrayDecorators.push(
                  ValidateNested({ each: true }),
                  Type(() => arrayType)
              );
            }

            return arrayDecorators;
          default:
            throw new Error(`Unknown validation rule: ${ruleName}`);
        }
      })
      .flat()
      .filter(Boolean);

  return applyDecorators(...decorators);
}
