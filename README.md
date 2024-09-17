
# Exonerate

`Exonerate` is a customizable validation decorator package designed for use with NestJS and `class-validator`. It allows you to define multiple validation rules in one place, supports various types such as strings, numbers, arrays, objects, and more, with additional support for nested validation, regex patterns, and automatically adds Swagger documentation.

## Features

- Validate multiple rules in a single decorator.
- Supports data types like `string`, `number`, `array`, and `object`.
- Nested object validation.
- Automatically integrates Swagger decorators.
- Regular expression (`regex`) validation.
- Custom decorators like `IsInstance` for custom instance validation.
- Built-in support for unique and existence validations for database entities.

## Installation

```bash
npm install exonerate
```

### **Usage**

1. **Basic Setup**

To use `Exonerate`, apply the `@Exonerate` decorator with your desired rules on your DTO properties.

Update your `main.ts` to enable global validation:

```typescript
app.useGlobalPipes(new ValidationPipe());
```

### **.env**

For the `unique` and `exist` validations to work properly, you need to provide database configurations in your `.env` file:

```bash
DB_TYPE=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
ENTITIES_PATH="dist/**/**/*.entity{.ts,.js}" # Adjust path according to your project
```

### AppModule Setup

Ensure you add the following to your `AppModule` for environment configuration:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});
```

### Example Usage

Below is an example DTO class that uses the `@Exonerate` decorator for validation and Swagger documentation:

```typescript
import { Exonerate } from 'exonerate';

export class CreateUserDto {
  @Exonerate({ rules: 'required|string|max:20|min:4|exist:name', entity: User, example: 'JohnDoe' })
  name: string;

  @Exonerate({ rules: 'required|email|unique:email', entity: User, example: 'user@example.com' })
  email: string;

  @Exonerate({
    rules: 'required|max:20|min:8|pattern',
    regexPattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    example: 'Pxdmv48GQPnTfeEl4Jq0'
  })
  password: string;

  @Exonerate({ rules: 'required|array', arrayType: 'string', example: ['1234567890', '0987654321'] })
  phone: string[];

  @Exonerate({ rules: 'optional|date', classType: Date, example: '2024-09-17T04:29:28.529Z' })
  dob: Date;

  @Exonerate({ rules: 'required|enum', enumType: ROLE, example: 'ADMIN' })
  role: string;

  @Exonerate({ rules: 'optional|array', arrayType: AddressDto, example: [{ home: 'string', roadNumber: 'string' }] })
  addresses: AddressDto[];

  @Exonerate({ rules: 'optional|object', classType: AddressDto, example: { home: 'string', roadNumber: 'string' } })
  address: AddressDto;
}
```

### Available Validation Rules

Here is a list of the validation rules that can be used with the `@Exonerate` decorator:

- **required**: Ensures the field is not empty.
- **optional**: Field is optional.
- **email**: Validates an email format.
- **string**: Ensures the field is a string.
- **min**: Validates minimum length for strings or value for numbers.
- **max**: Validates maximum length for strings or value for numbers.
- **int**: Ensures the field is an integer.
- **float**: Ensures the field is a float.
- **number**: Ensures the field is a number.
- **decimal**: Ensures the field is a decimal.
- **date**: Validates a date field.
- **uuid**: Ensures the field is a valid UUID.
- **enum**: Ensures the field is one of the specified enum values.
- **array**: Validates arrays and supports validation of array items (e.g., `string[]`, `number[]`).
- **object**: Validates nested objects using a specified class.
- **pattern**: Validates a field against a regular expression.
- **unique**: Ensures the field is unique in the database (requires an entity and field).
- **exist**: Ensures the field exists in the database (requires an entity and field).

### Contribution

Feel free to contribute to the development of this package by opening issues or submitting pull requests.

---

This README file now reflects the full capabilities of your `@Exonerate` decorator, including its use for both validation and Swagger integration.