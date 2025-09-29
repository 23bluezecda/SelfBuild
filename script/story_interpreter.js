const opcode2string = [
    'stopBGM','bgm','bg','speaker','msg','portraits','nop','msgboxTransition',
    'snowEffect','stopEffect','nightFilter','fadeOut','fadeIn','choice',
    'destination','credits','credits2','soundEffect1','soundEffect2','video'
];

const OPCODES = {
    STOPBGM : 0, BGM : 1, BG : 2, SPEAKER : 3, MSG : 4, PORTRAIT : 5, NO_OPERATION : 6,
    MSGBOXTRANSITION : 7, SNOWEFFECT : 8, STOPEFFECTS : 9, NIGHTFILTER : 10, FADEOUT : 11,
    FADEIN : 12, CHOICE : 13, DESTINATION : 14, CREDITS : 15, CREDITS2 : 16,
    SE1: 17, SE2: 18, VIDEO: 19
};

const tag2opcode = {
    "Speaker":OPCODES.SPEAKER, "BIN":OPCODES.BG, "BGM":OPCODES.BGM, "下雪":OPCODES.SNOWEFFECT,
    "火焰销毁":OPCODES.STOPEFFECTS, "Night":OPCODES.NIGHTFILTER, "黑屏1":OPCODES.FADEOUT,
    "黑屏2":OPCODES.FADEIN, '分支':OPCODES.DESTINATION, '名单':OPCODES.CREDITS,
    '名单2':OPCODES.CREDITS2, "SE1":OPCODES.SE1, "SE2":OPCODES.SE2
};
