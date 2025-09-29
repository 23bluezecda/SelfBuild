
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
