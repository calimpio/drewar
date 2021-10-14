import fs from 'fs-extra';
import childProcess from 'child_process';
import { templateModel } from './templates/model';
import { argv } from 'process';
import { MakeOptions } from './types';
import { templateDTO } from './templates/dto';
import { templateController } from './templates/controller';

export function remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.remove(loc, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}


export function copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.copy(src, dest, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}

export function make(src: string, data: string): Promise<void> {
    return fs.writeFile(src, data);
}


export function exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
        let process = childProcess.exec(cmd, { cwd: loc, }, (err, stdout, stderr) => {
            if (!!stdout) {
                console.log(stdout.toString());
            }
            if (!!stderr) {
                console.log(stderr.toString());

            }
            return (!!err ? rej(err) : res());
        });
        return process;
    });
}

function strToOptions(strs: string[]): {} {
    const options: any = { };
    const strOptions = strs[1];
    if (typeof strOptions === 'string') {
        strOptions.split(',').forEach((value) => {
            const prop = value.split('=');
            const oprtionProp = prop[0];
            const valueProp = prop[1];
            options[oprtionProp] = valueProp ? valueProp : true;
        })
    }
    return options;
}


export async function makekModel(options: MakeOptions = strToOptions(argv[2].split(':')), model: string = argv[2].split(':')[0], props: string[] = argv.slice(3)) {
    const dir = "./src/model/";
    const fileName = model.toLowerCase() + ".ts";
    await make(dir + fileName, templateModel(model, props, options));
    console.log("created: " + dir + fileName);
}

export async function makeDTO(options: MakeOptions = strToOptions(argv[2].split(':')), model: string = argv[2].split(':')[0], props: string[] = argv.slice(3)) {
    const dir = "./src/dto/";
    const fileName = model.toLowerCase() + "DTO.ts";
    await make(dir + fileName, templateDTO(model, props, options));
    console.log("created: " + dir + fileName);
}

export async function makeController(options: MakeOptions = strToOptions(argv[2].split(':')), model: string = argv[2].split(':')[0], props: string[] = argv.slice(3)) {
    const dir = "./src/gate/controller";
    const fileName = model.toLowerCase() + "Controller.ts";
    await make(dir + fileName, templateController(model, options));
    console.log("created: " + dir + fileName);
}

export async function makeValidation(options: MakeOptions = strToOptions(argv[2].split(':')), model: string = argv[2].split(':')[0], props: string[] = argv.slice(3)) {
    const dir = "./src/gate/validation";
    const fileName = model.toLowerCase() + "Validation.ts";
    await make(dir + fileName, templateController(model, options));
    console.log("created: " + dir + fileName);
}