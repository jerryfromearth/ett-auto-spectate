# Eleven Table Tennis Auto Spectate

This script runs on PC. It will make the 2d Eleven Table Tennis client automatically follow ETT matches played on the headset.

## Preparation

Install nodejs if you haven't. (https://nodejs.org/en/download/)

Run this command in the ett-auto-spectate folder to install dependencies locally:
`npm install`

Install ETT on PC (from either Steam or Oculus).

## Run it

1. Make sure the main monitor is set to 1920x1080 resolution. This is the only resolution supported for now.

1. Make sure headset isn't plugged to the PC. Launch ETT on your headset, and make sure it has at least loaded the friend list.

1. Unequip headset, double click ElevenStartJust2d.bat file in PC ETT installation folder to run the game in 2d. This will launch ETT using the guest account.

   1. Make sure the PC client only has one friend, which is your main account (which is running on the headset). Alternatively, you can make sure the main account will be the first user in the "friend list" of the guest account.

   1. Adjust view to how you want to spectate the game (WASDQE, right mouse click to move around. Do NOT use +/- button.).
      Then Use shift+8 to save this view.

1. Run `npm start` in ett-auto-sepctate folder. If this is the first time you run it, the script will prompt you for the name for the account that is running on the headset (i.e. main account). After entering the name, the script should output something like `Wait until user <your-user-name> is in a room...`

1. Make sure the 2d ETT client is running on the main monitor and using full screen. Nothing should be in front of it.

1. Put on the headset and start playing. Now the script running on PC will automatically join the room when you join one, and leaves when you leave one.

## Contact

Please contact SolidSlime#2677 on discord for questions.

## TODO

- Make other resolutions work
- Add another viewing angle key (9) for away matches.
- Write more instructions
- OCR the texts
- Handle the case when spectator is kicked out from the room (don't rejoin)
- Enable ping ball?
