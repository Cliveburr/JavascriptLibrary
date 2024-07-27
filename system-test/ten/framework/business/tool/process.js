const spawn = require("child_process").spawn;

let commandId = 0;
async function process(command, cwd) {
    const myId = commandId++;
    if (cwd) {
        console.log(`${myId}> ${cwd}> ${command}`);
    }
    else {
        console.log(`${myId}> ${command}`);
    }
    return new Promise((e, r) => {
        const cp = spawn(command, { cwd, shell: true, stdio: ["inherit", "inherit", "inherit"] });
        //cp.on('error', console.error);
        cp.on('exit', (code) => {
            if (code == 0) {
                e();
            }
            else {
                r(code);
            }
        });
    });
}

exports.process = process;