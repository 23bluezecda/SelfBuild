/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


//I kept accidentally typing print ok
window.print = function(param)
{
	console.log(param);
}
function consoleWarn(param)
{
	console.log("%c "+param,'background: black; color: yellow')
}

function amaryllisCrypt(s, k=0)
{
	let u = new Uint8Array(s.match(/[0-9a-z]{2}/gi).map(t => parseInt(t, 16)))
	u = u.map(v => v ^ k)
	const d = new TextDecoder("utf-16")
	return d.decode(u)
}


//Night mode
isDarkMode=false;
function NightMode()
{
	let theme = "dark-theme"
	if (document.body.classList.contains("dark-theme"))
	{
		theme='black-theme';
		document.body.classList.replace("dark-theme",theme);
		isDarkMode=true
	}
	else if (document.body.classList.contains("black-theme"))
	{
		theme='light-theme';
		document.body.classList.replace("black-theme",theme);
		isDarkMode=false;
	}
	else
	{
		document.body.classList.replace('light-theme',theme);
		isDarkMode=true;
	}
	let themeColor = getComputedStyle(document.body).getPropertyValue('--nav-color');
	document.querySelector("meta[name='theme-color']").content = themeColor;
	//console.log(themeColor);

	setCookie('theme',theme,180);
}

//interpreter related


//For JSON structured or making your own
//Pro tip: use opcode2string.indexOf(s) to get the opcode number
const opcode2string = [
	'stopBGM',
	'bgm',
	'bg',
	'speaker',
	'msg',
	'portraits',
	'nop',
	'msgboxTransition',
	'snowEffect',
	'stopEffect',
	'nightFilter',
	'fadeOut',
	'fadeIn',
	'choice',
	'destination',
	'credits',
	'credits2',
	'soundEffect1',
	'soundEffect2',
	'video'
	//'setMaskedPortrait'
]

const OPCODES = {
	STOPBGM : 0,
	BGM : 1,
	BG : 2,
	SPEAKER : 3,
	MSG : 4,
	PORTRAIT : 5,
	NO_OPERATION : 6, //Or you can say it's a comment
	MSGBOXTRANSITION : 7,
	SNOWEFFECT : 8,
	STOPEFFECTS : 9,
	NIGHTFILTER : 10,
	FADEOUT : 11,
	FADEIN : 12,
	CHOICE : 13,
	DESTINATION : 14,
	CREDITS : 15,
	CREDITS2 : 16,
	SE1: 17,
	SE2: 18,
	VIDEO: 19
	//SETMASKEDPORTRAIT : 8
}

const tag2opcode = {
	"Speaker":OPCODES.SPEAKER,
	"BIN":OPCODES.BG,
	"BGM":OPCODES.BGM,
	"下雪":OPCODES.SNOWEFFECT,
	"火焰销毁":OPCODES.STOPEFFECTS,
	"Night":OPCODES.NIGHTFILTER,
	"黑屏1":OPCODES.FADEOUT,
	"黑屏2":OPCODES.FADEIN,
	'分支':OPCODES.DESTINATION,
	'名单':OPCODES.CREDITS,
	'名单2':OPCODES.CREDITS2,
	"SE1":OPCODES.SE1,
	"SE2":OPCODES.SE2
	//"通讯框":OPCODES.SETMASKEDPORTRAIT,
}

//varargs like *args in python
function initSettingsMan(...args)
{
	let settingsInternal = {}
	args.forEach(modalName => {
		const tr = document.getElementById(modalName).getElementsByTagName("tr");
		for (let i = 0; i < tr.length; i++) {
			const key = tr[i].getAttribute("setting-name")
			const settingType = tr[i].getAttribute("setting-type") || "boolean"
			if (key)
			{
				let val = getCookie(key)
				//val is always a string, so even if it was false it would be stored as the string "false"
				//The only way for this conditional to be false is if val is empty or undefined
				if (val) 
				{
					console.log("[SETTINGSMAN] Loaded "+key+"="+val)
				}
				else
				{
					//This is the null check operator, unlike || it only assigns if null and not false
					//This is because an empty value can be "false" and we only want to set the boolean
					//if it's undefined
					val = tr[i].getAttribute("setting-default") ?? false
					console.log("[SETTINGSMAN] No value set in cookies, default is "+key+"="+val)
				}

				if (settingType === "boolean")
				{
					val = (val==="true")
					
					const checkbox = tr[i].querySelector("[type=checkbox]");
					if (checkbox)
					{

						checkbox.checked = val
						//Surely this won't cause a memory leak
						checkbox.onchange = function(e){
							settingsInternal[key] = e.target.checked;
							setCookie(key, e.target.checked);

							console.log("[SETTINGSMAN] Saved "+key+"="+e.target.checked);
						}
					}
					else
					{
						consoleError("Setting "+key+" had no checkbox defined in the HTML despite being a boolean type, cannot apply setting")
					}
				}
				else if (settingType === "string")
				{
					const input = tr[i].querySelector("[type=text]");
					input.value = val
					input.onblur = function(e){
						settingsInternal[key] = e.target.value;
						setCookie(key, e.target.value)
					}
				}
				else if (settingType === "radio")
				{
					const inputs = tr[i].querySelectorAll("[type=radio]");
					const trueVal = parseInt(val) || 1;
					for (let j=0;j<inputs.length;j++)
					{
						if (trueVal === parseInt(inputs[j].value))
						{
							inputs[j].checked = true
						}
						
						inputs[j].onchange = function(e){
							settingsInternal[key] = e.target.value;
							setCookie(key, e.target.value)
							console.log("[SETTINGSMAN] Fire onchange "+e.target.value+" for "+key)
						}
					}
				}
				else if (settingType === "checkboxes")
				{
					val = val.split(",");
					const inputs = tr[i].querySelectorAll("[type=checkbox]");

					function getSetInternal(_discard,updateCookies=true){
						//Second arg is "function to run on each element in iterable obj"
						let res=Array.from(
							tr[i].querySelectorAll("[type=checkbox]:checked"),
							e=>e.getAttribute('name')
						)
						//console.log("[SETTINGSMAN] value of", key, "is",res);
						settingsInternal[key]=res;
						if (updateCookies)
							setCookie(key,res.join(","),180)
					}
					
					for (let j=0;j<inputs.length;j++)
					{
						const curCheckboxKey = inputs[j].getAttribute('name');
						inputs[j].checked = val.includes(curCheckboxKey);
						inputs[j].onchange = getSetInternal;
					}
				}
				else
				{
					consoleError("[SETTINGSMAN] No support for setting type "+settingType+", ignoring.")
				}
				settingsInternal[key] = val
			}
		}
	})

	return settingsInternal

	// This was if you wanted to set/get outside of clicking it, but
	// Why would that be necessary...?

	/*return new Proxy(settingsInternal,{
		get(target, prop, receiver) {
			return Reflect.get(target, prop, receiver)
		},
		set(target, name, value, receiver) {
			if (!Reflect.has(target, name)) {
				console.error(`Setting non-existent property '${name}', initial value: ${value}`);
			}
			setCookie(name, value, 180)
			return Reflect.set(target, name, value, receiver);
		}
	})*/
}
let SETTINGSMAN = {}

//To be loaded later or on-demand.
let PORTRAITS = {
	101:["kiana/101.png"]

};
let MUSIC = undefined;
let CREDITSDATA = undefined;
let NAMES = {
	204553:"Kiana"
}
//name field is structured like type-chapter-episode
CHAPTER_DB=false;
ROUTING=false;

//Anything not in this const will be added at the end
let DEFAULT_LANGUAGES = ["en_re","en","deepl_jp","deepl_cn"]
const MULTILANGE_OPTIONS = ['en','cn',"jp","en_re","pt","en_abridged"]
const LANGUAGE_COLUMN = {
	"tID":0,
	"en":1,
	"cn":2,
	"jp":3,
	"kr":4,
	"en_re":5,
	"pt":6,
	"deepl_cn":7,
	"deepl_jp":8,
	"en_abridged":9
	//"tcn":5,
	//"en_re":6
}
const LANGUAGE_NAMES = [
	"(Text ID - For Debugging Only)",
	"English",
	"汉语 (Chinese)",
	"日本語 (Japanese)",
	"한국어 (Korean) (Machine Translation)",
	"English (Retranslated)",
	"Portuguese (Fan translation)",
	"DeepL Translated Chinese",
	"DeepL Translated Japanese",
	"English Abridged (Joke translation)"
	//"Korean",
	//"Traditional Chinese(?)",
]
for(const [lang_id, idx] of Object.entries(LANGUAGE_COLUMN)) {
	if (idx==0) //Skip debug
		continue;
	if (!DEFAULT_LANGUAGES.includes(lang_id))
	{
		DEFAULT_LANGUAGES.push(lang_id)
	}
}

//Oh no
let customLanguage = undefined;
const TRANSLATION_SERVER_URL = "https://ggz.amaryllisworks.pw:8880"

/*
Night backgrounds are generated using html canvas,
then to speed up their result is kept in memory in this table and indexed
by the name of the original file
*/
let nightBackgrounds = {};
//Check if nightBG generation is already queued for a BG
let nightBGQueue = {};

//For CSS
var int2str = ['zero','one',  'two',   'three','four',  'five', 'six',  'seven',  'eight', 'nine']
var int2strPos = ['N','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth']


function portraitStructToString(p)
{
	return "name: "+p[0]+" | type: "+p[1]+" | dim: "+p[2]
}

//Shamelessly stolen from http://www.permadi.com/tutorial/jsCanvasGrayscale/index.html
//Technically this could be reimplemented and run much faster if it was WebGL with a GLSL shader. Dunno if you can export it as an image like a canvas though.
function nightFilter(image)
{
	//console.log("processing "+image.src);
	var myCanvas=document.createElement("canvas");
	var myCanvasContext=myCanvas.getContext("2d");

	var imgWidth=image.naturalWidth;
	var imgHeight=image.naturalHeight;
	// You'll get some string error if you fail to specify the dimensions
	myCanvas.width= imgWidth;
	myCanvas.height=imgHeight;
	myCanvasContext.drawImage(image,0,0);

	// This function cannot be called if the image is not from the same domain.
	// You'll get security error if you do.
	var imageData=myCanvasContext.getImageData(0,0, imgWidth, imgHeight);
	
	//console.log(imageData.width +"x"+imageData.height);

	//debugger;
	/*
	imageData.data is a massive array of every pixel in the image
	order is R,G,B,A for every pixel, so it's pixels in image times 4
	We're only modifying red and green here
	*/
	for (j=0; j<imageData.data.length; j+=4)
	{
		var red=imageData.data[j];
		var green=imageData.data[j+1];
		var blue=imageData.data[j+2];
		//var alpha=imageData.data[j+3];
		imageData.data[j]=red*.4;
		imageData.data[j+1]=green*.4;
		imageData.data[j+2]=blue*.8;
		//imageData.data[j+3]=255;
		
	}
		
	//console.log("done!");
	myCanvasContext.putImageData(imageData,0,0,0,0, imageData.width,   imageData.height);
	return myCanvas.toDataURL();
}

//Turns a storybox into a baked image
//for (let d of document.getElementsByClassName('storyImg')){bakeStoryBox(d)}
function bakeStoryBox(d)
{
	if (d==undefined)
		d=document.getElementById('storyBox0');
		
	let bg = d.getElementsByClassName('bg')[0]
	let dolls = d.getElementsByClassName('storydoll');
	
	//Unique hash should be generated based on bg number, dolls present, and dim/mask on dolls so CPU is not wasted generating it again
	let uint8toByte = function(n){let str= Number(n).toString(16); return str.length == 1 ? "0" + str : str}
	let uint16toByte = function(n){
		let str= Number(n).toString(16);
		while (str.length < 4)
			str='0'+str;
		return str;
	}
	let booltoByte = function(b){return b ? 'F' : '0' }
	
	let checksum = uint8toByte(bg.getAttribute('bg'))+booltoByte(bg.classList.contains('nightBG'));
	
	//TODO: No mask support
	for (var i = 0;i<2;i++)
	{
		let doll = d.getElementsByClassName(int2str[i])[0]
		console.log(doll);
		if(doll)
		{
			//Concatenate a string for src because I'm comparing strings anyways and it's unique
			checksum+=doll.getAttribute('src').replace('/','_')+booltoByte(doll.classList.contains('dim'))
		}
		else
			checksum+="0000"
	}
	
	console.log(checksum)
	
	let canvas = document.createElement('canvas');
	canvas.width = 1280; //GFL's cutscenes seem to be scaled to this resolution and not 1024x576.
	canvas.height = 720;
	
	let ctx = canvas.getContext('2d');
	ctx.drawImage(bg,0,0,canvas.width,canvas.height)
	if (dolls.length > 0)
	{
		let doll = dolls[0]
		ctx.drawImage(doll,canvas.width/2-doll.naturalWidth/2,50)
	}
	
	d.innerHTML = "<img class='bakedStoryBox' style='width: 100%; position: relative; display: block;' src=\'"+canvas.toDataURL()+"\' checksum='"+checksum+"'>"
	
}

function sliceAndRemove(str, begin, end)
{
	return str.slice(0,begin)+str.slice(end)
}

function getFromTag(str,tag)
{
	const beginTag = "<"+tag+">"
	const endTag = "</"+tag+">"
	var n = str.indexOf(beginTag)
	if (n != -1){
		return str.slice(n+beginTag.length, str.indexOf(endTag))
	}
	return null
}
function removeTag(str,tag)
{
	const beginTag = "<"+tag+">"
	const endTag = "</"+tag+">"
	return sliceAndRemove(str,str.indexOf(beginTag),str.indexOf(endTag)+endTag.length)
}

function playNewAudio(fileName)
{
	let audioPlayer = document.getElementById('audioPlayer');
	audioPlayer.getElementsByClassName('a_ogg')[0].src = fileName+".ogg"
	audioPlayer.getElementsByClassName('a_mp3')[0].src = fileName+".mp3" //Imagine using a browser that doesn't support ogg
	audioPlayer.load();
	audioPlayer.play();
}
function playSFX(fileName)
{
	let audioPlayer = document.getElementById('sfxPlayer');
	audioPlayer.getElementsByClassName('sfx_ogg')[0].src = fileName+".ogg"
	//audioPlayer.getElementsByClassName('a_mp3')[0].src = fileName+".mp3" //Imagine using a browser that doesn't support ogg
	audioPlayer.load();
	audioPlayer.play();
}

var curEpKey;
var currentEpisodeAsOpcodes;

function structuredLinesToString(structuredLines)
{
	let s = "";
	structuredLines.forEach(line => {
		s+=(opcode2string[line[0]] || "unknown opcode "+line[0])+';;'
		/*for(var i=1;i<line.length;i++)
			s+=line[i]*/
		if (typeof line == "object")
		{
			//console.log(line)
			if (line[0]==OPCODES.PORTRAIT)
			{
				
				s+=line[1].join(',')
				if (line[2]!=undefined)
				{
					s+=";;"+line[2].join(',')
				}
			}
			else
				s+=line.slice(1).join([separator = ';;'])
		}
		else
		{
			s+="Hey idiot, this isn't an array -> "+line;
			consoleWarn("This structured line isn't an array!!!!!!! " + line)
		}
		s+='\r\n'
		//s+=line.toString()+"\r\n";
	})
	return s;
}
function stringToStructuredLines(s)
{
	var lines = s.split(/\r?\n/);
	let structuredLines = [];
	for(i=0;i<lines.length;i++)
	{
		let newMsg = lines[i].split(';')
		newMsg[0] = opcode2string.indexOf(newMsg[0])
		if (newMsg[0] == OPCODES.PORTRAIT)
		{
			//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
			//Someone said the site stopped working because I used the operators so I had to change it back :V
			//It also doesn't work on the old version of Firefox for Android and I want Tampermonkey
			//newMsg[4] = (newMsg[4]?.toLowerCase() == "true")
			//newMsg[5] = (newMsg[5]?.toLowerCase() == "true")
			
			newMsg[4] = (newMsg[4] != undefined ? newMsg[4].toLowerCase() == "true" : false)
			newMsg[5] = (newMsg[5] != undefined ? newMsg[5].toLowerCase() == "true" : false)
		}
		structuredLines.push(newMsg)
	}
	return structuredLines;
}

//Anti-XSS
function sanitize(string) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
		"`": '&grave;'
	};
	const reg = /[&<>"'/]/ig;
	return string.replace(reg, (match)=>(map[match]));
}

//
//TODO: Ignore ALL unknown/illegal codes, not just <script>
//let allowedHTMLTags = ['color','size','b','i','u','q','s']

/**
 * @author AmWorks
 * @date 2021-12-15
 * @param {string} message
 * @param {literal} 0 = display all translation notes (no special handling), 1 = make translation notes smaller, 2 = strip translation notes
 * @returns {string} HTML elements as string
 * @description Converts GFL's text modifiers into HTML elements, as you might have guessed.
 */
function parseGFLTextModifiers(message, tnDisplay=1) {
	const origMessage = message;
	message = message.replaceAll("<script>","&lt;script&gt;").replaceAll("<\/script>","&lt;&#x2F;script&gt;")
	message = message.replaceAll("\"","&quot;")
	for(var ccc = 0; ccc < 20; ccc++)
	{
		if(ccc > 15)
		{
			consoleWarn("Encountered more than 15 color codes in a message... This is very unusual, so bailing out");
			consoleWarn(origMessage)
			consoleWarn(message)
			break;
		}
		//If you haven't already guessed, I don't know regex
		let idx = message.indexOf("<color=");
		if (idx != -1)
		{
			//print('parsing colors: '+message);
			let end = message.indexOf('>',idx)
			let color = message.slice(idx+7,end)
			//console.log(color)
			let spanTagStart = "<span class='coloredDialogue' style='color:"+color+"'>"

			const indexOfClosingTag = message.indexOf("</color>")
			if (indexOfClosingTag < 0)
			{
				consoleWarn("This message is malformed, there is no closing color tag: "+origMessage)
				break
			}
			message = message.slice(0,idx)+spanTagStart+message.slice(end+1,indexOfClosingTag)+"</span>"+message.slice(indexOfClosingTag+8)
			//console.log("new msg: "+message);
		}
		else
		{
			break;
		}
	}
	for(var ccc = 0; ccc < 20; ccc++)
	{
		if(ccc > 15)
		{
			consoleWarn("Encountered more than 15 size codes in a message... This is very unusual, so bailing out");
			consoleWarn(origMessage)
			consoleWarn(message)
			break;
		}
		//If you haven't already guessed, I don't know regex
		let idx = message.indexOf("<size=");
		if (idx != -1)
		{
			//console.log(message);
			let end = message.indexOf('>',idx)
			let size = message.slice(idx+6,end)/45*100 //Assume default is 45px
			let spanTagStart = "<span class='sizedDialogue' style='font-size:"+size+"%'>"
			const indexOfClosingTag = message.indexOf("</size>")
			if (indexOfClosingTag < 0)
			{
				consoleWarn("This message is malformed, there is no closing size tag: "+origMessage)
				break
			}
			message = message.slice(0,idx)+spanTagStart+message.slice(end+1,indexOfClosingTag)+"</span>"+message.slice(indexOfClosingTag+7)
		}
		else
		{
			break;
		}
	}

	//TODO: Wouldn't it make more sense to always parse this and use CSS to handle showing it? Then there isn't any need
	//to be passing in an argument...
	if (tnDisplay > 0)
	{
		let begin = message.indexOf("(TN: ")
		let end = message.lastIndexOf(")")
		if (begin != -1 && end > begin)
		{
			let extracted = message.slice(begin,end+1)
			message = message.slice(0,begin)
			if (tnDisplay == 1)
			{
				let spanTag = "<br><span class='translation-note' style='font-size:80%'>" + extracted + "</span>"
				message += spanTag
			}
			//console.log(extracted)
		}
	}
	message = message.replaceAll("//n","<br>")
	message = message.replaceAll("#n","<br>")
	return message

}

//let lastKnownFocus = 0;

function keyboardHandlerForStoryBox(e) {
	//console.log(e);

	const thisElementIdx = parseInt(e.target.id.match(/\d+$/)?.[0]);
	if (isNaN(thisElementIdx)) //Surely just doing a try-catch is less effort
		return false;

	if (e.key == "ArrowDown")
	{
		document.getElementById("storyBox"+(thisElementIdx+1)).focus()
		e.preventDefault()
	}
	else if (e.key == "ArrowUp")
	{
		if (thisElementIdx > 0)
			document.getElementById("storyBox"+(thisElementIdx-1)).focus()
		e.preventDefault();
	}
	if (e.ctrlKey && e.key == "e")
	{
		if (customLanguage != undefined && SETTINGSMAN.multilanguageEnabled)
		{

			const allElements = e.target.parentElement.children;
			let foundEditable = false;
			for (let i = 0; i < allElements.length; i++)
			{
				if (foundEditable)
				{
					if (allElements[i].nodeName=="TABLE")
					{
						allElements[i].querySelector("tr[lang=custom]").querySelector("a").click()
						console.log("break!")
						break;
					}
				}
				else if (allElements[i]==e.target)
				{
					foundEditable=true;
				}

			}
			e.preventDefault();

		}
	}
}
function keyboardHandlerForMultiLangBox(e) {

	if (customLanguage != undefined)
	{

		if (e.ctrlKey)
		{
			
			if (e.key == "e")
			{
				e.target.querySelector("tr[lang=custom]").querySelector("a").click()
				e.preventDefault();
			}
			else if (e.keyCode >= 49 && e.keyCode <= 57)
			{
				const thisNumberKey = e.keyCode-49 //It's 0-indexed at this point, so it would be num 1 = 0, num 2 = 1
				const editButtons = e.target.querySelectorAll("a");
				//console.log(editButtons);
				if (thisNumberKey < editButtons.length)
				{
					editButtons[thisNumberKey].click();
				}

			}
		}
	}
}

/**
 * @date 2021-11-21
 * @param {any[]} structuredLines array
 * @param {number} part
 * @param {string=} partName - if present replaces the "Part X" header
 * @param {boolean=} isNight
 * @param {number=} numParts
 * @returns {any[]}
 * @description Takes a structuredLines array and returns it rendered as an HTML Div. This function does not cause side effects.
 */
function renderStructuredLinesToDiv(structuredLines,part,partName,isNight,numParts)
{
	
	let thisPartDiv = document.createElement('div');
	thisPartDiv.id = 'part'+part
	let h3 = document.createElement('h3');
	//console.log(partNum);
	if (partName != undefined)
		h3.innerText="Part "+(part+1)+": "+partName
	else
		h3.innerText="Part "+(part+1);
	
	
	//partNum++;
	thisPartDiv.appendChild(h3);
	
	//Add part to top
	if (part != undefined && numParts != undefined && numParts > 1 && numParts < 25) //Don't bother if it's more than 25, it wastes too much CPU
	{
		let ul = document.createElement('ul')
		ul.classList.add('pagination');
		//ul.innerHTML = "<li class='disabled'><a style='color:var(--text-color); cursor:text;'>Jump to:</a></li>"
		if (part==0)
			ul.innerHTML = '<li class="disabled"><a><i class="material-icons">chevron_left</i></a></li>'
		else
			ul.innerHTML = '<li class="waves-effect"><a onclick="document.getElementById(\'part'+(part-1)+'\').scrollIntoView()"><i class="material-icons">chevron_left</i></a></li>'
		
		let li = ''
		for (var p = 0;p<numParts;p++)
		{
			li += '<li class="'+ (p==part ? 'active' : 'waves-effect')+ '"><a onclick="document.getElementById(\'part'+p+'\').scrollIntoView()">'+(p+1)+'</a></li>'
			
		}
		if (part==numParts-1)
			li += '<li class="disabled"><a><i class="material-icons">chevron_right</i></a></li>'
		else
			li += '<li class="waves-effect"><a onclick="document.getElementById(\'part'+(part+1)+'\').scrollIntoView()"><i class="material-icons">chevron_right</i></a></li>'
		
		ul.innerHTML = ul.innerHTML + li
		
		
		//It looks kind of ugly tbh
		/*if (episode['part_names'] != undefined)
			partJump+=': '+episode['part_names'][p]*/
		//partJump+='</a></li>'
		thisPartDiv.appendChild(ul);
	}
	
	if (document.getElementById('showDebugOpcodeButton').checked)
	{
		let button = document.createElement('a');
		//fuck your javascript
		button.setAttribute("class","waves-effect waves-light btn");
		button.setAttribute("onclick","showOpcodes('div_cutscene_iop_"+part+"')")
		button.innerText="Show opcodes for this section (For debugging)"
		thisPartDiv.appendChild(button);
		thisPartDiv.appendChild(document.createElement('br'));
	
		let opcodesDiv = document.createElement('div');
		opcodesDiv.id= "div_cutscene_iop_"+part
		opcodesDiv.style="display: none;"
		opcodesDiv.classList.add("textarea-wrapper");
		opcodesDiv.innerHTML = "<textarea rows='6' cols='50' id='textarea_cutscene_"+part+"' readonly>"+structuredLinesToString(structuredLines)+"</textarea><br>"
		//debugger;
		//TLN.append_line_numbers_obj(opcodesDiv.firstElementChild,"textarea_cutscene_"+part)
		thisPartDiv.appendChild(opcodesDiv)
	}
	
	let playBGMbutton = document.createElement('a');
	playBGMbutton.setAttribute("class","waves-effect waves-light btn");
	playBGMbutton.innerHTML='<i class="material-icons left">music_note</i>Play audio for this cutscene'
	

	
	//<img src="avgtexture/夜间蒙版.png" class="storydoll first one mask" style="mask-image: url(pic/pic_NPC-Helian.png);">
	let maskThing = document.createElement('img');
	//maskThing.src= "avgtexture/夜间蒙版.png";
	maskThing.classList.add("storydoll");
	maskThing.classList.add("mask");
	maskThing.style="z-index: 10";
	
	
	let lastSpeakerName = ["",-1];
	let lastBGUsed = undefined; // [9,false];
	//let didBGOrPortraitOrNameChange = false;
	
	let didBGChange = false;
	let didPortraitsChange = false;
	let didNameChange = false;
	
	let shownPortraits = []
	
	let numStoryBoxRendered = part*1000+0; //For quick scroll. We start at a part because if there's multiple parts then it would jump back to the top and we don't want that.
	

	const debugMode = SETTINGSMAN.showDebugOpcodeButton;
	const fancyDisplayType = SETTINGSMAN.fancyOrNot;
	const quickScroll = SETTINGSMAN.quickScroll;
	//let inlineText = document.getElementById('inlineText').checked
	const advancedCSS = SETTINGSMAN.advancedCSS;
	const skipGenerationOfDuplicateBoxes = SETTINGSMAN.skipGenerationOfDuplicateBoxes;
	const showSFXButtons = SETTINGSMAN.showSFXButtons;

	//If NaN somehow, default to 1
	const translationNoteDisplayType = parseInt(SETTINGSMAN.tnNote) || 1;
	const amCrypt_k = parseInt(SETTINGSMAN.amw_key, 16);
	
	var snowDiv;
	if (advancedCSS)
	{
		snowDiv = document.createElement('div');
		snowDiv.classList.add('snow');
		snowDiv.style='position: absolute; width:100%; height:100%;bottom: 0;'
	}
	let snowEffect = false
	//let curDestination = null;
	//let languageColumn = LANGUAGE_COLUMN[currentLanguage]
	
	for(var i=0;i<structuredLines.length;i++)
	{
		let opcode = structuredLines[i][0]
		//console.log(structuredLines[i]);
		switch (opcode)
		{
			case OPCODES.BGM:
				let newPlayBGMButton = playBGMbutton.cloneNode(true);
				//console.log(structuredLines[i][1])
				let audio = MUSIC[structuredLines[i][1]] || structuredLines[i][1];
				if (debugMode)
					newPlayBGMButton.innerHTML='<i class="material-icons left">music_note</i>'+audio
				newPlayBGMButton.setAttribute("onclick","playNewAudio('audio/"+audio+"')")
				thisPartDiv.appendChild(newPlayBGMButton);
				break;
			case OPCODES.SE1:
			case OPCODES.SE2:
				if (showSFXButtons)
				{
					let playSFXbutton = document.createElement('a');
					playSFXbutton.setAttribute("class","waves-effect waves-light btn-small");
					playSFXbutton.innerHTML='<i class="material-icons left">surround_sound</i>SFX: '+structuredLines[i][1]
					playSFXbutton.setAttribute("onclick","playSFX('sfx/"+structuredLines[i][1]+"')")
					thisPartDiv.appendChild(playSFXbutton);
				}
				break;
			case OPCODES.STOPBGM:
				let stopBGMButton = document.createElement('a');
				stopBGMButton.setAttribute("class","waves-effect waves-light btn");
				stopBGMButton.innerHTML='<i class="material-icons left">music_note</i>Stop audio'
				stopBGMButton.setAttribute('onclick',"document.getElementById('audioPlayer').pause()")
				thisPartDiv.appendChild(stopBGMButton);
				break;
			case OPCODES.CHOICE:
				for (var c = 1; c < structuredLines[i].length;c++)
				{
					let choiceButton = document.createElement('a');
					choiceButton.setAttribute("class","waves-effect waves-light btn choiceButton");
					choiceButton.setAttribute("style","margin-right: 5px; margin-bottom: 5px; text-transform:unset;")
					let text;

					for(let zzzz=0; zzzz < currentLanguage.length; zzzz++)
					{
						let languageColumn = LANGUAGE_COLUMN[currentLanguage[zzzz]];
						if (languageColumn > structuredLines[i][c].length)
							continue; //Don't break on this because the columns aren't in order, they could be 1,5,9,2,3 etc
						
						let thisLine = structuredLines[i][c][languageColumn];
						if (thisLine != undefined)
						{
							text = thisLine;
							break;
						}
					}


					choiceButton.innerText= text || (structuredLines[i][c][0]+" (Not translated)");
					if (debugMode)
						choiceButton.title=structuredLines[i][c][0];
					thisPartDiv.appendChild(choiceButton);
				}
				break;
			case OPCODES.DESTINATION:
				//curDestination = structuredLines[i][1]
				let h5 = document.createElement('h5');
				h5.setAttribute('id','choiceDestination_'+(part*100+structuredLines[i][1]));
				h5.innerText="If choice "+structuredLines[i][1]+" was picked"
				thisPartDiv.appendChild(h5);
				break;
			case OPCODES.SPEAKER:
				let realName;
				let realNameID;

				let operand = structuredLines[i][1] //Aka the name ID
				if (isNaN(operand))
				{
					realName = operand;
					realNameID=-1;
				}
				else
				{
					if (operand==0)
					{
						realName=""
						realNameID=operand
					}
					else if (NAMES[operand])
					{
						for (var zzzz=0;zzzz<currentLanguage.length;zzzz++)
						{
							var n = NAMES[operand][LANGUAGE_COLUMN[currentLanguage[zzzz]]-1]
							if (n && n!= "")
							{
								realName = n;
								break;
							}
						}
						//if (n==undefined)
						//	realName=operand+" (Portrait DB out of date! Tell HoP to fix database.json!)";
						realNameID=operand;
					}
					else
						realName=operand+" (Portrait DB out of date! Site owner needs to redump PartnerPosterData.tsv and/or TextMap.tsv!)";

				}
				// This is checking a string instead of an ID because
				// we want to handle strings being set without an ID,
				// but there are NO files that don't use an ID
				if (lastSpeakerName[0] != realName)
				{
					lastSpeakerName[0]=realName
					lastSpeakerName[1]=realNameID
					didNameChange = true
				}
				else
				{
					//console.log("speaker command was called but already matches previous speaker...");
				}
				break;
			case OPCODES.CREDITS:
				console.assert(structuredLines[i][1]);
				var creditsDiv = document.createElement('div');
				creditsDiv.setAttribute('style','text-align:center;font-family:serif;');
				if (CREDITSDATA)
				{
					creditsDiv.innerHTML = parseGFLTextModifiers(CREDITSDATA[structuredLines[i][1]])
				}
				else
				{
					creditsDiv.setAttribute('missionID',structuredLines[i][1]);
					console.log("Fetching credits data...")
					/*console.log("fetching "+fileName);
					const response = await fetch("avgtxt/"+fileName);
					const out = await response.text();
					console.log("got "+fileName);*/
					fetch('Language_AVG_US.txt')
					.then(response => response.text())
					.then(response => {
						console.log("credits data loaded!");
						CREDITSDATA = {}
						response.split(/\r?\n/).forEach(l => {
							if (l) { //Gotta check if the string is not empty
								let kv = l.split('|')
								//debugger;
								CREDITSDATA[parseInt(kv[0])]=kv[1]
							}
						})
						let interval=setInterval(function(){
							let nBGs = document.querySelectorAll('div[missionID]');
							if (nBGs.length == 0)
							{
								console.log("CreditsData: waiting for DOM to be ready before setting credits div for "+mID+"...");
								return;
							}
							nBGs.forEach(el => {
								el.innerHTML = parseGFLTextModifiers(CREDITSDATA[el.getAttribute('missionID')])
							});
							console.log("Set creditsDiv, exiting background task.");
							clearInterval(interval);
						},100);
					});
				}
				thisPartDiv.appendChild(creditsDiv);
				break;
			/*case OPCODES.CREDITS2:
				//TODO
				//debugger;
				var creditsDiv = document.createElement('div');
				creditsDiv.innerHTML="<span class='coloredDialogue' style='color:red'>Credits2 command not implemented yet...</span>"
				creditsDiv.setAttribute('style','text-align:center;font-family:serif;');
				thisPartDiv.appendChild(creditsDiv);
				break;
				*/
			case OPCODES.VIDEO:
				
				var creditsDiv = document.createElement('div');
				creditsDiv.setAttribute('class','bg');
				creditsDiv.style = "width:100%; position:relative; display:block;";
				creditsDiv.setAttribute('style','text-align:center;font-family:serif;');
				creditsDiv.innerHTML="<video style='width:100%;' controls><source src='video/"+structuredLines[i][1]+".mp4' type='video/mp4;'><p>Your browser does not support MP4!!</p></video>"
				thisPartDiv.appendChild(creditsDiv);
				creditsDiv.firstElementChild.addEventListener("play", function() {
					document.getElementById('audioPlayer').pause();
				});
				
				//numStoryBoxRendered++;
				break;
			case OPCODES.PORTRAIT:
				if (!fancyDisplayType)
					break;
				shownPortraits = [];
				didPortraitsChange = true;
				//print(structuredLines[i])
				for (pidx = 1;pidx<structuredLines[i].length;pidx++)
				{
					let portrait = structuredLines[i][pidx];
					//[charID,charSpr,shouldDim,shouldMask,x,y]
					let name = portrait[0]
					let type = portrait[1]

					//As you can see, it pushes no matter what because we want to be accurate to the game...
					//So basically there's no point in checking at all
					if (name<0)
					{
						shownPortraits.push(portrait);
						continue;
					}

					if (PORTRAITS[name] && PORTRAITS[name].num >= type)
					{
						shownPortraits.push(portrait);
						//console.log("NumPortraits: "+shownPortraits.length);
					}
					else if (PORTRAITS[name])
					{
						if (debugMode)
						{
							let p = document.createElement('p');
							p.innerHTML = "<span class='coloredDialogue' style='color:red'>PORTRAIT TYPE MISSING BELOW "+portraitStructToString(portrait)+"</span>";
							p.classList.add("storyText");
							thisPartDiv.appendChild(p);
						}
					
						consoleWarn("Portrait type missing. Falling back to default.")
						consoleWarn("idx: "+shownPortraits.length+" | "+portraitStructToString(portrait))
						shownPortraits.push(portrait.slice(0)); //Clone array.. Maybe it's not necessary since I regenerate from scratch anyways
						shownPortraits[shownPortraits.length-1][1]=0
						
						
					}
					else
					{
						if (debugMode)
						{
							let p = document.createElement('p');
							p.innerHTML = "<span class='coloredDialogue' style='color:red'>PORTRAIT MISSING BELOW: "+portrait[0]+"</span>";
							p.classList.add("storyText");
							thisPartDiv.appendChild(p);
						}
						consoleWarn(portraitStructToString(structuredLines[i]))
						consoleWarn("Portrait missing from database.")
						shownPortraits.push(['missing',0,portrait[3],portrait[4]]);
					}
				};
				//console.log(shownPortraits)
				break;
			case OPCODES.BG:
				if (!fancyDisplayType)
					break;
					
				
				let newBG = structuredLines[i][1]
				if (newBG != lastBGUsed)
				{
					lastBGUsed=newBG;
					didBGChange=true;
				}
				break;
			case OPCODES.FADEIN:
				isNight=false;
				break;
			case OPCODES.SNOWEFFECT:
				snowEffect = true;
				break;
			case OPCODES.STOPEFFECTS:
				snowEffect = false;
				break;
			case OPCODES.MSG:
				//Spawn new BG with speaker and portrait here.
				
				//Is this even needed? It would just show 'undefined' anyways
				let message = "XXX (If you can see this, either something has gone horribly wrong with the interpreter or the textmap is outdated)";

				for(let jj=0; jj < currentLanguage.length; jj++)
				{
					let languageColumn = LANGUAGE_COLUMN[currentLanguage[jj]]+1; //Have to add +1 because 0th element is the "msg" tag
					if (languageColumn > structuredLines[i].length)
						continue; //Don't break on this because the columns aren't in order, they could be 1,5,9,2,3 etc
					let thisLine = structuredLines[i][languageColumn]
					//console.log(currentLanguage[jj]+": "+languageColumn);
					//console.log(structuredLines[i][languageColumn]);

					// Don't do simple truthy check on the string because then empty strings will break...
					if (thisLine != undefined)
					{
						if (amCrypt_k > 0 && thisLine.startsWith("$AMW "))
						{
							thisLine = amaryllisCrypt(thisLine.substr(5), amCrypt_k)
						}
						message = parseGFLTextModifiers(thisLine, translationNoteDisplayType);
						break;
					}
				}
					
				if (fancyDisplayType)
				{
					if (didBGChange || didNameChange || didPortraitsChange)
					{
						if ((!skipGenerationOfDuplicateBoxes && didNameChange) || (didBGChange || didPortraitsChange))
						{
							let storyBox = document.createElement('div');
							if (quickScroll)
							{
								//It's impossible to not have quickScroll unless it works backwards... So just ignore the errors on the last box I guess
								//TODO: Make it not error on the last box... I don't think that's actually possible
								storyBox.classList.add("pointer");
								storyBox.setAttribute('id','storyBox'+numStoryBoxRendered)
								storyBox.setAttribute('onclick',"document.getElementById('storyBox"+(numStoryBoxRendered+1)+"').scrollIntoView({behavior:'auto',block:'center',inline:'center'});")
								numStoryBoxRendered++;
							}
							if (SETTINGSMAN.keyboardNavigation)
							{
								storyBox.setAttribute("tabindex","0");
								storyBox.addEventListener("keydown",keyboardHandlerForStoryBox);
							}
							storyBox.classList.add('storyImg');
							let bgImage = document.createElement('img');
							bgImage.setAttribute('class','bg');
							bgImage.style = "width:100%; position:relative; display:block;";
							
							//It is entirely possible for there to be text without a BG being set, for some reason. It defaults to 9.
							//This hack just checks if there's portraits and sets it, otherwise it skips BG generation
							if (lastBGUsed == undefined && shownPortraits.length > 0)
								lastBGUsed = "black";
							
							if (lastBGUsed != undefined)
							{
								//If 10, a fully transparent image is used and meant to show the stage underneath. So instead pick PlaybackBG1/PlaybackBG2.
								//Read GF Syntax Information.md for more information.
								//print(lastBGUsed)
								if (lastBGUsed == 10)
								{
									bgImage.src = isNight ? 'avgtexture/PlaybackBG2.png' : 'avgtexture/PlaybackBG1.png'
								}
								else if (lastBGUsed.startsWith("gfl://"))
								{
									bgImage.src = "http://gfl.amaryllisworks.pw/avgtexture/"+lastBGUsed.slice(6)+'.png'
								}
								else
									bgImage.src = 'avgtexture/'+lastBGUsed+'.png'
								
								bgImage.setAttribute('bg',lastBGUsed);
								//I don't think MICA ever accidentally colored the black wallpaper so I probably don't need to check
								if (false) //If this is a night background
								{
									if (!nightBackgrounds[lastBGUsed[0]]) //If background not generated yet
									{
										bgImage.classList.add('nightBG');
										if (!nightBGQueue[lastBGUsed[0]]) //If not queued for generation yet
										{
										
											bgImage.onload = function(){ //Wait for image to finish loading. Then run nightFilter on img. Not that onload != DOM is ready! That's why there's a background task below.
												let bgName = bgImage.getAttribute('bg')
												nightBackgrounds[bgName]=nightFilter(bgImage)
												console.log("NightBG: Generated "+bgName);
												bgImage.onload = null;
												
											}
											console.log("Queued generation of "+lastBGUsed[0]);
										
											//Use this array for storing background task.
											//This task will check every 100 if night BG is generated and if all the night BG boxes are rendered and ready to be set.
											nightBGQueue[lastBGUsed[0]]=setInterval(function(bgNum){
												let nBGs = document.querySelectorAll('img.bg.nightBG[bg="'+bgNum+'"]'); //ex. document.querySelectorAll('[bg="2"]')
												if (nBGs.length == 0 || !nightBackgrounds[bgNum])
												{
													console.log("NightBG: waiting for generation of bg "+bgNum+" to finish or DOM to be ready...");
													return;
												}
												nBGs.forEach(el => {
													el.src=nightBackgrounds[el.getAttribute('bg')]
													//el.classList.remove('nightBG');
												});
												console.log("NightBG: set night BGs for "+bgNum+", killing background task "+nightBGQueue[bgNum]);
												let t = nightBGQueue[bgNum]
												clearInterval(t);
											},100,lastBGUsed[0]);
											
											
											

										}
									}
									else
									{
										bgImage.src=nightBackgrounds[lastBGUsed[0]];
									}
								}
								storyBox.appendChild(bgImage);
							}
							
							for(var j=0;j<shownPortraits.length;j++)
							{
								if (!shownPortraits[j])
								{
									//console.log(structuredLines.slice(0,i));
									console.log(structuredLinesToString(structuredLines.slice(0,i)));
									debugger; //Because console.assert does not pause
								}
								else if (shownPortraits[j][0]<0) //Skip generating this one
									continue;

								let portraitHolder = document.createElement('div');
								let portraitImg = document.createElement('img');
								portraitImg.classList.add("portrait");
								portraitHolder.appendChild(portraitImg);

								let portraitData = PORTRAITS[shownPortraits[j][0]];

								//In case you forgot, it's ID and Type
								if (shownPortraits[j][0]=="missing")
									portraitImg.src = "pic/missing.png";
								else
									portraitImg.src = 'pic/'+portraitData.src+".png";
								
								//Add expression
								if (shownPortraits[j][1] > 0)
								{
									let expressionImg = document.createElement("img");
									expressionImg.setAttribute("style",portraitData.css);
									expressionImg.src = "pic/"+portraitData.src+"_" + ("000" + shownPortraits[j][1]).slice(-3)+".png"
									portraitHolder.appendChild(expressionImg)
								}
								
								//console.log(portraitImg.src);
								if (debugMode)
								{
									if (shownPortraits[j].length > 4)
										portraitHolder.setAttribute('title',"ID: "+shownPortraits[j][0]+" | TYPE: "+shownPortraits[j][1]+ " | OFFSET: "+shownPortraits[j][4]+","+shownPortraits[j][5]);
									else
										portraitHolder.setAttribute('title',"ID: "+shownPortraits[j][0]+" | TYPE: "+shownPortraits[j][1]);
								}
								
								portraitHolder.classList.add("storydoll");
								if (shownPortraits[j][2]==true)
									portraitHolder.classList.add('dim')
								portraitHolder.classList.add(int2strPos[j+1]);
								portraitHolder.classList.add(int2str[shownPortraits.length]);

								if (shownPortraits[j].length > 5 && shownPortraits[j][6] != 1.0)
								{
									let zoom = shownPortraits[j][6]
									portraitHolder.setAttribute("style","width:"+(70*zoom)+"%; bottom:-"+(60*zoom)+"%; left:0%") //"+(35/zoom)+"
								}

								storyBox.appendChild(portraitHolder);
							}
							
							if (snowEffect && advancedCSS)
								storyBox.appendChild(snowDiv.cloneNode(false));
							
							thisPartDiv.appendChild(storyBox);
						}
						/*if (inlineText)
						{
							let textboxDiv = document.createElement('div');
							if (inlineText)
								textboxDiv.style="color:white; position: absolute; bottom: 0%; width:100%; z-index: 100; padding-top: 30px; padding-bottom:10px; background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%)"
							if (lastSpeakerName != "")
							{
								let p = document.createElement('p');
								p.innerText = lastSpeakerName;
								if (inlineText)
									p.style="margin-left: 10px; margin-right:10px;"
								//p.innerHTML = "<b>"+lastSpeakerName+"</b>";
								p.classList.add("storyText");
								p.classList.add("speakerName");
								textboxDiv.appendChild(p);
							}
							storyBox.appendChild(textboxDiv)
							
							
							thisPartDiv.appendChild(storyBox);
						}
						else
						{*/
							
							if (lastSpeakerName[0] != "")
							{
								let p = document.createElement('p');
								p.innerText = lastSpeakerName[0];
								//p.innerHTML = "<b>"+lastSpeakerName+"</b>";
								p.classList.add("storyText");
								p.classList.add("speakerName");
								if (debugMode)
								{
									p.setAttribute('title',"ID: "+lastSpeakerName[1])
								}
								thisPartDiv.appendChild(p);
							}
						//}
						
						didBGChange = false;
						didPortraitsChange = false;
						didNameChange = false;
					}
					
					//No, it's not well written. No, I don't know how to fix it.
					/*if (inlineText)
					{
						let p = document.createElement('p');
						p.classList.add('storyText')
						p.style="color:white; margin-left: 10px; margin-right:10px; margin-bottom:5px; margin-top: 5px;"
						p.innerHTML = message;
						let d = thisPartDiv.lastChild.getElementsByTagName('div')[0].appendChild(p);
					}
					else
					{*/
						
						if (!SETTINGSMAN.multilanguageEnabled)
						{

							let p = document.createElement('p');
							p.classList.add('storyText')
							p.innerHTML = message;
							thisPartDiv.appendChild(p);
						}
						else
						{
							let table = document.createElement('table');
							table.setAttribute("style","border: 1px solid black; margin-bottom:10px;");
							let tbody = document.createElement("tbody");
							let _tr = document.createElement('tr');
							let dialogue = structuredLines[i]
							table.setAttribute("text-id",dialogue[1])


							if (SETTINGSMAN.keyboardNavigation)
							{
								table.setAttribute("tabindex","0");
								table.addEventListener("keydown",keyboardHandlerForMultiLangBox);
							}

							let enabledLanguages = SETTINGSMAN.multiLanguage;
							let reversedLanguageKeys = Object.keys(LANGUAGE_COLUMN);

							//0 is msg opcode, 1 is text ID, so start at 2
							for (let ii=2;ii<dialogue.length;ii++)
							{

								let langName = LANGUAGE_NAMES[ii-1];
								let langKey = reversedLanguageKeys[ii-1];
								if (enabledLanguages.includes(langKey))
								{

									let text = dialogue[ii];
									if (amCrypt_k > 0 && (ii-1)==LANGUAGE_COLUMN.cn && text.startsWith("$AMW "))
									{
										text = amaryllisCrypt(text.substr(5), amCrypt_k)
									}


									let tr = _tr.cloneNode(true);
									let allowCopy=(customLanguage != undefined);

									if (text == undefined)
										text="(No text for this language)"
									else
									{
										//Hack to skip english
										//allowCopy= ii>2 && (customLanguage[dialogue[1]]==undefined || customLanguage[dialogue[1]]==="")
										tr.setAttribute("raw-dialogue",dialogue[ii]);
										text=parseGFLTextModifiers(text, translationNoteDisplayType)
									}

									tr.setAttribute("lang",langKey);
									let trInner = "<td>"
										trInner += langName;
										if (debugMode && ii==2)
										{
											trInner+="<br> "+dialogue[1] //Add TextMap ID
										}
										//print(trInner)
										//debugger;
										if (allowCopy)
										{
											trInner+=" <a style='cursor:pointer;'><i class='material-icons' title='copy into Custom'>content_copy</i></a>"
										}
									//End left side, begin right side that contains the text
									trInner+="</td><td style='word-wrap:anywhere;'>"

										//print(trInner)
										//debugger;
									if (true) //Append MTL to text var if it exists
									{
										if (ii==LANGUAGE_COLUMN.cn+1 && dialogue[LANGUAGE_COLUMN.deepl_cn+1])
										{
											text+="<br>"+dialogue[LANGUAGE_COLUMN.deepl_cn+1]
											tr.setAttribute("mtl-raw-dialogue",dialogue[LANGUAGE_COLUMN.deepl_cn+1]);
										}
										else if (ii==LANGUAGE_COLUMN.jp+1 && dialogue[LANGUAGE_COLUMN.deepl_jp+1])
										{
											text+="<br>"+dialogue[LANGUAGE_COLUMN.deepl_jp+1]
											tr.setAttribute("mtl-raw-dialogue",dialogue[LANGUAGE_COLUMN.deepl_jp+1]);
										}
									}
									//Insert text content into <td>
									trInner+=text+"</td>"
									//print(trInner)
									tr.innerHTML=trInner

									//This has to be done AFTER because otherwise the 'a' element doesn't exist yet
									if (allowCopy)
									{

										tr.getElementsByTagName("a")[0].addEventListener("click",function(ev){
											
											let tmpppp = tr.getAttribute("mtl-raw-dialogue");
											if (tmpppp == "" || tmpppp == undefined)
												tmpppp=tr.getAttribute("raw-dialogue");

											//TODO: This probably shouldn't be saving to disk here, but the edit handler pulls this information from customLangauge dict
											customLanguage['data'][dialogue[1]]=tmpppp; //Copy clicked mtl to customLanguage
											customLanguage['timestamp'][dialogue[1]]=Math.round(new Date().getTime() / 1000)
											localStorage.setItem("customLanguage",JSON.stringify(customLanguage));
											
											tbody.querySelector("[lang=custom]").getElementsByTagName('a')[0].click()
											
										})
									}

									tbody.appendChild(tr)
								}
								
							}

							if (customLanguage != undefined && customLanguage.hasOwnProperty('data'))
							{
								
								let dialogueID = dialogue[1]
								let text = parseGFLTextModifiers(customLanguage?.['data'][dialogueID] || "", translationNoteDisplayType);
								let cust_icon = customLanguage['data'][dialogueID]!=undefined ? "<i class='material-icons' title='Edit existing translation'>create</i>" : "<i class='material-icons' title='Add new translation'>add</i>"
								if (SETTINGSMAN.highlightEmptyTranslations) 
								{
									if (customLanguage['data'][dialogueID]==undefined)
									{
										table.style.backgroundColor="rgba(100%,0%,0%,50%)";
									}
									else if (dialogue[LANGUAGE_COLUMN.en_re+1] && customLanguage['data'][dialogueID] != dialogue[LANGUAGE_COLUMN.en_re+1])
									{
										//console.log(customLanguage[dialogueID], "!=", dialogue[LANGUAGE_COLUMN.en_re+1])
										table.style.backgroundColor="rgba(0%,0%,100%,50%)";
									}
								}
								//let icon_name = customLanguage[dialogue[1]]!=undefined ? "create" : "add";

								let tr = _tr.cloneNode(true);
								tr.setAttribute("lang","custom");
								let trInner = "<td>Custom <a style='cursor:pointer;'>"+cust_icon+"</a>"
								/*if (customLanguage[dialogue[1]]==undefined)
								{
									trInner+="<a style='cursor:pointer;'><i class='material-icons' title='copy from CN'>content_copy</i></a>"
								}*/
								trInner+="</td>"
								
								trInner+="<td><span text-id='"+dialogueID+"'>"+text+"</span>"
								trInner+='<div class="input-field col s12" style="display:none">'
								trInner+='<textarea id="textarea"'+dialogueID+' class="materialize-textarea"></textarea>'
								//Is this even necessary?
								//trInner+='<label for="textarea'+dialogueID+'">ID:'+dialogueID+'</label>'
								trInner+='</div></td>'
								tr.innerHTML=trInner
								
								let icon = tr.getElementsByClassName("material-icons")[0]
								let editHandlerFunc = function(event, saveChanges=true){
									//print(event);
									if (icon.innerText=="add")
										icon.innerText="create"
									//console.log(tr);
									let textCol = tr.childNodes[1];
									//console.log(textCol);
									let span = textCol.getElementsByTagName("span")[0]
									let textDiv = textCol.getElementsByTagName("div")[0]
									if (span.style.display == "none") //If currently editing text, switch to displaying
									{
										textDiv.setAttribute("style","display:none")

										if (saveChanges)
										{
											let text = textCol.getElementsByTagName("textarea")[0].value.replaceAll("\n","//n")
											span.innerHTML = parseGFLTextModifiers(text, translationNoteDisplayType) //Yes it's innerHTML, </i> is supported

											const textkey = parseInt(span.getAttribute('text-id'))
											if (text != customLanguage['data'][textkey])
											{
												customLanguage['data'][textkey] = text
												customLanguage['timestamp'][textkey] = Math.round(new Date().getTime() / 1000)
												console.log("Updated customLanguage ["+textkey+"]: "+text)
												localStorage.setItem("customLanguage",JSON.stringify(customLanguage));
											}
											/*else
											{
												console.log("["+textkey+"] Text is identical to previous, no need to save")
											}*/
										}
										
										span.setAttribute("style","")
										//Allow for editing the text again (Using Ctrl+E) if keyboard controls are enabled
										table.focus();
									}
									else //If currently displaying text, switch to editing
									{
										span.setAttribute("style","display:none")
										textCol.getElementsByTagName("textarea")[0].value = (customLanguage['data'][span.getAttribute('text-id')] || "").replaceAll("//n","\n")
										M.textareaAutoResize(textCol.getElementsByTagName("textarea")[0])
										textDiv.setAttribute("style","")
										textCol.getElementsByTagName("textarea")[0].focus();
										//textCol.getElementsByTagName("textarea")[0].select();
									}
								}

								tr.getElementsByTagName("textarea")[0].addEventListener("keydown", function(event){
									if (event.key == "Enter" && !event.shiftKey)
									{
										editHandlerFunc(event)
										return false;
									}
									else if (event.key == "Escape")
									{
										//console.log("Escape pressed")
										editHandlerFunc(event, false)
										return false;
									}
									//console.log(event)
									return event.keyCode != 13;
								})
								tr.getElementsByTagName("a")[0].addEventListener("click", editHandlerFunc)
								tbody.appendChild(tr)
							}
							table.appendChild(tbody);
							thisPartDiv.appendChild(table);
						}
					//}
				}
				else
				{
					let p = document.createElement('p');
					if (lastSpeakerName == "")
						p.innerHTML = message;
					else
						p.innerHTML = lastSpeakerName[0] + ": "+message;
					thisPartDiv.appendChild(p);
				}
				break;
			default:
				//console.log("unknown OPCODES..");
		}
	}
	return thisPartDiv;
}

//You're probably wondering why the fuck there's two of these functions when a routableKeyString is always passed in
//That's because I want to support running from an episode object without the keyString (for user stuff)
/**
 * Description
 * @param {string?} value a routable key string. If none given, reloads the last loaded episode.
 * @returns {boolean} Whether it was able to run or not. Failure usually indicates an invalid keystring being passed in.
 */
function runFromRoutableKeyString(value)
{
	if (value == undefined)
		value = curEpKey;

	const expandRange = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

	let episodeRoutingNames = value.replaceAll("--",";").split(";")
	if (episodeRoutingNames.length > 1 || value.includes("[")) //We have a string in the form similar to "ExtData-1696-1701.json--StoryKyusyoData-chapter-0-2.json";
	{
		let episodes = [];
		let filterKeys = [];

		episodeRoutingNames.forEach(epNameAndBrackets => {
			//Match up to [] OR end of string if no []
			const epName = epNameAndBrackets.match(/(.+?)(\[|$)/);
			if (epName) {
		
				let [type, chapter, episode] = getKeysFromRoutableString(epName[1]);
				let ret = CHAPTER_DB?.[type]?.[chapter]['episodes']?.[episode];
				if (ret)
				{
					episodes.push(ret);

					//Check if [] after the episode name
					const numbersMatch = epNameAndBrackets.match(/\[(.+?)\]/);
					if (numbersMatch) {
						if (numbersMatch[1].includes("-"))
							// Split a string like "1-4" into ["1","4"] 
							// then convert into a num array with .map(Number) so it becomes
							// [1,4]
							// Then call expandRange using ... so it gives the arguments like expandRange(1,4)
							// Then expandRange(1,4) will return [1,2,3,4]
							filterKeys.push(expandRange(...numbersMatch[1].split("-",2).map(Number)))
						else
						{
							filterKeys.push(numbersMatch[1].split(',').map(Number));
						}
					} else {
						filterKeys.push([]); // Generate an empty array if no brackets are found
					}
				}
				else
				{
					console.warn(epName[1]+" not found in routing data?");
				}
				
			}
		})
		if (episodes.length > 0)
		{
			//debugger;
			run(episodes, episodeRoutingNames[0], filterKeys)
			return true;
		}
	}
	else
	{
		let [type, chapter, episode] = getKeysFromRoutableString(value)
		let ret = CHAPTER_DB?.[type]?.[chapter]['episodes']?.[episode]
		if (ret)
		{
			run(ret, value)
			return true;
		}
	}
	return false;
}
/*function runFromFileString(value)
{
	if (value == undefined)
		value = curEpKey;
}*/


function runFromUserInput()
{

}


/**
 * Description
 * @param {dict|dict[]} episode An episode dict object from chapterDatabase.json. Or if you want to have multiple, you can pass an array of episode objects.
 * @param {string} routableKeyString Any string like "type-chapter-episode" (Only used internally, optional)
 * @param {number[][]} filterKeys An array of arrays containing the part IDs to render with the interpreter. If null or empty, renders all parts contained in an episode object.
 */
async function run(episode, routableKeyString="", filterKeys=null)
{

	currentEpisodeAsOpcodes = [];
	curEpisodePart = 0;
	curEpKey = routableKeyString;

	let episodes = []
	if (Array.isArray(episode))
	{
		episodes = episode;
		episode = episodes[0];
	}
	else
	{
		episodes.push(episode);
	}
	
	const lang = currentLanguage[0]
	let lang_idx = Object.keys(LANGUAGE_COLUMN).indexOf(lang)
	if (lang=="en_abridged")
		lang_idx=Object.keys(LANGUAGE_COLUMN).indexOf("en_re");

	let epName = episode.name_multilang?.[lang_idx] || episode.name;
	for (let i = 1; i < episodes.length; i++) //Start at 1!
	{
		epName += " & " + (episodes[i].name_multilang?.[lang_idx] || episodes[i].name);
	}
	document.getElementById('chapterName').innerText = epName;


	let chapterDesc = document.getElementById('chapterDesc')
	chapterDesc.style.display = ('description' in episode ? "inherit" : "none")
	if ('description' in episode)
	{
		let text = episode.description_multilang?.[lang_idx] || episode['description']
		//console.log(text)
		for(var ccc = 0; ccc < 5; ccc++)
		{
			let idx = text.indexOf("#(");
			if (idx != -1)
			{
				//print('parsing colors: '+message);
				let end = text.indexOf('#)',idx)
				//console.log(color)
				let spanTagStart = "<span class='coloredDialogue' style='color:deepskyblue;'>"
				text = text.slice(0,idx)+spanTagStart+text.slice(idx+2,end)+"</span>"+text.slice(end+2)
				//console.log("new msg: "+message);
			}
		}
		chapterDesc.innerHTML=text
	}
	
	//Don't keep audio running
	document.getElementById('audioPlayer').pause();
	
	
	//Instead of just one part, put all of them in the verySimpleText div.
	let NewSimpleTextDiv = document.createElement('div');
	NewSimpleTextDiv.id="verySimpleText";
	
	/*let exporterButton = document.createElement('a');
	exporterButton.setAttribute("class","waves-effect waves-light btn modal-trigger");
	exporterButton.setAttribute("href","#savePageModal");
	exporterButton.innerText="Export options..."
	NewSimpleTextDiv.appendChild(exporterButton);
	NewSimpleTextDiv.appendChild(document.createElement('br'));*/

	/*async function getFromURLs(urls)
	{
		return Promise.all(urls.map(ep => fetch("avgtxt/"+ep).then(response => response.json())))
	}*/
	//With Promise.all we guarentee sequential fetches (requests are async, but wait until finish)
	let episodeDatas = await Promise.all(
		episodes.map(ep => 
			fetch("avgtxt/"+ep.parts)
			.then(response => response.json())
		)
	);
	if (filterKeys?.length > 0)
	{
		//debugger;
		for (let i = 0; i < filterKeys.length; i++)
		{
			if (Array.isArray(filterKeys[i]) && filterKeys[i].length > 0)
			{
				//Now for a very stupid problem... The episodeData is indexed by dict key, but the part names aren't.
				//So we have to map part names to keys and then return them afterwards.
				const thisEpisodeData = episodes[i]
				let clone = Object.assign({}, thisEpisodeData);
				//Convert part_names into a dict instead of an array
				clone['part_names'] = {}
				const part_names = thisEpisodeData['part_names'];
				const part_keys = Object.keys(episodeDatas[i]);
				for (let kk = 0; kk < part_names.length; kk++)
				{
					clone['part_names'][part_keys[kk]] = part_names[kk]
				}
				//debugger;

				const dictionary = episodeDatas[i];
				const keysArray = filterKeys[i];
				const filteredDictionary = keysArray.reduce((acc, key) => {
					//If key in episode, assign episode[key] to new dict (named acc), return acc
				  if (key in dictionary) acc[key] = dictionary[key];
				  return acc;
				}, {});
				clone['part_names'] = keysArray.reduce((acc, key) => {
					if (key in clone['part_names']) acc[key] = clone['part_names'][key];
					return acc;
				}, {});

				console.log(`Filtered parts from episodeDatas: ${Object.keys(dictionary)} -> ${Object.keys(filteredDictionary)}`)
				console.log(`${thisEpisodeData['part_names']} -> ${Object.values(clone['part_names'])}`)
				episodeDatas[i] = filteredDictionary;
				clone['part_names'] = Object.values(clone['part_names']);
				episodes[i] = clone;
			}
		}
	}

	//Now we have episode data from server, OK to render!
	let partNum = 0;
	let totalParts = episodeDatas.flatMap(m => Object.keys(m)).length;

	//Need for loop instead of forEach because we need to access episodes array as well as episodeDatas.
	for (var p = 0; p < episodes.length; p++)
	{
		//Each part is a dict indexed the part ID and containing an array of structured lines
		let thisEp = episodeDatas[p];
		var keys = Object.keys(thisEp)
		for(var j = 0; j < keys.length; j++)
		{
			let partName = episodes[p].part_names?.[j]
			/*if (episode['part_names'] != undefined)
			{
				//print(episode['part_names'][j]);
				partName=episode['part_names'][j]
			}*/

			let structuredLines = thisEp[keys[j]]
			for(i=0;i<structuredLines.length;i++)
			{
				structuredLines[i][0]=opcode2string.indexOf(structuredLines[i][0])
				//console.log(opcode2string.indexOf(data[i][0]))
			}

			
			if (document.getElementById('showDebugOpcodeButton').checked)
			{
				let button2 = document.createElement('a');
				//fuck your javascript
				button2.setAttribute("class","waves-effect waves-light btn");
				button2.setAttribute("href","avgtxt/"+episodes[p]["parts"]);
				//console.log(episodes[p]["parts"]);
				button2.innerText="original text file for this section (For debugging)"
				NewSimpleTextDiv.appendChild(button2);
				NewSimpleTextDiv.appendChild(document.createElement('br'));
				
			}
			console.log("Render ep "+p+", part "+j+" (Total "+(partNum+1).toString()+"/"+totalParts+"). ");
			NewSimpleTextDiv.appendChild(renderStructuredLinesToDiv(structuredLines,partNum,partName,false,totalParts));
			//Now replace the old div...
			/*let textboxDiv = document.getElementById("Textboxes");
			textboxDiv.parentNode.replaceChild(newTextboxDiv,textboxDiv);*/
			
			//currentEpisodeAsOpcodes.push(structuredLines);
			partNum++;
		}
	}

	let simpleTextDiv = document.getElementById("verySimpleText")
	simpleTextDiv.parentNode.replaceChild(NewSimpleTextDiv,simpleTextDiv);
	
	/*if (episodes.length == 1)
	{
		window.location.assign("#"+episode.parts)
	}*/
	setCookie('lastViewedScene',episode.parts,180);
	window.document.title = "GGZ S.I. - "+episode['name'];

	/*episodes.forEach(ep => {
		let fileName = episode.parts;


		//We have to await so it doesn't load the parts in the wrong order. Which is an actual thing that has happened.
		console.log("fetching "+fileName);
		
		fetch("avgtxt/"+fileName)
		.then(response => response.json())
		
	})*/
	
}

function reRunWithNewOpcodes()
{
	let lines = document.getElementById("DebugTextArea").value;
	//console.log(lines);
	let newStructuredLines = stringToStructuredLines(lines);
	console.log(newStructuredLines)
	currentEpisodeAsOpcodes[curEpisodePart] = newStructuredLines;
}

function showOpcodes(divId) {
	let x = document.getElementById(divId);
	if (x.style.display === "none") {
		x.style.display = "block";
		let t = x.getElementsByTagName('textarea')[0]
		console.log(t.scrollHeight);
		t.style.height = Math.min(t.scrollHeight, 500) + "px";
	} else {
		x.style.display = "none";
	}
}

/**
 * @param {number} type
 * @param {number} chapter
 * @param {number} episode
 * @returns {string}
 */
function getRoutableKeyString(type,chapter,episode)
{
	return type+'-'+chapter+'-'+episode
}

/**
 * @param {string} s A routable string, which can either be a string of ints in the form of "type-chapter-episode" OR the file name of the file.
 * @returns {number[]} Returns the routing strings for chapterDatabase.json.
 */
function getKeysFromRoutableString(s)
{
	let maybe = ROUTING[s]
	if (maybe)
		s = maybe;
	return s.split('-');
}

function onChapterSelected(value)
{
	console.log(value);
	//let [type,chapter,episode] = getKeysFromRoutableString(value)
	runFromRoutableKeyString(value)
}
function goToPrevEpisode()
{
	//To make it jump to the top
	document.getElementById('chapterName').scrollIntoView()
	
	let value = curEpKey;
	console.log(value);
	let [type,chapter,episode] = getKeysFromRoutableString(value)
	episode--;
	if (CHAPTER_DB[type][chapter]['episodes'][episode])
	{
		runFromRoutableKeyString(getRoutableKeyString(type,chapter,episode))
		return true;
	}
	else
	{
		chapter--;
		episode = CHAPTER_DB[type][chapter]['episodes'].length-1;
	}
	
	if (CHAPTER_DB[type][chapter]['episodes'][episode])
	{
		runFromRoutableKeyString(getRoutableKeyString(type,chapter,episode))
		return true;
	}
	
	return false;
}
function goToNextEpisode()
{
	//To make it jump to the top
	document.getElementById('chapterName').scrollIntoView()
	
	let value = curEpKey;
	console.log(value);
	let [type,chapter,episode] = getKeysFromRoutableString(value)
	episode++;
	if (CHAPTER_DB[type][chapter]['episodes'][episode])
	{
		//runFromRoutableKeyString(getRoutableKeyString(type,chapter,episode))
		window.location.hash = CHAPTER_DB[type][chapter]['episodes'][episode]['parts']
		return true;
	}
	else
	{
		chapter++;
		episode = 0;
	}
	
	if (CHAPTER_DB[type][chapter]['episodes'][episode])
	{
		//runFromRoutableKeyString(getRoutableKeyString(type,chapter,episode))
		window.location.hash = CHAPTER_DB[type][chapter]['episodes'][episode]['parts']
		return true;
	}
	
	return false;
}

function generateTables() {
	
	console.log(CHAPTER_DB);
	
	var _dropDownTrigger_ = document.createElement('a');
	_dropDownTrigger_.href = "#";
	_dropDownTrigger_.classList.add('dropdown-trigger');
	_dropDownTrigger_.classList.add('btn');
	
	var _dropDown_ = document.createElement('ul');
	_dropDown_.classList.add('dropdown-content');
	
	var _li_ = document.createElement('li'),
		_a_ = document.createElement('a');
	
	//No idea what this is supposed to do.
	_a_.href="#!";
	
	for (const key in CHAPTER_DB)
	{
		//console.log(key)
		let episodeContainer = document.getElementById(key+'Episodes')
		//let trChapterDropdowns = _tr_.cloneNode(false);
		//let trChapterDropdowns = 
		for(let i=0;i<CHAPTER_DB[key].length;i++)
		{
			//let td = _td_.cloneNode(false);
			let flexBoxDiv = document.createElement('div');
			/*let select = _select_.cloneNode(false);
			select.setAttribute('id',"selectChapter"+i)
			select.setAttribute('onchange','onChapterSelected(value);');*/
			let dropDownTrigger = _dropDownTrigger_.cloneNode(true)
			dropDownTrigger.setAttribute('data-target','dropdown-'+key+'-'+i)
			if (CHAPTER_DB[key][i].hasOwnProperty('color'))
				dropDownTrigger.setAttribute("style","background-color:"+CHAPTER_DB[key][i]['color'])
			
			if (CHAPTER_DB[key][i].hasOwnProperty('name_short'))
			{
				let s = "<span class='chapterTitles-desktop'>"+CHAPTER_DB[key][i]['name']+"</span>"
				s+=     "<span class='chapterTitles-mobile' translate='"+CHAPTER_DB[key][i]['name_short']+"'>"+CHAPTER_DB[key][i]['name_short']+"</span>"
				dropDownTrigger.innerHTML = s

				dropDownTrigger.firstElementChild.setAttribute("translate",CHAPTER_DB[key][i]['name'])
				//dropDownTrigger.lastElementChild.setAttribute("translate",CHAPTER_DB[key][i].hasOwnProperty("name_multilang") ? CHAPTER_DB[key][i]['name_multilang'] : CHAPTER_DB[key][i]['name'])
			}
			else
			{
				dropDownTrigger.innerText=CHAPTER_DB[key][i]['name']
				//Dumb hack so it translates Chapter %s and not the hardcoded number
				let k = CHAPTER_DB[key][i]['name']
				for (let ii = 1; ii < 9; ii++)
				{
					if (k=="Chapter "+i)
					{
						k = "Chapter %s;"+i
						break;
					}
				}
				dropDownTrigger.setAttribute("translate",k)
			}
			
			let dropdown = _dropDown_.cloneNode(true);
			dropdown.id = 'dropdown-'+key+'-'+i;
			
			//Now let's do the episodes
			let curChapter = CHAPTER_DB[key][i]['episodes'];
			for(let j=0;j<curChapter.length;j++)
			{
				
				let ep = _li_.cloneNode(true);
				//No onclick? How does it work?
				//It uses window.onhashchange() as a router, when the hash changes it will load the file.
				ep.innerHTML = "<a href='#"+curChapter[j]['parts']+"'>"+curChapter[j]['name']+"</a>"
				ep.firstElementChild.setAttribute("translate",curChapter[j]['name'])
				dropdown.appendChild(ep);
				/*let option = _option_.cloneNode(false);
				option.value=getRoutableKeyString(key,i,j)
				option.innerText=curChapter[j]['name'];
				select.appendChild(option);*/
			}
			//flexBoxDiv.appendChild(select);
			flexBoxDiv.appendChild(dropDownTrigger);
			flexBoxDiv.appendChild(dropdown);
			
			episodeContainer.appendChild(flexBoxDiv);
			//td.appendChild(select);
			//trChapterDropdowns.appendChild(td);
		}
	}
	
	//test = new FilterableList(CHAPTER_DB['side'][0]['episodes'],'name',"sideEpisodesWrapper")

	//tbody.appendChild(trChapterDropdowns);
	
	//table.appendChild(thead);
	//table.appendChild(tbody);
	
}

// @type {string[]}
let currentLanguage=['en_re','en','cn']

/**
 * @author RL
 * @date 2021-12-15
 * @param {string[]} lang
 * @returns {undefined}
 */
function setLanguage(lang)
{
	if (lang==undefined)
	{
		lang = [...LanguageSelect.getElementsByTagName("li")].map(el => el.getAttribute("language"))
		//lang = [document.getElementById("language1").value,document.getElementById("language2").value,document.getElementById("language3").value]
	}
	currentLanguage=lang;
	
	try {
		setTranslation(lang[0])
	} catch (error) {
		
	}

	setCookie("language",lang.join(","),180)
	console.log("Set languages to "+lang);
}


// /**
//  * @author RL
//  * @date 2021-12-11
//  * @param {bool} updateCookies=false
//  * @returns {string[]}
//  */
// function getSetMultilangugages(updateCookies=false)
// {
// 	var inputs = document.getElementById("settingsLanguagesColumn").getElementsByTagName("input");
// 	var enabled = [];
// 	for (var i=0; i < inputs.length; i++)
// 	{
// 		let element = inputs[i];
// 		if (element.checked)
// 			enabled.push(element.getAttribute("name"))
// 	}
// 	if (updateCookies==true)
// 		setCookie("multiLanguage",enabled.join(","),180);
// 	return enabled;
// 	//setCookie("multi")
// }

function exportCustomLanguage()
{
	let text = "";
	let keys = Object.keys(customLanguage);
	for (var i = 0; i < keys.length; i++)
	{
		let line = customLanguage['data'][keys[i]];
		text+=keys[i]+"\tXXX\t"+line+"\n";
	}

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', "TextMap_custom.tsv");

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);

}

function deleteCustomLanguage()
{
	customLanguage = {}
	localStorage.setItem("customLanguage","{}")
	document.getElementById("exportLanguageBtn").classList.add("disabled");
	document.getElementById("deleteLanguageBtn").classList.add("disabled");
}

function searchAndSelectTab(){
	var instance = M.Tabs.getInstance(navbarTabs)
	let [type,chapter,episode] = getKeysFromRoutableString(window.location.hash.slice(1))
	if (!type)
		[type,chapter,episode] = getKeysFromRoutableString(getCookie('lastViewedScene'))
	//console.log()
	if (type)
	{
		instance.select(type+"EpisodesWrapper");
		//mainEpisodesWrapper
	}
	//console.log(instance);
}

//Keep this at the bottom
window.onload=function()
{
	//Generate the language options.
	let lang = getCookie("language").split(",")
	//Filter invalid languages
	lang = lang.filter(l => DEFAULT_LANGUAGES.includes(l))
	//Add missing languages
	DEFAULT_LANGUAGES.forEach((lang_id) => {
		if (!lang.includes(lang_id))
			lang.push(lang_id)
	})
	//This has to be done after the tables are generated...
	//setLanguage(lang);
	//console.log(lang)

	
	let langSelect = document.getElementById("LanguageSelect");
	//<li class="collection-item left-icon" style="cursor:grab"><i class="material-icons">drag_handle</i>Alvin</li>
	for (var j = 0; j < lang.length;j++)
	{
		let lang_key = lang[j]
		let lang_name = LANGUAGE_NAMES[LANGUAGE_COLUMN[lang_key]];
		let option = document.createElement("li");
		option.setAttribute("class","collection-item left-icon");
		option.setAttribute("style","cursor:grab");
		option.setAttribute("language",lang[j]);

		option.innerHTML='<i class="material-icons">drag_handle</i>'+lang_name;
		langSelect.appendChild(option);
	}
	//Init the language drag and drop
	new Sortable(langSelect, {
		animation: 150,
		ghostClass:'blue-background-class',
		/*onUpdate: function(event) {
			console.log(event)
		}*/
		onEnd: function(event) {
			//console.log(event)
			setLanguage();
		}
	});


	//Set up the multilanguage options
	/*var multilanguages_enabled = getCookie("multiLanguage").split(",");
	if (getCookie("multiLanguage")=="")
		multilanguages_enabled=['en','cn','jp','en_re'];*/
	for (var i = 0; i < MULTILANGE_OPTIONS.length;i++)
	{
		let lang_key = MULTILANGE_OPTIONS[i];
		let lang_name = LANGUAGE_NAMES[LANGUAGE_COLUMN[lang_key]];
		//for ()
		let label = document.createElement("label");
		label.setAttribute("style","margin-right: 20px;");
		let h ="<input type=\"checkbox\" class=\"filled-in\"  "
		/*h+="onclick='getSetMultilangugages(true)'"
		if (multilanguages_enabled.includes(lang_key))
			h+="checked=\"checked\"";*/

		h+="name='"+lang_key+"'/><span style='color:var(--text-color);'>"+lang_name+"</span>"
		label.innerHTML=h
		document.getElementById("settingsLanguagesColumn").appendChild(label);
	}

	let cc = localStorage.getItem("customLanguage");
	if (cc!=undefined)
	{
		customLanguage = JSON.parse(cc);
		if (customLanguage.hasOwnProperty('data'))
		{
			if (Object.keys(customLanguage['data']).length > 0)
			{
				document.getElementById("exportLanguageBtn").classList.remove("disabled");
				document.getElementById("deleteLanguageBtn").classList.remove("disabled");
			}
		}
		else
		{
			console.error("customLanguage in localStorage is missing 'data' key. Not loading.")
			console.error(customLanguage)
			customLanguage = undefined
			//localStorage.setItem("customLanguage","{}")
		}
	}

	//Now init SETTINGSMAN which sets all the options other than languages
	SETTINGSMAN = initSettingsMan('settingsModal','languageModal');


	document.querySelectorAll('.tabs').forEach(el => {
		var instance = M.Tabs.init(el, null);
		//instance.updateTabIndicator();
	});
	
	/*document.querySelectorAll('.dropdown-trigger').forEach(elems => {
		var instances = M.Dropdown.init(elems, {constrainWidth:false});
	});*/
	
		
	document.querySelectorAll('.collapsible').forEach(elems => {
		var instances = M.Collapsible.init(elems, null);
	});
	document.querySelectorAll('.sidenav').forEach(elems => {
		var instances = M.Sidenav.init(elems,null);
	});
	document.querySelectorAll('.modal').forEach(el => {
		var instance = M.Modal.init(el, null);
		//instance.updateTabIndicator();
	});
	
	M.FormSelect.init(document.querySelectorAll('select'), null);

	document.getElementById('file-input-json').addEventListener('change', handleFileSelect, false);
	
	// Select the button
	//const btn = document.querySelector(".nightMode-toggle");
	// Check for dark mode preference at the OS level
	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
	// Get the user's theme preference from local storage, if it's available
	//const currentTheme = localStorage.getItem("theme");
	const currentTheme = getCookie('theme');
	//print(currentTheme);


	// If the user's preference in localStorage is dark...
	if (currentTheme == "")
	{
		document.body.classList.toggle(prefersDarkScheme ? "dark-theme" : "light-theme")
		setCookie('theme',prefersDarkScheme ? "dark-theme" : "light-theme",180);
	}
	else if (currentTheme == "black-theme") {
		document.body.classList.toggle("black-theme");
		isDarkMode=true
	}
	else if (currentTheme == "dark-theme") {
		// ...let's toggle the .dark-theme class on the body
		document.body.classList.toggle("dark-theme");
		isDarkMode=true
	// Otherwise, if the user's preference in localStorage is light...
	} else {
		// ...let's toggle the .light-theme class on the body
		document.body.classList.toggle("light-theme");
		isDarkMode=false;
	}

	// Add ? to the end (discarded by apache/nginx)
	// which will force stupid mobile browsers to not cache the result
	// database.json doesn't change often, so maybe better to refresh every week instead. But it compresses down to 64kb so does it really matter?
	let today = new Date();
	fetch('database.json?nocache='+String(today.getMonth()+"."+today.getDate()))
	.then(response => response.json())
	.then(json => {
		console.log("database.json loaded!");
		//PORTRAITS = json['portraits'];
		for (const [key, value] of Object.entries(json['portraits'])) {
			//Witness me and cry!
			//For those of you that can't comprehend this:
			//If value[1] is not undefined, assign it, otherwise assign 0
			//If value[2] is not undefined, assign it, otherwise assign ""
			PORTRAITS[key] = {src: value[0], num: value?.[1] ?? 0, css: value?.[2] ?? ""}
		}

		NAMES = json['speakers'];
		MUSIC = json['music'];

		fetch('chapterDatabase.json?nocache='+String(today.getMonth()+"."+today.getDate()))
		.then(response => response.json())
		.then(json => {
			console.log("cutscene information loaded!");

			CHAPTER_DB = json['story'];
			ROUTING = json['routing']; //Is there any point to compiling this ahead of time? I doubt it's that expensive to do right here.
			
			generateTables();
			compile_tl();
			//Inject other languages into the translation engine
			for (const category of Object.keys(CHAPTER_DB)) {
				for (const chapter of CHAPTER_DB[category])
				{
					//console.log(chapter)
					if (chapter.hasOwnProperty('name_multilang'))
					{
						TRANSLATION[chapter.name] = [
							chapter.name_multilang[LANGUAGE_COLUMN.cn],
							chapter.name_multilang[LANGUAGE_COLUMN.jp],
							chapter.name_multilang[LANGUAGE_COLUMN.kr],
						]
						//console.log(TRANSLATION[chapter.name])
					}
					for (const episode of chapter.episodes)
					{
						if (episode.hasOwnProperty('name_multilang'))
						{
							TRANSLATION[episode.name] = [
								episode.name_multilang[LANGUAGE_COLUMN.cn],
								episode.name_multilang[LANGUAGE_COLUMN.jp],
								episode.name_multilang[LANGUAGE_COLUMN.kr],
							]
						}
					}
				}
			}

			setLanguage(lang);

			document.querySelectorAll('.dropdown-trigger').forEach(elems => {
				var instances = M.Dropdown.init(elems, {constrainWidth:false});
			});
			
			if (true)
			{
				//Try to run from window hash first then if it fails load from cookie
				console.log("Everything is loaded, now loading scene based on window hash or last known scene");
				if (!runFromRoutableKeyString(window.location.hash.slice(1)))
					runFromRoutableKeyString(getCookie('lastViewedScene'));
				
				searchAndSelectTab();
			}
		});
	});


	var data = [
		['bg',10],
		['portraits', ['', 0, false], ['', 0, false]],
		['msg', '……The subscriber you dialed is busy now, please leave a message after the beep.', '嘟嘟嘟……您所拨打的用户正忙，请在提示音后留言。', 'XXX', 'XXX', 'XXX\n'],
		['portraits', ['', 0, false], ['', 0, false]],
		['msg', 'Beep--', '哔——', 'XXX', 'XXX', 'XXX\n'],
		['speaker', 204553],
		['portraits', [101, 0, false], ['', 0, false]],
		['msg', "I'm Kiana, I'm checking the Houkai now! Follow me!", '我是琪亚娜，目前位于极东地区长空市内的千羽学园，我知道你一定也在跟踪这起崩坏！我想告诉你，不管你走到哪里我都会找到你的！', 'XXX', 'XXX', 'XXX\n'],
		['portraits', ['', 0, false], ['', 0, false]],
		['msg', 'Boom!', '咔！', 'XXX', 'XXX', 'XXX\n'],
		['speaker', 204553],
		['portraits', [101, 0, true], ['', 0, false]],
		['msg', '…This is too suddenly. We can check it in the "Senba High School" first!', '呼…该说的已经说完了，没想到这次的崩坏居然这么突然就发生了，不过按预期来看应该属于小型崩坏，爆发范围就锁定在这所千羽学园里吧！', 'XXX', 'XXX', 'XXX\n'],
		['speaker', 204553],
		['msg', 'All we need do is find the target before 「Shicksal」~', '接下来只要在「天命」组织赶到前找到目标就行~这次绝对不会让你逃走了！', 'XXX', 'XXX', 'XXX\n'],
		['msg', '*Zombies roar*', '吼吼吼！！', 'XXX', 'XXX', 'XXX\n'],
		['speaker', 204553],
		['portraits', [101, 0, false], ['', 0, false]],
		['msg', 'Houkai zombies… Lucky me, I prepared weapons.', '被崩坏感染的死士已经诞生了么…还好早有准备，事先把武器都准备好了。', 'XXX', 'XXX', 'XXX\n'],
		['portraits', ['', 0, false], ['', 0, false]],
		['msg', '*Pull the bolt*', '咔啦！', 'XXX', 'XXX', 'XXX\n'],
		['speaker', 204553],
		['portraits', [101, 0, false], ['', 0, false]],
		['msg', 'Weapons… Ammo… ', '武器检察完毕，弹药装配…真不知道手上这些老家伙还能撑多久。', 'XXX', 'XXX', 'XXX\n'],
		['speaker', 204553],
		['msg', 'Alright, we need to escape from this library first.', '嘛~总之先按照预定计划逃离这个图书馆吧。', 'XXX', 'XXX', 'XXX\n'],
	]
	for(i=0;i<data.length;i++)
	{
		data[i][0]=opcode2string.indexOf(data[i][0])
		//console.log(opcode2string.indexOf(data[i][0]))
	}
	//console.log(data)
	/*let NewSimpleTextDiv = document.createElement('div');
	NewSimpleTextDiv.id="verySimpleText";
	NewSimpleTextDiv.appendChild(renderStructuredLinesToDiv(data))
	let simpleTextDiv = document.getElementById("verySimpleText")
	simpleTextDiv.parentNode.replaceChild(NewSimpleTextDiv,simpleTextDiv);*/
	

	//console.log(stringToStructuredLines)
	
	document.getElementById("antibot").href = atob("aHR0cHM6Ly9kZXYucy11bC5uZXQvQkxVRUFMaUNFL2d1bnMtZ2lybC16LWN1dHNjZW5lLXBsYXllcg==")
}

//Causing issues right now with double loading
window.onhashchange = function() {
	var routableKeyString = location.hash.substr(1)
	if (curEpKey != routableKeyString)
	{
		console.log("Detected URL fragment change")
		runFromRoutableKeyString(routableKeyString)
		searchAndSelectTab();
	}
}

function setCheckboxFromCookie(idOfCheckbox,defaultValueIfNotSet)
{
	let c = getCookie(idOfCheckbox);
	if (c==undefined || c=="")
	{
		//Cookies can only be strings
		c=defaultValueIfNotSet.toString();
		setCookie(idOfCheckbox,defaultValueIfNotSet,180);
	}
	//console.assert(c);
	console.assert(document.getElementById(idOfCheckbox),"no element named "+idOfCheckbox)
	console.log("Setting "+idOfCheckbox+" to "+c);
	document.getElementById(idOfCheckbox).checked = (c=='true');
}
function setCookieFromCheckbox(idOfCheckbox)
{
	setCookie(idOfCheckbox,document.getElementById(idOfCheckbox).checked,180);
}


//HANDLE FILE INPUT FOR CUSTOM CUTSCENE...
function dragOverHandler(ev) {
	ev.preventDefault();
}

function dropHandler(ev) {
	console.log(ev);
	console.log('File(s) dropped');

		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();

		if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.items.length; i++) {
			// If dropped items aren't files, reject them
			if (ev.dataTransfer.items[i].kind === 'file') {
			var file = ev.dataTransfer.items[i].getAsFile();
			processUserFile(file)
			console.log('... file[' + i + '].name = ' + file.name);
			}
		}
	} else {
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
		}
	}
}

function handleFileSelect(evt) {
	console.log(evt.target.name);
	var files = evt.target.files;
	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
		processUserFile(f);
		
	}
	}

function processUserFile(f) {
	let NewSimpleTextDiv = document.createElement('div');
	NewSimpleTextDiv.id="verySimpleText";
	var reader = new FileReader();
	reader.onload = function(e) {
		
		var content = e.target.result;
		try {

			var episode = JSON.parse(content);
			var keys = Object.keys(episode)
		//	print(keys)
			for(var i = 0; i < keys.length;i++)
			{
				let structuredLines = episode[keys[i]]
				for(var j=0;j<structuredLines.length;j++)
				{
					structuredLines[j][0]=opcode2string.indexOf(structuredLines[j][0])
				}
				NewSimpleTextDiv.appendChild(renderStructuredLinesToDiv(structuredLines,i,null,false,keys.length));
			}
			let simpleTextDiv = document.getElementById("verySimpleText")
			simpleTextDiv.parentNode.replaceChild(NewSimpleTextDiv,simpleTextDiv);
			document.getElementById("customCutsceneError").setAttribute("style","color:red;display:none;");
		}
		catch (e)
		{
			document.getElementById("customCutsceneError").setAttribute("style","color:red;display:block;");
			document.getElementById("customCutsceneError").innerText=e.message;
		}
	};
	reader.readAsText(f)
}

function processCustomLanguage(e) {
	var file = e.target.files[0];
	if (!file)
		return;
	
	var reader = new FileReader();
	reader.onload = function(e) {
		const contents = e.target.result;
		const lines = contents.split(/\r\n|\n/);
		customLanguage = {}
		let numAdded = 0;
		for (let i = 0; i < lines.length; i++)
		{
			let text = lines[i].split("\t")
			if (text[2] != "")
			{
				numAdded++;
				customLanguage['data'][text[0]]=text[2];
			}
		}
		document.getElementById("importMessage").innerText="Imported "+numAdded+" lines.";
		document.getElementById("exportLanguageBtn").classList.remove("disabled");
		document.getElementById("deleteLanguageBtn").classList.remove("disabled");
		localStorage.setItem("customLanguage",JSON.stringify(customLanguage));
		//console.log("Imported "+numAdded+" lines.");

	};
	reader.readAsText(file);
}

/**
 * @author 
 * @date 2021-12-18
 * @returns {bool} Success
 */
function downloadRetranslation() {
	let tStatus = document.getElementById('translationServerStatus');
	const selectedLanguage = document.querySelector('input[name="group1"]:checked').value
	
	/*let selectedLanguage;
	for (const radioButton of document.querySelectorAll('input[name="group1"]')) {
		if (radioButton.checked) {
			selectedLanguage = radioButton.value;
			break;
		}
	}*/
	tStatus.setAttribute("style","");
	tStatus.innerText="Downloading... (This can take a while, there's a lot of text)"


	fetch(TRANSLATION_SERVER_URL+"/"+selectedLanguage)
	.then(response => {
		if (response.status >= 200 && response.status <= 299) {
			return response.json();
		} else {
			//Has anyone else realized how fucking stupid this is?
			return response.text().then(r=> {
				throw new Error(r);
			})
		}
	})
	.then(contents => {
		//print(contents)
		let keys = Object.keys(contents);
		if (keys.length > 0)
		{

			customLanguage={
				"language":selectedLanguage,
				"data":contents,
				"timestamp":{
					"import": Math.round(new Date().getTime() / 1000)
				}
			}
			localStorage.setItem("customLanguage",JSON.stringify(customLanguage));

			print("imported "+keys.length+" lines.");
			tStatus.innerText="Succesfully imported "+keys.length+" lines.";
		}
		else if (document.getElementById('showDebugOpcodeButton').checked)
		{
			tStatus.innerText="The translation file recieved from the server was empty, but you have Debug Mode enabled. An empty customLanguage was imported."
			
			customLanguage={
				"language":selectedLanguage,
				"data":contents,
				"timestamp":{
					"import": Math.round(new Date().getTime() / 1000)
				}
			}
			localStorage.setItem("customLanguage",JSON.stringify(customLanguage));
		}
		else
		{
			tStatus.innerText="The translation file recieved from the server was empty. There might be something wrong with the server right now."
		}
		
	}).catch((error) => {
		console.log(error);
		tStatus.innerText="Got an error trying to contact the server: "+error;
	})
}

function uploadRetranslation() {
	let tStatus = document.getElementById('translationServerStatus');
	var request = new XMLHttpRequest();

	request.onload = function () {

		// Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
		// object declared above is available in this function even though this function
		// executes long after the request is sent and long after this function is
		// instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
		// applications.

		// You can get all kinds of information about the HTTP response.
		var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
		var responseText = request.responseText; // Returned data, e.g., an HTML document.
		print(status)
		print(responseText)
		tStatus.innerText=responseText
		tStatus.setAttribute("style","");
	}

	request.open("POST", TRANSLATION_SERVER_URL, true);
	tStatus.innerText="Submitting..."

	request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/json");
	let APIKey = document.getElementById('translation_api_key').value

	let copyDict = {
		"LANGUAGE":customLanguage['language'],
		"TIMESTAMP_DL":customLanguage['timestamp']['import'],
		"TIMESTAMP_UL":Math.round(new Date().getTime() / 1000)
	};
	if (APIKey!='')
	{
		setCookie("API_KEY",APIKey,180);
		copyDict['API_KEY']=APIKey;
	}

	for (const [key, timestamp] of Object.entries(customLanguage['timestamp'])) {
		if (timestamp > customLanguage['timestamp']['import'])
		{
			copyDict[key]=customLanguage['data'][key]
		}
	}

	//print(copyDict)
	request.send(JSON.stringify(copyDict));
}
