/**
 * Menjalankan episode atau array episode
 */
async function run(episode, routableKeyString="", filterKeys=null)
{
    currentEpisodeAsOpcodes = [];
    curEpisodePart = 0;
    curEpKey = routableKeyString;

    let episodes = Array.isArray(episode) ? episode : [episode];

    const lang = currentLanguage[0];
    let lang_idx = Object.keys(LANGUAGE_COLUMN).indexOf(lang);
    if (lang=="en_abridged") lang_idx = Object.keys(LANGUAGE_COLUMN).indexOf("en_re");

    // Set nama chapter di DOM
    let epName = episodes[0].name_multilang?.[lang_idx] || episodes[0].name;
    for (let i = 1; i < episodes.length; i++) {
        epName += " & " + (episodes[i].name_multilang?.[lang_idx] || episodes[i].name);
    }
    document.getElementById('chapterName').innerText = epName;

    // Deskripsi chapter
    let chapterDesc = document.getElementById('chapterDesc')
    chapterDesc.style.display = ('description' in episodes[0] ? "inherit" : "none")
    if ('description' in episodes[0]) {
        let text = episodes[0].description_multilang?.[lang_idx] || episodes[0]['description']
        for (let ccc = 0; ccc < 5; ccc++) {
            let idx = text.indexOf("#(");
            if (idx != -1) {
                let end = text.indexOf('#)',idx)
                let spanTagStart = "<span class='coloredDialogue' style='color:deepskyblue;'>"
                text = text.slice(0,idx)+spanTagStart+text.slice(idx+2,end)+"</span>"+text.slice(end+2)
            }
        }
        chapterDesc.innerHTML = text;
    }

    // Stop audio
    document.getElementById('audioPlayer').pause();

    // Div untuk menampung teks episode
    let NewSimpleTextDiv = document.createElement('div');
    NewSimpleTextDiv.id="verySimpleText";

    // Fetch episode data
    let episodeDatas = await Promise.all(
        episodes.map(ep => fetch("avgtxt/"+ep.parts).then(res => res.json()))
    );

    // Filter bagian episode jika diperlukan
    if (filterKeys?.length > 0) {
        for (let i = 0; i < filterKeys.length; i++) {
            if (Array.isArray(filterKeys[i]) && filterKeys[i].length > 0) {
                const thisEpisodeData = episodes[i]
                let clone = Object.assign({}, thisEpisodeData);
                clone['part_names'] = {};
                const part_names = thisEpisodeData['part_names'];
                const part_keys = Object.keys(episodeDatas[i]);
                for (let kk = 0; kk < part_names.length; kk++)
                    clone['part_names'][part_keys[kk]] = part_names[kk];

                const dictionary = episodeDatas[i];
                const keysArray = filterKeys[i];
                const filteredDictionary = keysArray.reduce((acc,key)=>{
                    if (key in dictionary) acc[key] = dictionary[key];
                    return acc;
                },{});

                clone['part_names'] = keysArray.reduce((acc,key)=>{
                    if (key in clone['part_names']) acc[key] = clone['part_names'][key];
                    return acc;
                },{});

                episodeDatas[i] = filteredDictionary;
                clone['part_names'] = Object.values(clone['part_names']);
                episodes[i] = clone;
            }
        }
    }

    // Render ke DOM
    let partNum = 0;
    let totalParts = episodeDatas.flatMap(m => Object.keys(m)).length;
    for (let p = 0; p < episodes.length; p++) {
        let thisEp = episodeDatas[p];
        let keys = Object.keys(thisEp)
        for(let j=0;j<keys.length;j++) {
            let partName = episodes[p].part_names?.[j]
            let structuredLines = thisEp[keys[j]]
            for(let i=0;i<structuredLines.length;i++)
                structuredLines[i][0] = opcode2string.indexOf(structuredLines[i][0])

            if (document.getElementById('showDebugOpcodeButton').checked) {
                let button2 = document.createElement('a');
                button2.setAttribute("class","waves-effect waves-light btn");
                button2.setAttribute("href","avgtxt/"+episodes[p]["parts"]);
                button2.innerText="original text file for this section (For debugging)"
                NewSimpleTextDiv.appendChild(button2);
                NewSimpleTextDiv.appendChild(document.createElement('br'));
            }

            NewSimpleTextDiv.appendChild(renderStructuredLinesToDiv(structuredLines,partNum,partName,false,totalParts));
            partNum++;
        }
    }

    let simpleTextDiv = document.getElementById("verySimpleText")
    simpleTextDiv.parentNode.replaceChild(NewSimpleTextDiv,simpleTextDiv);

    setCookie('lastViewedScene',episodes[0].parts,180);
    window.document.title = "GGZ S.I. - "+episodes[0]['name'];
}
