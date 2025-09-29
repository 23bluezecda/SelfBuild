function parseGFLTextModifiers(message, tnDisplay=1) {
    message = message.replaceAll("<script>","&lt;script&gt;").replaceAll("</script>","&lt;&#x2F;script&gt;").replaceAll("\"","&quot;");
    for(var ccc=0;ccc<20;ccc++){
        let idx=message.indexOf("<color=");
        if(idx==-1) break;
        let end=message.indexOf('>',idx);
        let color=message.slice(idx+7,end);
        let spanTagStart="<span class='coloredDialogue' style='color:"+color+"'>";
        let indexOfClosingTag=message.indexOf("</color>");
        message=message.slice(0,idx)+spanTagStart+message.slice(end+1,indexOfClosingTag)+"</span>"+message.slice(indexOfClosingTag+8);
    }
    for(var ccc=0;ccc<20;ccc++){
        let idx=message.indexOf("<size=");
        if(idx==-1) break;
        let end=message.indexOf('>',idx);
        let size=message.slice(idx+6,end)/45*100;
        let spanTagStart="<span class='sizedDialogue' style='font-size:"+size+"%'>";
        let indexOfClosingTag=message.indexOf("</size>");
        message=message.slice(0,idx)+spanTagStart+message.slice(end+1,indexOfClosingTag)+"</span>"+message.slice(indexOfClosingTag+7);
    }
    if(tnDisplay>0){
        let begin=message.indexOf("(TN: "), end=message.lastIndexOf(")");
        if(begin!=-1 && end>begin){
            let extracted=message.slice(begin,end+1);
            message=message.slice(0,begin)+"<br><span class='translation-note' style='font-size:80%'>"+extracted+"</span>";
        }
    }
    return message.replaceAll("//n","<br>").replaceAll("#n","<br>");
}
