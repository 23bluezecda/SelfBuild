function getRoutableKeyString(type, chapter, episode) {
	return type + '-' + chapter + '-' + episode;
}

function getKeysFromRoutableString(s) {
	let maybe = ROUTING[s];
	if (maybe) s = maybe;
	return s.split('-');
}

function onChapterSelected(value) {
	runFromRoutableKeyString(value);
}

function goToPrevEpisode() {
	document.getElementById('chapterName').scrollIntoView();
	let [type, chapter, episode] = getKeysFromRoutableString(curEpKey);
	episode--;
	if (CHAPTER_DB[type][chapter]['episodes'][episode]) {
		runFromRoutableKeyString(getRoutableKeyString(type, chapter, episode));
		return true;
	} else {
		chapter--;
		episode = CHAPTER_DB[type][chapter]['episodes'].length - 1;
	}
	if (CHAPTER_DB[type][chapter]['episodes'][episode]) {
		runFromRoutableKeyString(getRoutableKeyString(type, chapter, episode));
		return true;
	}
	return false;
}

function goToNextEpisode() {
	document.getElementById('chapterName').scrollIntoView();
	let [type, chapter, episode] = getKeysFromRoutableString(curEpKey);
	episode++;
	if (CHAPTER_DB[type][chapter]['episodes'][episode]) {
		window.location.hash = CHAPTER_DB[type][chapter]['episodes'][episode]['parts'];
		return true;
	} else {
		chapter++;
		episode = 0;
	}
	if (CHAPTER_DB[type][chapter]['episodes'][episode]) {
		window.location.hash = CHAPTER_DB[type][chapter]['episodes'][episode]['parts'];
		return true;
	}
	return false;
}
