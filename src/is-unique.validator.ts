import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';
import { Injectable } from '@nestjs/common';
import {DataSource, Repository} from 'typeorm';
 import * as process from "node:process";
import {join} from "path";


@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
      constructor(
        private dataSource: DataSource
    ) {

    }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const [entityClass, property, isUnique] = args.constraints;
    
        
        if (!this.dataSource) {
            this.dataSource = await new DataSource({
                type: process.env.DB_TYPE === 'mysql' ? 'mysql' : 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: ["dist/**/**/*.entity{.ts,.js}"],
                synchronize: true,
            }).initialize();
    
            if (!this.dataSource) {
                throw new Error('DataSource is not initialized');
            }
        }
    
        const repository: Repository<any> = this.dataSource.getRepository(entityClass);
    
        const entity = await repository.findOne({ where: { [property]: value } });
    
        console.log("Entity found: ", entity);
    
         
        if (isUnique === "unique") {
            console.log(isUnique);
            return !entity;   
        } else if (isUnique === "exist") {
            console.log(isUnique);
            return !!entity;  
        }
    
        
        return false;
    }

    defaultMessage(args: ValidationArguments): string {
        const [entityClass, property] = args.constraints;
        return `${property} must be unique`;
    }
}

export function IsUnique(entityClass: Function, property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entityClass, property, "unique"],
            validator: IsUniqueConstraint,
        });
    };
}

export function IsExist(entityClass: Function, property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entityClass, property, "exist"],
            validator: IsUniqueConstraint,
        });
    };
}
