import 'reflect-metadata';
export interface ConverAbleFn<Form, To> {
    (arg: Form): To;
}
export interface ConverResFn<Form, To> {
    (fn: ConverAbleFn<Form, To>): Promise<To>;
}
export interface ConverObj<Form, To> {
    Conert: ConverResFn<Form, To>;
}
export interface ConverRes<Form, To> {
    (arg: any[]): Promise<ConverObj<Form, To>>;
}
export declare function CoverAbleClass(): ClassDecorator;
export declare function CoverAbleMethod(): MethodDecorator;
export default class ConverService<ServiceType extends object, To> {
    attach(target: ServiceType): ServiceType;
    getHander(): ProxyHandler<ServiceType>;
}
