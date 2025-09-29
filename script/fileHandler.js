function dragOverHandler(ev) { ev.preventDefault(); }

function dropHandler(ev) {
	ev.preventDefault();
	if (ev.dataTransfer.items) {
		for (var i = 0; i < ev.dataTransfer.items.length; i++) {
			if (ev.dataTransfer.items[i].kind === 'file') {
				var file = ev.dataTransfer.items[i].getAsFile();
				processUserFile(file);
			}
		}
	} else {
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			processUserFile(ev.dataTransfer.files[i]);
		}
	}
}

function handleFileSelect(evt) {
	var files = evt.target.files;
	for (var i = 0, f; f = files[i]; i++) {
		processUserFile(f);
	}
}
