"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
class Student {
    constructor(name, age, id) {
        this.name = name;
        this.age = age;
        this.id = id;
    }
}
function CoverAbleClass() {
    return target => {
        // 在类上定义元数据，key 为 `CoverAbleType`，value 为 true
        Reflect.defineMetadata('CoverAbleType', true, target);
    };
}
function CoverAbleMethod() {
    return (target, key, descriptor) => {
        // 在类的原型属性 'someMethod' 上定义元数据，key 为 `CoverAbleMethod`，value 为 true
        Reflect.defineMetadata('CoverAbleMethod', true, target, key);
    };
}
let TestService = class TestService {
    say() {
        return new Person('okok', 1);
    }
    see() {
        return new Person('okok', 1);
    }
};
__decorate([
    CoverAbleMethod(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Person)
], TestService.prototype, "say", null);
TestService = __decorate([
    CoverAbleClass()
], TestService);
class ConverService {
    attach(target) {
        return new Proxy(target, this.getHander());
    }
    getHander() {
        return {
            get: (target, key, receiver) => {
                if (target[key] instanceof Function && Reflect.getMetadata("CoverAbleType", Object.getPrototypeOf(target).constructor)) {
                    if (Reflect.getMetadata("CoverAbleMethod", target, key)) {
                        return function (...args) {
                            console.log('before');
                            const data = target[key](args);
                            console.log('after');
                            return {
                                Conert: async (fn) => {
                                    const res = await fn(data);
                                    return res;
                                }
                            };
                        };
                    }
                }
                return target[key];
            },
            set: (target, key, value, receiver) => {
                console.log('set', key, value);
                return Reflect.set(target, key, value, receiver);
            }
        };
    }
}
const testService = new TestService();
// let metadataValue = Reflect.getMetadata('CoverAbleMethod', testService, "say");
// // metadataValue = Reflect.getMetadata("CoverAbleType", Object.getPrototypeOf(testService).constructor);
// const coverfn: ConverAbleFn<Person, Student> = (arg: Person): Student => {
//     arg = new Person('okok', 1);
//     return new Student('okok', 19, 111)
// }
// const proxyService = new ConverService<TestService, Student>().attach(testService);
// const res = (proxyService.say() as unknown as ConverObj<Person, Student>).Conert(coverfn)
// const _proxyService = new ConverService<TestService, Student>().attach(testService);
// const _res = _proxyService.see()
// console.log(_res)
//# sourceMappingURL=cover.js.map