function generateTables() {
	var _dropDownTrigger_ = document.createElement('a');
	_dropDownTrigger_.classList.add('dropdown-trigger','btn');
	var _dropDown_ = document.createElement('ul');
	_dropDown_.classList.add('dropdown-content');
	var _li_ = document.createElement('li');

	for (const key in CHAPTER_DB) {
		let episodeContainer = document.getElementById(key+'Episodes');
		for(let i=0;i<CHAPTER_DB[key].length;i++) {
			let flexBoxDiv = document.createElement('div');
			let dropDownTrigger = _dropDownTrigger_.cloneNode(true)
			dropDownTrigger.setAttribute('data-target','dropdown-'+key+'-'+i)
			if (CHAPTER_DB[key][i].hasOwnProperty('color'))
				dropDownTrigger.style.backgroundColor = CHAPTER_DB[key][i]['color'];

			if (CHAPTER_DB[key][i].hasOwnProperty('name_short')) {
				let s = "<span class='chapterTitles-desktop'>"+CHAPTER_DB[key][i]['name']+"</span>";
				s += "<span class='chapterTitles-mobile' translate='"+CHAPTER_DB[key][i]['name_short']+"'>"+CHAPTER_DB[key][i]['name_short']+"</span>";
				dropDownTrigger.innerHTML = s;
			} else {
				dropDownTrigger.innerText = CHAPTER_DB[key][i]['name'];
			}

			let dropdown = _dropDown_.cloneNode(true);
			dropdown.id = 'dropdown-'+key+'-'+i;

			let curChapter = CHAPTER_DB[key][i]['episodes'];
			for(let j=0;j<curChapter.length;j++) {
				let ep = _li_.cloneNode(true);
				ep.innerHTML = "<a href='#"+curChapter[j]['parts']+"'>"+curChapter[j]['name']+"</a>";
				dropdown.appendChild(ep);
			}

			flexBoxDiv.appendChild(dropDownTrigger);
			flexBoxDiv.appendChild(dropdown);
			episodeContainer.appendChild(flexBoxDiv);
		}
	}
}
