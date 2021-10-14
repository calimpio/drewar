const fs = require('fs');
const evnDef = require('../src/config/evn.def');
function randomStr(len) {
    let r = "";
    for (var i = 0; i < len; i++) {
        let n = Math.round((Math.random() * 60)) + 65
        let c = String.fromCharCode(n);
        r += c
    }
    return r.trim().split('\n').join("");
}

let env = Object.keys(evnDef).map((key) => {
    return `${key}=${evnDef[key]["randomStr"] ? randomStr(evnDef[key]["randomStr"]) : evnDef[key]}`
}).join("\n");

fs.writeFileSync("./src/.env", env)
