function reRunWithNewOpcodes() {
	let lines = document.getElementById("DebugTextArea").value;
	let newStructuredLines = stringToStructuredLines(lines);
	currentEpisodeAsOpcodes[curEpisodePart] = newStructuredLines;
}

function showOpcodes(divId) {
	let x = document.getElementById(divId);
	if (x.style.display === "none") {
		x.style.display = "block";
		let t = x.getElementsByTagName('textarea')[0]
		t.style.height = Math.min(t.scrollHeight, 500) + "px";
	} else {
		x.style.display = "none";
	}
}

function processUserFile(f) {
	let NewSimpleTextDiv = document.createElement('div');
	NewSimpleTextDiv.id = "verySimpleText";
	var reader = new FileReader();
	reader.onload = function(e) {
		try {
			var episode = JSON.parse(e.target.result);
			var keys = Object.keys(episode);
			for (var i = 0; i < keys.length; i++) {
				let structuredLines = episode[keys[i]];
				for (var j = 0; j < structuredLines.length; j++) {
					structuredLines[j][0] = opcode2string.indexOf(structuredLines[j][0]);
				}
				NewSimpleTextDiv.appendChild(renderStructuredLinesToDiv(structuredLines, i, null, false, keys.length));
			}
			let simpleTextDiv = document.getElementById("verySimpleText");
			simpleTextDiv.parentNode.replaceChild(NewSimpleTextDiv, simpleTextDiv);
			document.getElementById("customCutsceneError").style.display = "none";
		} catch (e) {
			document.getElementById("customCutsceneError").style.color = "red";
			document.getElementById("customCutsceneError").style.display = "block";
			document.getElementById("customCutsceneError").innerText = e.message;
		}
	};
	reader.readAsText(f);
}
