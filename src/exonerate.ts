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

type ValidationRule =
    | 'required'
    | 'email'
    | 'string'
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
                            regexPattern
                          }: {
  rules: string;
  enumType?: object;
  validationOption?: ValidationOptions;
  classType?: Function;
  arrayType?:Function | string  ;
  regexPattern?:RegExp
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

@ValidatorConstraint({ name: 'isInstance', async: false })
export class IsInstanceConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const [target] = args.constraints;
    return value instanceof target;
  }

  defaultMessage(args: ValidationArguments): string {
    const [target] = args.constraints;
    return `The value must be an instance of ${target.name}`;
  }
}

export function IsInstance(
    target: Function,
    validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [target],
      validator: IsInstanceConstraint,
    });
  };
}

