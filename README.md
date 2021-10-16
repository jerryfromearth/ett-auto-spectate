# Eleven Table Tennis Auto Spectate (python version)

This script runs on PC. It will make the 2D Eleven Table Tennis PC version automatically follow ETT matches played on the headset.

Example video: https://www.youtube.com/watch?v=NF-jWgePDrM

## Preparation

Install Python 3 if you haven't. (https://www.python.org/downloads/)

Download the latest release from https://github.com/jerryfromearth/ett-auto-spectate/releases/, extract/decompress the `ett-auto-spectate` folder to any place you want.

Create a `username.txt` file in `ett-auto-spectate` and write your ETT username in it. Save it.

Double click `prepare.bat` in `ett-auto-spectate` folder to install the dependencies locally.

Install ETT on PC (from either Steam or Oculus PC app).

Double click `ElevenStartJust2d.bat` file in **PC ETT installation folder** to run the game in 2d.

1. If the game is not running in full screen mode, press `alt+enter` to make sure it is in full screen.

2.  Adjust view to how you want to spectate the game (WASDQE to move camera position, right mouse click&drag to pan around.).
    Then Use `leftshift+8` to save this view. It will be used later as the spectatoring view.

Exit 2d ETT.

## Run it

1. Make sure headset isn't plugged to the PC. Launch ETT on your headset, click "OK" and make sure it has at least loaded the friend list.

1. Unequip headset for now.

1. Double click `ElevenStartJust2d.bat` file in **PC ETT installation folder** to run the game in 2d. If it's not using full screen, press alt+enter. Since your main ETT account has logged in on the headset, the PC version will login with the "\_guest" account. Do not change the camera view!

   1. Make sure the "\_guest" account" has and only has one friend, which is your main account (which is running on the headset).

2. Double click `run.bat` in `ett-auto-spectate` folder. If all checks passed, the script should output something like `Waiting until user <your-user-name> is in a room...`. Minimize the script window if you only have one monitor. Otherwise make sure it's not on the main monitor.

3. Make sure the 2d ETT is running on the main monitor and using full screen. No other window should be in front of it.

4. Put on the headset and start playing. Now the 2D ETT will automatically join the room when you join one (you can see it in the "room user list" on the right side in ETT), and leave when you leave one. 
   Note: After you join a room, always wait a few seconds (use the time to greet opponent etc.) to give the 2D ETT enough time to join the room. If it joins the room *during* a match, glitches might happen.

To streamline the whole experience, I wrote this windows batch file (you will need to edit the paths, obviously):

```
cd /D G:\Oculus\Software\Software\for-fun-labs-eleven-table-tennis-vr
call ElevenStartJust2d.bat

cd /D E:\obs-studio\bin\64bit\
start obs64.exe --startrecording --minimize-to-tray

cd /D C:\Users\Jerry\Desktop\ETT\ett-auto-spectate
run.bat
```


## Contact

Please contact SolidSlime#2677 on discord for questions.

## Recomendation

I recommend to use the scoreboard overlay by Cristy94(XCS): https://github.com/Cristy94/eleven-vr-scoreboard

## TODO

- Make other resolutions work
- Convert to typescript
- Add another viewing angle key (9) for away matches.
- Fix bug where sometimes the menu is shown while spectating the game.
- Write more instructions
- OCR the texts
- Handle the case when spectator is kicked out from the room (don't rejoin)
- Enable ping ball?
