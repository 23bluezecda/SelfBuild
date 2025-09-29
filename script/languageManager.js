let currentLanguage = ['en_re','en','cn'];

function setLanguage(lang) {
	if (!lang) {
		lang = [...LanguageSelect.getElementsByTagName("li")].map(el => el.getAttribute("language"));
	}
	currentLanguage = lang;
	try { setTranslation(lang[0]); } catch(e) {}
	setCookie("language", lang.join(","), 180);
	console.log("Set languages to "+lang);
}

function exportCustomLanguage() {
	let text = "";
	let keys = Object.keys(customLanguage);
	for (var i = 0; i < keys.length; i++) {
		let line = customLanguage['data'][keys[i]];
		text += keys[i] + "\tXXX\t" + line + "\n";
	}
	var element = document.createElement('a');
	element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
	element.download = "TextMap_custom.tsv";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function deleteCustomLanguage() {
	customLanguage = {};
	localStorage.setItem("customLanguage","{}");
	document.getElementById("exportLanguageBtn").classList.add("disabled");
	document.getElementById("deleteLanguageBtn").classList.add("disabled");
}

function processCustomLanguage(e) {
	var file = e.target.files[0];
	if (!file) return;
	var reader = new FileReader();
	reader.onload = function(e) {
		const lines = e.target.result.split(/\r\n|\n/);
		customLanguage = { data:{} };
		let numAdded = 0;
		for (let i = 0; i < lines.length; i++) {
			let text = lines[i].split("\t");
			if (text[2] != "") {
				numAdded++;
				customLanguage['data'][text[0]] = text[2];
			}
		}
		document.getElementById("importMessage").innerText="Imported "+numAdded+" lines.";
		document.getElementById("exportLanguageBtn").classList.remove("disabled");
		document.getElementById("deleteLanguageBtn").classList.remove("disabled");
		localStorage.setItem("customLanguage", JSON.stringify(customLanguage));
	};
	reader.readAsText(file);
}
