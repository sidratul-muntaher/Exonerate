# Exonerate

`Exonerate` is a customizable validation decorator package designed for use with NestJS and `class-validator`. It allows you to define multiple validation rules in one place, supporting various types such as strings, numbers, arrays, objects, and more, with additional support for nested validation and regex patterns.

## Features

- Validate multiple rules in a single decorator.

- Supports data types like `string`, `number`, `array`, and `object`.

- Nested object validation.

- Regular expression (`regex`) validation.

- Custom decorators like `IsInstance` for custom instance validation.

## Installation

```bash
npm install exonerate
```

### **Usage**

1. **Basic Setup**

To use Exonerate, apply the @Exonerate decorator with your desired rules on your DTO properties.

### **.env**

if you want to use `unique` and `exist` keyword in @Exonerate you must add these data to your 
`.env` file

```bash
    DB_TYPE=postgres
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_USERNAME=
    DB_PASSWORD=
    DB_DATABASE=
```

#### **Example**
```bash
import { Exonerate } from 'exonerate';

export class CreateUserDto {
    @Exonerate({ rules: 'required|string|max:20|min:4|exist:name', entity:User })
    name: string;

    @Exonerate({ rules: 'required|email|unique:email', entity:User })
    email: string;

    @Exonerate({
    rules: 'required|max:20|min:8|pattern',
    regexPattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    })
    password: string;

    @Exonerate({ rules: 'required|array', arrayType: 'string' })
    phone: string[];

    @Exonerate({ rules: 'optional|date', classType: Date })
    dob: Date;

    @Exonerate({ rules: 'required|enum', enumType: ROLE })
    role: string;

    @Exonerate({ rules: 'optional|array', arrayType: AddressDto })
    addresses: AddressDto[];

    @Exonerate({ rules: 'optional|object', classType: AddressDto })
    address: AddressDto;

}
```


**Available Validation Rules**

<mark>required</mark>: Ensures the field is not empty.

<mark>optional</mark>: Field is optional.

<mark>email</mark>: Validates an email format.

<mark>string</mark>: Ensures the field is a string.

<mark>min</mark>: Validates minimum length for strings or value for numbers.

<mark>max</mark>: Validates maximum length for strings or value for numbers.

<mark>int</mark>: Ensures the field is an integer.

<mark>float</mark>: Ensures the field is a float.

<mark>date</mark>: Validates a date field.

<mark>uuid</mark>: Ensures the field is a valid UUID.

<mark>enum</mark>: Ensures the field is one of the specified enum values.

<mark>array</mark>: Validates arrays and supports validation of array items.

<mark>object</mark>: Validates nested objects using a specified class.

<mark>pattern</mark>: Validates a field against a regular expression.

##### **Contribution**

Feel free to contribute to the development of this package by opening issues or submitting pull requests.
