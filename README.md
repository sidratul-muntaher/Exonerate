# Exonerate

`Exonerate` is a customizable validation decorator package designed for use with NestJS and `class-validator`. It allows you to define multiple validation rules in one place, supporting various types such as strings, numbers, arrays, objects, and more, with additional support for nested validation and regex patterns.

## Features

- Validate multiple rules in a single decorator.
  
- Supports data types like `string`, `number`, `array`, and `object`.
  
- Nested object validation.
  
- Regular expression (`regex`) validation.
    

## Installation

```bash

npm install exonerate

### **Usage**

1. **Basic Setup**

To use Exonerate, apply the @Exonerate decorator with your desired rules on your DTO properties.

#### **Example**

`import { Exonerate } from 'exonerate';`

`export class CreateUserDto {`

`@Exonerate({ rules: 'required|string|max:20|min:4' })`

`name: string;`

`@Exonerate({ rules: 'required|email' })`

`email: string;`

`@Exonerate({`

`rules: 'required|max:20|min:8|pattern',`

`regexPattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/`

`})`

`password: string;`

`@Exonerate({ rules: 'required|array', arrayType: 'string' })`

`phone: string[];`

`@Exonerate({ rules: 'optional|date', classType: Date })`

`dob: Date;`

`@Exonerate({ rules: 'required|enum', enumType: ROLE })`

`role: string;`

`@Exonerate({ rules: 'optional|array', arrayType: AddressDto })`

`addresses: AddressDto[];`

`@Exonerate({ rules: 'optional|object', classType: AddressDto })`

`address: AddressDto;`

`}`

2. **Array Validation**

Validate arrays of strings, numbers, or objects using the array rule and specifying the arrayType.

`export class CreateUserDto {`

`@Exonerate({ rules: 'required|array', arrayType: 'string' })`

`phoneNumbers: string[];`

`@Exonerate({ rules: 'required|array', arrayType: Number })`

`ages: number[];`

`@Exonerate({ rules: 'required|array', arrayType: AddressDto })`

`addresses: AddressDto[];`

`}`

3. **Nested Object Validation**

To validate nested objects, use the object rule along with the classType option to specify the class of the nested object.

`export class AddressDto {`

`@Exonerate({ rules: 'required|string' })`

`street: string;`

`@Exonerate({ rules: 'required|string' })`

`city: string;`

`}`

`export class CreateUserDto {`

`@Exonerate({ rules: 'required|object', classType: AddressDto })`

`address: AddressDto;`

`}`

4. **Regex Pattern Validation**

Use the pattern rule to apply regular expression validation to a field.

`export class CreateUserDto {`

`@Exonerate({ rules: 'required|pattern', regexPattern: /^[A-Za-z0-9]+$/ })`

`username: string;`

`}`

5. **Available Validation Rules**

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

##### **Contribution**

Feel free to contribute to the development of this package by opening issues or submitting pull requests.