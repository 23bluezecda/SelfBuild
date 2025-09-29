function downloadRetranslation() {
	let tStatus = document.getElementById('translationServerStatus');
	const selectedLanguage = document.querySelector('input[name="group1"]:checked').value;
	tStatus.innerText = "Downloading...";

	fetch(TRANSLATION_SERVER_URL+"/"+selectedLanguage)
	.then(response => {
		if (response.ok) return response.json();
		else return response.text().then(r=> { throw new Error(r); });
	})
	.then(contents => {
		let keys = Object.keys(contents);
		if (keys.length > 0) {
			customLanguage = {
				"language": selectedLanguage,
				"data": contents,
				"timestamp": { "import": Math.round(Date.now()/1000) }
			};
			localStorage.setItem("customLanguage", JSON.stringify(customLanguage));
			tStatus.innerText="Succesfully imported "+keys.length+" lines.";
		} else {
			tStatus.innerText="The translation file received was empty.";
		}
	}).catch((error) => {
		tStatus.innerText="Error: "+error;
	})
}

function uploadRetranslation() {
	let tStatus = document.getElementById('translationServerStatus');
	var request = new XMLHttpRequest();
	request.onload = function () {
		tStatus.innerText = request.responseText;
	}
	request.open("POST", TRANSLATION_SERVER_URL, true);
	tStatus.innerText="Submitting..."
	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/json");
	let APIKey = document.getElementById('translation_api_key').value;
	let copyDict = {
		"LANGUAGE": customLanguage['language'],
		"TIMESTAMP_DL": customLanguage['timestamp']['import'],
		"TIMESTAMP_UL": Math.round(Date.now()/1000)
	};
	if (APIKey!='') { setCookie("API_KEY", APIKey,180); copyDict['API_KEY']=APIKey; }
	for (const [key, timestamp] of Object.entries(customLanguage['timestamp'])) {
		if (timestamp > customLanguage['timestamp']['import'])
			copyDict[key]=customLanguage['data'][key]
	}
	request.send(JSON.stringify(copyDict));
}
