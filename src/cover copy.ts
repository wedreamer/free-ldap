import 'reflect-metadata'

const requiredMetadataKey = Symbol("required");

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
    existingRequiredParameters.push(parameterIndex);
    Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value!;

    descriptor.value = function () {
        let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        if (requiredParameters) {
            for (let parameterIndex of requiredParameters) {
                if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                    throw new Error("Missing required argument.");
                }
            }
        }
        return method.apply(this, arguments);
    };
}

class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

class Student {
    name: string;
    age: number;
    id: number;
    constructor(name: string, age: number, id: number) {
        this.name = name;
        this.age = age;
        this.id = id;
    }
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


function CoverAbleClass(): ClassDecorator {
    return target => {
        // 在类上定义元数据，key 为 `CoverAbleType`，value 为 true
        Reflect.defineMetadata('CoverAbleType', true, target);
    };
}

function CoverAbleMethod(): MethodDecorator {
    return (target, key, descriptor) => {
        // key 为函数名 target 为类 
        // 在类的原型属性 'someMethod' 上定义元数据，key 为 `CoverAbleMethod`，value 为 true
        Reflect.defineMetadata('CoverAbleMethod', true, target, key);
        console.log(descriptor.value)
    };
}

@CoverAbleClass()
class TestService {
    type = "report";
    title: string;

    constructor(t: string) {
        this.title = t;
    }

    // @validate
    @CoverAbleMethod()
    async say(@required @required name: string = 'ok'): Promise<Person> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(new Student('okok', 19, 111));
            }, 10);
        });
        return new Person('okok', 1);
    }

    @validate
    print(@required verbose: boolean) {
        if (verbose) {
            return `type: ${this.type}\ntitle: ${this.title}`;
        } else {
            return this.title;
        }
    }

    see(): Person {
        return new Person('okok', 1)
    }
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

const testService = new TestService()
// let metadataValue = Reflect.getMetadata('CoverAbleMethod', testService, "say");
// // metadataValue = Reflect.getMetadata("CoverAbleType", Object.getPrototypeOf(testService).constructor);

const coverfn: ConverAbleFn<Person, Promise<Student>> = async (arg: Person): Promise<Student> => {
    // arg = new Person('okok', 1);
    console.log(arg)
    const retStudent = () =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(new Student('okok', 19, 111));
            }, 10);
        });
    const student = await retStudent() as Student;
    return student;
};

const proxyService = new ConverService<TestService, Student>().attach(testService);
(proxyService.say() as unknown as Promise< ConverObj<Person, Promise<Student>>>).then((obj) => obj.Conert(coverfn).then(console.log));

// const _proxyService = new ConverService<TestService, Student>().attach(testService);
// const _res = _proxyService.see()
// console.log(res)