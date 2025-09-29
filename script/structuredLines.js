function structuredLinesToString(structuredLines) {
    let s = "";
    structuredLines.forEach(line => {
        s+=(opcode2string[line[0]]||"unknown opcode "+line[0])+';;';
        if (line[0]==OPCODES.PORTRAIT && line[1]) s+=line[1].join(',');
        if (line[2]!=undefined) s+=";;"+line[2].join(',');
        s+='\r\n';
    });
    return s;
}

function stringToStructuredLines(s) {
    var lines = s.split(/\r?\n/);
    let structuredLines = [];
    for(i=0;i<lines.length;i++) {
        let newMsg = lines[i].split(';');
        newMsg[0] = opcode2string.indexOf(newMsg[0]);
        if (newMsg[0] == OPCODES.PORTRAIT) {
            newMsg[4] = (newMsg[4] != undefined ? newMsg[4].toLowerCase() == "true" : false);
            newMsg[5] = (newMsg[5] != undefined ? newMsg[5].toLowerCase() == "true" : false);
        }
        structuredLines.push(newMsg);
    }
    return structuredLines;
}
