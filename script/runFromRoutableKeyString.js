/**
 * Mengambil episode dari string key routing dan memanggil run()
 */
function runFromRoutableKeyString(value)
{
    if (value == undefined)
        value = curEpKey;

    const expandRange = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

    let episodeRoutingNames = value.replaceAll("--",";").split(";");

    if (episodeRoutingNames.length > 1 || value.includes("[")) 
    {
        let episodes = [];
        let filterKeys = [];

        episodeRoutingNames.forEach(epNameAndBrackets => {
            const epName = epNameAndBrackets.match(/(.+?)(\[|$)/);
            if (epName) {
                let [type, chapter, episode] = getKeysFromRoutableString(epName[1]);
                let ret = CHAPTER_DB?.[type]?.[chapter]['episodes']?.[episode];
                if (ret)
                {
                    episodes.push(ret);

                    const numbersMatch = epNameAndBrackets.match(/\[(.+?)\]/);
                    if (numbersMatch) {
                        if (numbersMatch[1].includes("-"))
                            filterKeys.push(expandRange(...numbersMatch[1].split("-",2).map(Number)))
                        else
                            filterKeys.push(numbersMatch[1].split(',').map(Number));
                    } else filterKeys.push([]);
                }
                else console.warn(epName[1]+" not found in routing data?");
            }
        });

        if (episodes.length > 0) {
            run(episodes, episodeRoutingNames[0], filterKeys)
            return true;
        }
    }
    else
    {
        let [type, chapter, episode] = getKeysFromRoutableString(value)
        let ret = CHAPTER_DB?.[type]?.[chapter]['episodes']?.[episode]
        if (ret) {
            run(ret, value)
            return true;
        }
    }
    return false;
}
