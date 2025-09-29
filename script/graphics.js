function nightFilter(image) {
    var myCanvas=document.createElement("canvas");
    var ctx=myCanvas.getContext("2d");
    myCanvas.width=image.naturalWidth;
    myCanvas.height=image.naturalHeight;
    ctx.drawImage(image,0,0);
    var imageData=ctx.getImageData(0,0,myCanvas.width,myCanvas.height);
    for (j=0; j<imageData.data.length; j+=4) {
        imageData.data[j]*=0.4;
        imageData.data[j+1]*=0.4;
        imageData.data[j+2]*=0.8;
    }
    ctx.putImageData(imageData,0,0);
    return myCanvas.toDataURL();
}

function bakeStoryBox(d) {
    if(!d) d=document.getElementById('storyBox0');
    let bg = d.getElementsByClassName('bg')[0];
    let dolls = d.getElementsByClassName('storydoll');
    let checksum = "00";
    let canvas = document.createElement('canvas');
    canvas.width=1280; canvas.height=720;
    let ctx=canvas.getContext('2d');
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);
    if(dolls.length>0) ctx.drawImage(dolls[0],canvas.width/2-dolls[0].naturalWidth/2,50);
    d.innerHTML="<img class='bakedStoryBox' style='width:100%;' src='"+canvas.toDataURL()+"' checksum='"+checksum+"'>";
}

function portraitStructToString(p) {
    return "name: "+p[0]+" | type: "+p[1]+" | dim: "+p[2];
}
