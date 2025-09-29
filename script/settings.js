function initSettingsMan(...args) {
    let settingsInternal = {};
    args.forEach(modalName => {
        const tr = document.getElementById(modalName).getElementsByTagName("tr");
        for (let i = 0; i < tr.length; i++) {
            const key = tr[i].getAttribute("setting-name");
            const settingType = tr[i].getAttribute("setting-type") || "boolean";
            if (key) {
                let val = getCookie(key) || tr[i].getAttribute("setting-default") ?? false;
                if (settingType === "boolean") {
                    val = (val==="true");
                    const checkbox = tr[i].querySelector("[type=checkbox]");
                    if (checkbox) {
                        checkbox.checked = val;
                        checkbox.onchange = function(e){
                            settingsInternal[key] = e.target.checked;
                            setCookie(key, e.target.checked);
                        }
                    }
                } else if (settingType === "string") {
                    const input = tr[i].querySelector("[type=text]");
                    input.value = val;
                    input.onblur = function(e){
                        settingsInternal[key] = e.target.value;
                        setCookie(key, e.target.value);
                    }
                }
                settingsInternal[key] = val;
            }
        }
    });
    return settingsInternal;
}
let SETTINGSMAN = {};
