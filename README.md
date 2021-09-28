# Eleven Table Tennis Auto Spectate

This script runs on PC. It will make the 2D Eleven Table Tennis PC version automatically follow ETT matches played on the headset.

Example video: https://www.youtube.com/watch?v=NF-jWgePDrM

## Preparation

Install nodejs if you haven't. (https://nodejs.org/en/download/)

Download the latest release from https://github.com/jerryfromearth/ett-auto-spectate/releases/, extract/decompress the `ett-auto-spectate` folder to any place you want.

Double click `prepare.bat` in `ett-auto-spectate` folder to install the dependencies locally.

Install ETT on PC (from either Steam or Oculus PC app).

Double click `ElevenStartJust2d.bat` file in **PC ETT installation folder** to run the game in 2d.

1. If the game is not running in full screen mode, press `alt+enter` to make sure it is in full screen.

2.  Adjust view to how you want to spectate the game (WASDQE to move camera position, right mouse click&drag to pan around.).
    Then Use `leftshift+8` to save this view. It will be used later as the spectatoring view.

Exit 2d ETT.

## Run it

1. Make sure the main monitor is set to 1920x1080, 3840x2160 or 2560x1440 resolution. These are the only resolutions supported for now.

1. Make sure headset isn't plugged to the PC. Launch ETT on your headset, click "OK" and make sure it has at least loaded the friend list.

1. Unequip headset for now.

2. Double click `ElevenStartJust2d.bat` file in **PC ETT installation folder** to run the game in 2d. If it's not using full screen, press alt+enter. Since your main ETT account has logged in on the headset, the PC version will login with the "\_guest" account. Do not change the camera view!

   1. Make sure the "\_guest" account" has and only has one friend, which is your main account (which is running on the headset).

3. Double click `run.bat` in `ett-auto-spectate` folder. If this is the first time you run it, the script will ask you for the name of the account that is running on the headset (i.e. main account). After entering the name, the script should output something like `Waiting until user <your-user-name> is in a room...`. Minimize the script window if you only have one monitor. Otherwise make sure it's not on the main monitor.

4. Make sure the 2d ETT is running on the main monitor and using full screen. No other window should be in front of it.

5. Put on the headset and start playing. Now the 2D ETT will automatically join the room when you join one (you can see it in the "room user list" on the right side in ETT), and leave when you leave one. 
   Note: After you join a room, always wait a few seconds (use the time to greet opponent etc.) to give the 2D ETT enough time to join the room. If it joins the room *during* a match, glitches might happen.

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
