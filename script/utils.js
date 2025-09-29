window.print = function(param) {
    console.log(param);
}

function consoleWarn(param) {
    console.log("%c "+param,'background: black; color: yellow');
}

function sliceAndRemove(str, begin, end) {
    return str.slice(0,begin)+str.slice(end);
}

function getFromTag(str, tag) {
    const beginTag = "<"+tag+">";
    const endTag = "</"+tag+">";
    var n = str.indexOf(beginTag);
    if (n != -1){
        return str.slice(n+beginTag.length, str.indexOf(endTag));
    }
    return null;
}

function removeTag(str, tag) {
    const beginTag = "<"+tag+">";
    const endTag = "</"+tag+">";
    return sliceAndRemove(str, str.indexOf(beginTag), str.indexOf(endTag)+endTag.length);
}

//Anti-XSS
function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        "`": '&grave;'
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
}
