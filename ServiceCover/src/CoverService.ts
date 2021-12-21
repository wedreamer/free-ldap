import 'reflect-metadata'
import { ArrayNotEmpty, isArray, isBoolean, isNumber, IsOptional, isString, arrayNotEmpty as isArrayNotEmpty, IsArray, ValidationError, isNotEmpty, isEmpty } from 'class-validator';
import parse from "@captemulation/get-parameter-names"


const requiredMetadataKey = Symbol("required");
const stringMetadataKey = Symbol("string");
const numberMetadataKey = Symbol("number");
const booleanMetadataKey = Symbol("boolean");
const arrayMetadataKey = Symbol("array");
const optionalMetadataKey = Symbol("optional");
const arrayNotEmptyMetadataKey = Symbol("arrayNotEmpty");
const stringArrayMetadataKey = Symbol("stringArray");


export function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function string(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(stringMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(stringMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function array(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(arrayMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(arrayMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function optional(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(optionalMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(optionalMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function arrayNotEmpty(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(arrayNotEmptyMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(arrayNotEmptyMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function number(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(numberMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(numberMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function boolean(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(booleanMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(booleanMetadataKey, existingRequiredParameters, target, propertyKey);
}

export function stringArray(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(stringArrayMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(stringArrayMetadataKey, existingRequiredParameters, target, propertyKey);
}



export function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function & any>) {
    let method = descriptor.value! as Function;
    const params = parse(method)
    const className = target.constructor.name
    const functionName = method.name
    descriptor.value = function () {
        let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        let stringParameters: number[] = Reflect.getOwnMetadata(stringMetadataKey, target, propertyName);
        let numberParameters: number[] = Reflect.getOwnMetadata(numberMetadataKey, target, propertyName);
        let booleanParameters: number[] = Reflect.getOwnMetadata(booleanMetadataKey, target, propertyName);
        let arrayParameters: number[] = Reflect.getOwnMetadata(arrayMetadataKey, target, propertyName);
        let optionalParameters: number[] = Reflect.getOwnMetadata(optionalMetadataKey, target, propertyName);
        let arrayNotEmptyParameters: number[] = Reflect.getOwnMetadata(arrayNotEmptyMetadataKey, target, propertyName);
        let stringArrayParameters: number[] = Reflect.getOwnMetadata(stringArrayMetadataKey, target, propertyName);
        if (optionalParameters) {
            for (let parameterIndex of optionalParameters) {
                const value = arguments[parameterIndex]
                if (isEmpty(value)) {
                    return method.apply(this, arguments);
                }
            }
        }
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                const key = params[parameterIndex]
                const value = arguments[parameterIndex]
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error(`Missing required argument. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                }
            }
        }
        if (stringParameters) {
            for (let parameterIndex of stringParameters) {
                const key = params[parameterIndex]
                const value = arguments[parameterIndex]
                if (!isString(value)) {
                    throw new Error(`isString. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                }
            }
        }
        if (numberParameters) {
            for (let parameterIndex of stringParameters) {
                const key = params[parameterIndex]
                const value = arguments[parameterIndex]
                if (!isNumber(value)) {
                    throw new Error(`isNumber. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                }
            }
        }
        if (booleanParameters) {
            for (let parameterIndex of booleanParameters) {
                const key = params[parameterIndex]
                const value = arguments[parameterIndex]
                if (!isBoolean(value)) {
                    throw new Error(`isBoolean. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                }
            }
        }
        if (arrayParameters) {
            for (let parameterIndex of arrayParameters) {
                const key = params[parameterIndex]
                const value = arguments[parameterIndex]
                if (!isArray(value)) {
                    throw new Error(`isArray. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                }
            }
        }
        if (arrayNotEmptyParameters) {
            for (let parameterIndex of arrayNotEmptyParameters) {
                const key = params[parameterIndex]
                const value = arguments[parameterIndex]
                if (!isArrayNotEmpty(value)) {
                    throw new Error(`isArrayNotEmpty. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                }
            }
        }
        if (stringArrayParameters) {
            for (let parameterIndex of stringArrayParameters) {
                const key = params[parameterIndex]
                const value = arguments[parameterIndex] as string[]
                if (!isArray(value)) {
                    throw new Error(`isArray. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                }
                value.forEach((_, index) => {
                    if (!isString(value[index])) {
                        throw new Error(`array item should be string. key: ${key}, classname: ${className}, function: ${functionName}, value: ${value}`);
                    }
                })
            }
        }
        return method.apply(this, arguments);
    };
}


export interface ConverAbleFn<Form, To> {
    (arg: Form): To;
}

export interface ConverResFn<Form, To> {
    (fn: ConverAbleFn<Form, To>): Promise<To>;
}

export interface ConverObj<Form, To> {
    Conert: ConverResFn<Form, To>
}

export interface ConverRes<Form, To> {
    (arg: any[]): Promise<ConverObj<Form, To>>;
}

export function CoverAbleClass(): ClassDecorator {
    return target => {
        // 在类上定义元数据，key 为 `CoverAbleType`，value 为 true
        Reflect.defineMetadata('CoverAbleType', true, target);
    };
}

export function CoverAbleMethod(): MethodDecorator {
    return (target, key) => {
        // 在类的原型属性 'someMethod' 上定义元数据，key 为 `CoverAbleMethod`，value 为 true
        Reflect.defineMetadata('CoverAbleMethod', true, target, key);
    };
}

export default class ConverService<ServiceType extends object, To> {
    attach(target: ServiceType): ServiceType {
        return new Proxy(target, this.getHander())
    }

    getHander(): ProxyHandler<ServiceType> {
        return {
            get: (target: ServiceType, key: (string | symbol) & keyof ServiceType): ConverRes<any, To> | ServiceType[string & keyof ServiceType] | ServiceType[symbol & keyof ServiceType] => {
                if (target[key] instanceof Function && Reflect.getMetadata("CoverAbleType", Object.getPrototypeOf(target).constructor)) {
                    if (Reflect.getMetadata("CoverAbleMethod", target, key)) {
                        return async function (...args: any[]) {
                            const data = await (target[key] as unknown as Function)(...args);
                            return {
                                Conert: async (fn): Promise<To> => {
                                    const res = await fn(data)
                                    return res;
                                }
                            }
                        }
                    }
                }
                return target[key];
            },
            set: (target: ServiceType, key: string | symbol, value: any, receiver: any): boolean => {
                console.log('set', key, value);
                return Reflect.set(target, key, value, receiver);
            }
        }
    }
}
