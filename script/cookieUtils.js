function setCheckboxFromCookie(idOfCheckbox, defaultValueIfNotSet) {
	let c = getCookie(idOfCheckbox);
	if (!c) {
		c = defaultValueIfNotSet.toString();
		setCookie(idOfCheckbox, defaultValueIfNotSet, 180);
	}
	document.getElementById(idOfCheckbox).checked = (c=='true');
}

function setCookieFromCheckbox(idOfCheckbox) {
	setCookie(idOfCheckbox, document.getElementById(idOfCheckbox).checked, 180);
}
