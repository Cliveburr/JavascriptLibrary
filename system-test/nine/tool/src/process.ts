import { spawn } from "child_process";

let commandId = 0;
export async function process(command: string, cwd?: string) {
    const myId = commandId++;
    if (cwd) {
        console.log(`${myId}> ${cwd}> ${command}`);
    }
    else {
        console.log(`${myId}> ${command}`);
    }
    return new Promise((e, r) => {
        const cp = spawn(command, { cwd, shell: true, stdio: "inherit" });
        cp.on('error', r);
        cp.on('exit', e);
    });
}