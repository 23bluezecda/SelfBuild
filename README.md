# ggz-cutscene-interpreter
Cutscene interpreter for Guns Girl Z / Houkai Gakuen 2nd


# Setup

Use hg2-downloader to download and decrypt data_all.unity3d, rename the .txt to .tsv, then put it in build/GameData

### Dumping images
Extract apk from your device and rename it to .zip (or find it on bilibili). Go to assets\Res\ then extract AssetBundles folder.
These commands will help:

```batch
adb shell pm path com.miHoYo.HSoDv2BiliBiliRelease
adb pull /sdcard/Android/data/com.miHoYo.HSoDv2BiliBiliRelease/files/Res/AssetBundles AssetBundles_External
```

Now open AssetBundles folder and AssetBundles_External in AssetStudio, extract ONLY Texture2D from menusv2/map/figure/ and place 'pic' folder in root of this project directory

Extract menusv2/map/comicstory also and place in a folder named 'avgtexture', these are the backgrounds for cutscenes. Use command `find . -name "*.png" -exec convert {} -gravity center -resize 1024x576! {} \;` but exclude folder 18 and 19 since those images are different resolution.

Run the following inside the pic directory to fix 'partner' folder
```bash
#!/bin/bash
find figure/partner -name "*.png" -execdir mv {} ../ \;
find figure/partner -type d -exec rmdir {} \;
```

Now run FixPortraitVariants.py in build folder.
