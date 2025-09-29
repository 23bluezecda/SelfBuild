function amaryllisCrypt(s, k=0) {
    let u = new Uint8Array(s.match(/[0-9a-z]{2}/gi).map(t => parseInt(t, 16)));
    u = u.map(v => v ^ k);
    const d = new TextDecoder("utf-16");
    return d.decode(u);
}
