function keyboardHandlerForStoryBox(e) {
    const thisElementIdx = parseInt(e.target.id.match(/\d+$/)?.[0]);
    if (isNaN(thisElementIdx)) return false;
    if (e.key=="ArrowDown") document.getElementById("storyBox"+(thisElementIdx+1)).focus();
    else if (e.key=="ArrowUp" && thisElementIdx>0) document.getElementById("storyBox"+(thisElementIdx-1)).focus();
    if (e.ctrlKey && e.key=="e" && customLanguage!=undefined && SETTINGSMAN.multilanguageEnabled){
        const allElements=e.target.parentElement.children;
        let foundEditable=false;
        for(let i=0;i<allElements.length;i++){
            if(foundEditable){
                if(allElements[i].nodeName=="TABLE"){
                    allElements[i].querySelector("tr[lang=custom] a").click();
                    break;
                }
            } else if(allElements[i]==e.target) foundEditable=true;
        }
        e.preventDefault();
    }
}

function keyboardHandlerForMultiLangBox(e) {
    if(customLanguage!=undefined && e.ctrlKey){
        if(e.key=="e") e.target.querySelector("tr[lang=custom] a").click();
        else if(e.keyCode>=49 && e.keyCode<=57){
            const idx=e.keyCode-49;
            const editButtons=e.target.querySelectorAll("a");
            if(idx<editButtons.length) editButtons[idx].click();
        }
    }
}
