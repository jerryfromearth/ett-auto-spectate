# Eleven Table Tennis Auto Spectate 

[中文版本](https://github.com/jerryfromearth/ett-auto-spectate/blob/main/README.chs.md)

This script runs on PC. It will make the 2D Eleven Table Tennis PC version automatically follow ETT matches played on the headset.

Example video: https://www.youtube.com/watch?v=NF-jWgePDrM

## Prepartion
1. Install ETT on PC (from either Steam or Oculus PC app).

1. Double click `ElevenStartJust2d.bat` file in **PC ETT installation folder** to run the game in 2d.

   1. If the game is not running in full screen mode, press `alt+enter` to make sure it is in full screen.

   2.  Adjust view to how you want to spectate the game (WASDQE to move camera position, right mouse click&drag to pan around.).
    Then Use `(left)shift+8` to save this view. It will be used later as the spectatoring view.

   3. Exit 2d ETT.

1. These steps are for Windows users:
   
   1. Download the latest executable file from https://github.com/jerryfromearth/ett-auto-spectate/releases and save it whenever you want.
      It bundled all the dependencies, so you shouldn't even need to install python.

   2. Create a `username.txt` file next to the executable and write your ETT username in it. Save it.

2. These steps are for non-Windows users:

   1. Install Python 3 if you haven't. (https://www.python.org/downloads/)

   2. Download the latest source code zip from https://github.com/jerryfromearth/ett-auto-spectate/releases/, extract/decompress the `ett-auto-spectate` folder to any place you want.

   3. Create a `username.txt` file in `ett-auto-spectate` and write your ETT username in it. Save it.

   4. Double click `prepare.bat` in `ett-auto-spectate` folder to install the dependencies locally.

## Run it

1. Make sure headset isn't plugged to the PC. Launch ETT on your headset, click "OK" and make sure it has at least loaded the friend list.

1. Unequip headset for now.

1. Double click `ElevenStartJust2d.bat` file in **PC ETT installation folder** to run the game in 2d. If it's not using full screen, press alt+enter. Since your main ETT account has logged in on the headset, the PC version will login with the "\_guest" account. Do not change the camera view!

   1. Make sure the "\_guest" account" has and only has one friend, which is your main account (which is running on the headset).

2. Either run `ett-auto-spectate.exe` (if you are on Windows) or execute `python ett-auto-spectate.py` (if you are NOT on Windows) in `ett-auto-spectate` folder. If all checks passed, the script should output something like `Waiting until user <your-user-name> is in a room...`. Minimize the script window if you only have one monitor. Otherwise make sure it's not on the main monitor.

3. Again, make sure the 2d ETT is running on the main monitor and using full screen. No other window should be in front of it.

4. Put on the headset and start playing. Now the 2D ETT will automatically join the room when you join one (you can see it in the "room user list" on the right side in ETT), and leave when you leave one. 

   Note: After you join a room, always wait 5-10 seconds (use the time to greet opponent etc.) to give the 2D ETT enough time to join the room. If it joins the room *during* a match, glitches might happen (ball reset might be needed to resolve it).

To streamline the whole experience, I wrote this windows batch file (you will need to edit the paths, obviously):

```
cd /D G:\Oculus\Software\Software\for-fun-labs-eleven-table-tennis-vr
call ElevenStartJust2d.bat

cd /D E:\obs-studio\bin\64bit\
start obs64.exe --startrecording --minimize-to-tray

timeout 20

cd /D C:\Users\Jerry\Desktop\ETT\ett-auto-spectate
start ett-auto-spectate.exe
```


## Contact

Please contact SolidSlime#2677 on discord for questions.

## Recomendation

I recommend to use the scoreboard overlay by Cristy94(XCS): https://github.com/Cristy94/eleven-vr-scoreboard

## TODO

- Exit room only works when a match has ended
- Make other resolutions work
- Write more instructions
- OCR the texts
- Handle the case when spectator is kicked out from the room (don't rejoin)
- Enable ping ball?
