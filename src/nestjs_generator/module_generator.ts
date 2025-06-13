import { IdlProgram } from "../IdlProgram";

export function moduleGenerator(name: string, nestjsPath: string, idlProgram: IdlProgram) {
    const service = idlProgram.getService(name);


}