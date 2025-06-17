"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdlProgram = void 0;
const sails_js_parser_1 = require("sails-js-parser");
class IdlProgram {
    constructor(program, idlContent) {
        this.program = program;
        this.idlContent = idlContent;
    }
    static async new(idl) {
        const parser = await sails_js_parser_1.SailsIdlParser.new();
        const parsedIDL = parser.parse(idl);
        return new IdlProgram(parsedIDL, idl);
    }
    get getIdlContent() {
        return this.idlContent;
    }
    serviceNames() {
        const names = this.program
            .services
            .map(service => service.name);
        return names;
    }
    serviceFuncNames(serviceName) {
        const service = this.getService(serviceName);
        const funcNames = service.funcs.map(func => func.name);
        return funcNames;
    }
    serviceFuncIsQuery(serviceName, methodName) {
        const service = this.getService(serviceName);
        const method = this.getServiceMethod(service, methodName);
        return method.isQuery;
    }
    getService(serviceName) {
        const service = this.program
            .services
            .find(service => service.name == serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} does not exists in idl!`);
        }
        return service;
    }
    getServiceMethod(service, methodName) {
        const method = service.funcs.find(method => method.name == methodName);
        if (!method) {
            throw new Error(`Method ${methodName} does not exists in ${service.name}`);
        }
        return method;
    }
    getServiceCommandsNames(serviceName) {
        const service = this.getService(serviceName);
        const funcs = service.funcs.filter(func => !func.isQuery);
        return funcs.map(func => func.name);
    }
    getServiceQueriesNames(serviceName) {
        const service = this.getService(serviceName);
        const funcs = service.funcs.filter(func => func.isQuery);
        return funcs.map(func => func.name);
    }
    getServiceFuncParamNames(serviceName, funcName) {
        const service = this.getService(serviceName);
        const func = this.getServiceMethod(service, funcName);
        const funcParamNames = func.params.map(param => param.name);
        return funcParamNames;
    }
    serviceFuncContainsParams(serviceName, funcName) {
        const service = this.getService(serviceName);
        const func = this.getServiceMethod(service, funcName);
        return func.params.length > 0;
    }
}
exports.IdlProgram = IdlProgram;
