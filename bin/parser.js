"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIDL = parseIDL;
function parseIDL(content) {
    const services = [];
    const serviceMatches = content.matchAll(/service\s+(\w+)\s*{([^}]*)}/g);
    for (const serviceMatch of serviceMatches) {
        const serviceName = serviceMatch[1];
        const serviceBody = serviceMatch[2];
        const methods = [];
        const methodMatches = serviceBody.matchAll(/(\w+)\(([^)]*)\)/g);
        for (const methodMatch of methodMatches) {
            const methodName = methodMatch[1];
            const params = methodMatch[2].split(',').map(p => p.trim()).filter(Boolean);
            methods.push({ name: methodName, params });
        }
        services.push({ name: serviceName, methods });
    }
    return { services };
}
