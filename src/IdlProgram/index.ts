import { SailsIdlParser, Program } from "sails-js-parser"
import { ISailsService } from 'sails-js-types';

export class IdlProgram {
    private constructor(private program: Program) {}

    static async new(idl: string): Promise<IdlProgram> {
        const parser = await SailsIdlParser.new();
        const parsedIDL = parser.parse(idl);

        return new IdlProgram(parsedIDL)
    }

    servicesNames(): string[] {
        const names = this.program
            .services
            .map(service => service.name);
        return names;
    }

    serviceFuncNames(serviceName: string): string[] {
        const service = this.getService(serviceName);
        const funcNames = service.funcs.map(func => func.name);

        return funcNames;
    }

    serviceFuncIsQuery(serviceName: string, methodName: string): boolean {
        const service = this.getService(serviceName);
        const method = this.getServiceMethod(service, methodName);

        return method.isQuery;
    }

    getService(serviceName: string) {
        const service = this.program
            .services
            .find(service => service.name == serviceName);
        
        if (!service) {
            throw new Error(`Service ${serviceName} does not exists in idl!`);
        }

        return service;
    }

    getServiceMethod(service: ISailsService, methodName: string) {
        const method = service.funcs.find(method => method.name == methodName);

        if (!method) {
            throw new Error(`Method ${methodName} does not exists in ${service.name}`);
        }

        return method;
    }
}