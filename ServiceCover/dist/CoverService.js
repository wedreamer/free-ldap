"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverAbleMethod = exports.CoverAbleClass = void 0;
require("reflect-metadata");
function CoverAbleClass() {
    return target => {
        // 在类上定义元数据，key 为 `CoverAbleType`，value 为 true
        Reflect.defineMetadata('CoverAbleType', true, target);
    };
}
exports.CoverAbleClass = CoverAbleClass;
function CoverAbleMethod() {
    return (target, key) => {
        // 在类的原型属性 'someMethod' 上定义元数据，key 为 `CoverAbleMethod`，value 为 true
        Reflect.defineMetadata('CoverAbleMethod', true, target, key);
    };
}
exports.CoverAbleMethod = CoverAbleMethod;
class ConverService {
    attach(target) {
        return new Proxy(target, this.getHander());
    }
    getHander() {
        return {
            get: (target, key) => {
                if (target[key] instanceof Function && Reflect.getMetadata("CoverAbleType", Object.getPrototypeOf(target).constructor)) {
                    if (Reflect.getMetadata("CoverAbleMethod", target, key)) {
                        return function (...args) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const data = yield target[key](...args);
                                return {
                                    Conert: (fn) => __awaiter(this, void 0, void 0, function* () {
                                        const res = yield fn(data);
                                        return res;
                                    })
                                };
                            });
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
exports.default = ConverService;
//# sourceMappingURL=CoverService.js.map