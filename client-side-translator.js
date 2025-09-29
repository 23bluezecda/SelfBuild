//TODO: This horrible mess should really be stored in one class

//HEY, YOU! Are you planning on editing this? Select the below block of text, paste it into another file and give it the .tsv extension, then open it in Excel/LibreOffice Calc/Google Sheets.
var translation_tsv = `
ENGLISH	CHINESE	JAPANESE	KOREAN	RUSSIAN	PORTUGESE

[Header]				
Houkai2nd Story Interpreter
GGZ Story Interpreter	HG2 故事网站	HG2ストーリーウェブサイト
GGZ S.I.	HG2 S.I	HG2 S.I.	HG2 S.I.

Language	语言	言語	언어	Язык
Dark Theme	夜间模式	ナイトモード	야간 모드	Тёмная тема
Settings	设置	設定	설정	Настройки

[Sidebar]				
Cutscene Interpreter	场景解说员	カットシーン通訳	컷씬 인터프리터	Интерпретатор катсцен
Search Cutscenes	搜索场景	カットシーンを検索	컷씬 검색	Поиск катсцен
Story Order Guide	故事顺序指南	ストーリー順ガイド	스토리 순서 안내	Порядок сюжета (EN)
Music Player	音乐播放器	音楽プレーヤー	뮤직 플레이어	Саундтрек
Guns Girl Z Korean Community	HG2 韩语社区	HG2 韓国コミュニティ	붕괴학원2 채널

[Footer]
Dandelion is my wife, greets to /gfg/,
view the source code
I'm working on a Girls' Frontline fangame based on Mega Man. Check out progress here! Share the link with your friends!

[Settings Titles]				
Display images and portraits in cutscenes	在场景中显示图像和肖像	カットシーンに画像や肖像画を表示する	컷씬에 이미지와 인물 표시	Отображать задние фоны и портреты в катсценах
Quick scrolling	快速滚动	クイックスクロール	빠른 스크롤	Быстрая прокрутка
Advanced CSS Effects	高级 CSS 效果	高度なCSSエフェクト	고급 CSS 효과	Расширенные эффекты оформления (CSS)
Skip duplicate story images	跳过重复的故事 CG 框	重複するストーリーCGボックスをスキップする	중복 스토리 CG 상자 건너뛰기	Пропуск блоков картинок-дубликатов при просмотре
Show SFX buttons	显示 SFX 按钮	SFXボタンの表示	SFX 버튼 표시	Показывать кнопки звуковых эффектов
Debug Mode	调试模式	デバッグモード	디버그 모드	Режим отладки
Experimental Settings	实验设置	実験的設定	실험 설정	Эксперементальные настройки
				
[Settings Descriptions]				
Turn it off if you want to save your mobile data or copy the text into a word processor.	如果您想节省移动数据或将文本复制到文字处理器中，请将其关闭。	モバイルデータを節約したい場合や、テキストをワープロにコピーしたい場合はオフにする。	모바일 데이터를 저장하거나 텍스트를 워드 프로세서에 복사하려면 이 기능을 끄십시오.	Отключите, если необходимо сэкономить трафик, или для удобства копирования текста.
Click or tap an image to jump to the next one in cutscenes.	点击或轻点图片可跳转到下一个场景。	カットシーンでは、画像をクリックまたはタップすると次の画像にジャンプします。	이미지를 클릭하거나 탭하면 컷씬에서 다음 이미지로 이동할 수 있습니다.	Переход к следующей сцене при нажатии на изображение.
Enable more demanding effects like snow animations. It might lag on mobile devices.	启用雪花动画等要求更高的特效。在移动设备上可能会出现延迟。	スノーアニメーションなど、より負荷の高いエフェクトを有効にする。モバイルデバイスではラグが発生する可能性があります。	눈 애니메이션과 같은 더 까다로운 효과를 사용할 수 있습니다. 모바일 장치에서는 지연될 수 있습니다.	Включение более требовательных к производительности эффектов, например: снегопад. Может вызывать подвисания на мобильных устройствах.
Skips generating a new character box if only the speaker's name changed.	如果只有发言者的姓名发生变化，则跳过生成新的 CG 框。	スピーカーの名前だけが変更された場合、新しいCGボックスの生成をスキップする。	발표자의 이름만 변경된 경우 새 CG 상자 생성을 건너뜁니다.	Пропускает показ одного и того же блока картинок, пока не сменится персонаж.
If you don't care about sound effects being shown, turn this off.	如果您不在乎显示音效，请将其关闭。	効果音が表示されることを気にしないのであれば、これをオフにしてください。	음향 효과가 표시되는 것이 마음에 들지 않으면 이 기능을 끄십시오.	Отключите, если Вам не требуются звуковые эффекты в некоторых сценах. 
This is off by default.	默认情况下是关闭的。	デフォルトではオフになっている。	이 기능은 기본적으로 꺼져 있습니다.	По умолчанию данная опция отключена.
Displays buttons for showing debug opcodes in cutscenes and warns if a portrait is missing. You probably don't want this enabled.	显示用于在剪切场景中显示调试操作码的按钮，并在缺少肖像时发出警告。您可能不希望启用此功能。	カットシーンでデバッグオプコードを表示するためのボタンを表示し、肖像画がない場合は警告します。おそらく有効にはしないほうがよい。	컷씬에서 디버그 opcode를 표시하기 위한 버튼을 표시하고 인물 사진이 누락된 경우 경고합니다. 이 기능을 사용하지 않으려는 경우	Показывает кнопку отображения отладочного кода операции в сцене, предупреждает, если портрет персонажа отсутствует. Эту опцию лучше не трогать.
The options below are not functional. Turning them on has no effect.	这些都没用，不用打开。	どれも機能しないので、わざわざオンにする必要はない。	이들 중 어느 것도 작동하지 않으므로 전원을 켜는 것을 귀찮게하지 마십시오.	Данные опции не работают, от их включения ничего не изменится.
				
[Tabs]				
MAIN STORY CHAPTERS	主要故事章节	メインストーリーの章	메인 스토리 챕터	Основной сюжет
STORY EVENTS	故事事件	ストーリー・イベント	스토리 이벤트	Сюжетные эвенты
SIDE STORIES	侧面故事	サイドストーリー	사이드 스토리	Побочный сюжет
CROSSOVER STORIES	跨界故事	クロスオーバー物語	크로스오버 스토리	Кроссоверы
CHAPTER LIBRARY	章节库	章ライブラリ	챕터 라이브러리
UNKNOWN DATA	未知数据	不明なデータ	알 수 없는 데이터

HELP THE INTERPRETER	帮助口译员	通訳を助ける	통역사를 도와주세요	Помочь разработчику
T-DOLL STORY DB (COMING EVENTUALLY)	T-Doll 故事 DB（即将推出）	Tドール・ストーリーDB（近日公開予定）	인형 이야기 DB (추후 출시 예정)	Истории T-Doll (В разработке)
WRITE YOUR OWN CUTSCENE (WIP)	编写自己的剪辑（WIP）	自分のカットシーンを書く（WIP）	나만의 컷씬 작성(WIP)	Редактор катсцен (В разработке)
				
[Buttons]				
Show opcodes for this section (For debugging)
Play audio for this cutscene
BACK TO TOP	返回顶部	トップに戻る	맨 위로 돌아가기	Вернуться к началу
GO TO THE PREVIOUS CUTSCENE	转到前一个场景	前のカットシーンへ	이전 컷신으로 이동	Перейти к предыдущей главе
GO TO THE NEXT CUTSCENE	进入下一个场景	次のカットシーンへ	다음 컷신으로 이동	Перейти к следующей главе

[Interpreter]
If choice %s was picked
This message is malformed, there is no closing color tag: %s

[Main Chapters]				
Chapter %s	第%s章	第%s章	%s장	Глава %s
Normal %s-%s				Нормал %s-%s
Emergency %s-%s				Эмердженси %s-%s
Midnight %s-%s				Миднайт %s-%s
				
[Event Chapters]				
Episode %s: %s				Эпизод %s: %s
Episode %s				Эпизод %s
				
Prologue				Пролог
CH. 5.5: Operation Cube+				Гл. 5.5: Operation Cube+
CH. 7.5: Arctic Warfare				Гл. 7.5: Arctic Warfare
CH 8.5: Deep Dive				Гл. 8.5: Deep Dive
CH 10.5: Singularity				Гл. 10.5: Singularity
CH 10.75: Continuum Turbulence				Гл. 10.75: Continuum Turbulence
CH. 11.5: ISOMER				Гл. 11.5: ISOMER
CH. 11.75: Shattered Connexion				Гл. 11.75: Shattered Connexion
CH 12.5: Polarized Light				Гл. 12.5: Polarized Light
CH. 13.5: Dual Randomness				Гл. 13.5: Dual Randomness
CH. 13.75: Mirror Stage				Гл. 13.75: Mirror Stage
CH. 13.X: Poincaré Recurrence				Гл. 13.X: Poincaré Recurrence
CH. 13.Z: Fixed Point				Гл. 13.Z: Fixed Point
//Longitudinal Strain				Longitudinal Strain
Ch.13.99: Eclipses & Saros				Гл. 13.99: Eclipses & Saros
Not Ch.14.1: Conjectural Labyrinth (Untranslated)				Не Гл. 14.1: Conjectural Labyrinth (Не переведено)
Ch. 14: Slowshock				Гл. 14: Slowshock (Переводится)
				
[Side Stories]				
White Day %s				Белый день %s
Summer %s				Лето %s
Halloween %s				Хэллоуин %s
Christmas %s				Рождество %s
				
Halloween 2019				Хэллоуин 2019
Christmas 2019				Рождество 2019
White Day 2020				Белый день 2020
White Day 2020: The Photo Studio Mystery				Белый день 2020: The Photo Studio Mystery
Summer 2020				Лето 2020
Summer 2020: Far Side of the Sea				Лето 2020: Far Side of the Sea
Halloween 2020				Хэллоуин 2020
Halloween 2020: Butterfly In A Cocoon				Хэллоуин 2020: Butterfly In A Cocoon
Summer 2021				Лето 2021
Summer 2021: The Waves Wrangler				Лето 2021: The Waves Wrangler
Christmas 2021				Рождество 2021
Christmas 2021: One Coin Short				Рождество 2021: One Coin Short
White Day 2022				Белый день 2022
White Day 2022: Love Bakery				Белый день 2022: Love Bakery
Summer 2022: Lycan Sanctuary				Лето 2022: Lycan Sanctuary
Bookshelf of Memories				Bookshelf Of Memories
Skin Stories				Истории скинов
MOD 3 Stories				MOD3 Истории
Anniversary				Годовщина
Interpreter Test Room				Тест интерпретатора

[Chapter Descriptions]
// HEY YOU, YEAH YOU! Open chapterDatabase.json and find the first part in the episode, this is what you need to add multilanguage descriptions.
// The english text doesn't appear here because it's embedded in the json, and not all multilanguage keys
// Have english counterparts.
`

TRANSLATION = {}
wasInit=false
function compile_tl() {
	let lines = translation_tsv.split("\n")

	for (let i = 0; i < lines.length; i++)
	{
		let keyValues = lines[i].split("\t")
		if (keyValues.length>1)
		{
			//TRANSLATION[keyValues[0]]=keyValues

			TRANSLATION[keyValues[0]] = []
			for (let j=1; j < keyValues.length;j++)
			{
				TRANSLATION[keyValues[0]].push(keyValues[j])
			}
		}
	}
	//translation_tsv=undefined;
	wasInit=true;
}

/**
 * Substitute %s in the string with the value given in the argument, one by one.
 * 
 * Example: sprintf("Hello, %s and %s!","UMP9,UMP45") will return "Hello, UMP9 and UMP45!"
 * @param {string} str A string with %s within the text.
 * @param {string} sprintf_args A string with comma separated arguments that gets inserted into the '%s' in str.
 * @returns {string}
 */
function sprintf(str,sprintf_args) {
	sprintf_args.split(",").forEach(s => {
		str=str.replace("%s",s)
	})
	return str
}


/**
 * Description
 * @param {any} str The string to translate
 * @param {any} sprintf_args
 * @param {any} idx Language index. Invalid indexes will return an empty string.
 * @returns {any} The translated string or an empty string if not found
 */
function getTranslation(str,sprintf_args,idx) {
	if (idx>0 && str in TRANSLATION && idx-1 < TRANSLATION[str].length)
	{
		let translation = TRANSLATION[str][idx-1]
		//console.log("STR: "+str+" | ARGS: "+sprintf_args)
		translation = sprintf(translation,sprintf_args)
		return translation
	}
	return "";
}

/**
	 * @author AmWorks
	 * @param {string} str
	 * @param {string} lang enum of either en/, ja/, cn/, kr/, ru/
	 * @returns {string}
	 */
function getTranslationByLang(str, lang, fallback_if_not_found=true)
{

	let sprintf_args = ""
	if (str.indexOf(";") != -1)
	{
		let split = str.split(";")
		str = split[0]
		sprintf_args = split[1]
	}

	if (lang == undefined || lang=="" || lang=="en/")
	{

		return sprintf(str,sprintf_args);
	}

	let lang_idx = Object.keys(LANGUAGE_COLUMN).indexOf(lang)-1
	if (lang=="en_re" || lang=="en_abridged")
		lang_idx=0

	if (fallback_if_not_found)
	{
		return getTranslation(str,sprintf_args,lang_idx) || str
	}
	return getTranslation(str,sprintf_args,lang_idx)
}


//Call this after setting up your page with the language and it will translate the page

/**
 * Description
 * @param {string} lang - Language to translate the page to
 * @returns {any}
 */
function setTranslation(lang){
	//If page is loaded and user language is english, there's no need to init.
	if ((lang=="" || lang=="en" || lang=="en_re" || lang=="en_abridged") && wasInit==false)
		return;
	//But if they previously used a different language and want to set it back
	//to english, we need to replace all the text back to english.

	if (wasInit==false)
	{
		compile_tl();
	}

	let lang_idx = Object.keys(LANGUAGE_COLUMN).indexOf(lang)-1
	if (lang=="en_re" || lang=="en_abridged")
		lang_idx=0
	console.log(lang_idx)

	//Get all html tags with the "translate" attribute
	document.querySelectorAll("[translate]").forEach(el => {
		var val = el.getAttribute("translate");
		var sprintf_args = "";
		if (val=="")
		{
			el.setAttribute("translate",el.innerText)
			val = el.innerText;
		}

		
		if (val.indexOf(";") != -1)
		{
			let split = val.split(";")
			val = split[0]
			sprintf_args = split[1]
		}

		let translatedString = getTranslation(val,sprintf_args,lang_idx)
		if (translatedString)
		{
			el.innerText=translatedString
		}
		else
		{
			el.innerText=sprintf(val,sprintf_args); //Reset back to English
		}

	});
}
