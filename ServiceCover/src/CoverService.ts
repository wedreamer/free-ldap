import 'reflect-metadata'

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
    return (target, key, descriptor) => {
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
            get: (target: ServiceType, key: (string | symbol) & keyof ServiceType, receiver: any): ConverRes<any, To> | ServiceType[string & keyof ServiceType] | ServiceType[symbol & keyof ServiceType] => {
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