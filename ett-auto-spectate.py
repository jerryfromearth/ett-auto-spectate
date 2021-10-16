import pyautogui
import urllib.request
import json
from time import sleep
import sys

configFile = "username.txt"
interval = 2  # in s
neutralCamNr = 0
homeCamNr = 8
awayCamNr = 9
supportedResolutions = [
    {'width': 1920, 'height': 1080},
    {'width': 3840, 'height': 2160},
    {'width': 2560, 'height': 1440},
    {'width': 3440, 'height': 1440},
    {'width': 2560, 'height': 1080},
    {'width': 3840, 'height': 1600},
    {'width': 2560, 'height': 1067},
]
# Id of the resolution in supportedResolutions that matches user's main screen
resolutionId = 0
firstMatch = True


class Position:
    x = 0
    y = 0

    def __init__(self, x, y):
        self.x = x
        self.y = y


mappings = [
    {
        # { width: 1920, height: 1080 },
        'ACTIVATEWINDOW': Position(10, 10),
        'HOME': Position(600, 900),
        'USERPROFILE': Position(1521, 488),
        'JOINROOM': Position(900, 430),
        'HIDEMOUSE': Position(1920-10, 1080-10),
        'EXITROOM': Position(1217, 974),
    },
    {
        # { width: 3840, height: 2160 },
        'ACTIVATEWINDOW': Position(10, 10),
        'HOME': Position(1250, 1760),
        'USERPROFILE': Position(2977, 983),
        'JOINROOM': Position(1813, 875),
        'HIDEMOUSE': Position(3840-10, 2160-10),
        'EXITROOM': Position(2400, 1900),
    },
    {
        # { width: 2560, height: 1440 },
        'ACTIVATEWINDOW': Position(10, 10),
        'HOME': Position(800, 1200),
        'USERPROFILE': Position(2027, 653),
        'JOINROOM': Position(1200, 575),
        'HIDEMOUSE': Position(2560-10, 1440-10),
        'EXITROOM': Position(1625, 1300),
    },
    {
        # { width: 3440, height: 1440 },
        'ACTIVATEWINDOW': Position(440 + 10, 10),
        'HOME': Position(440 + 800, 1200),
        'USERPROFILE': Position(440 + 2027, 653),
        'JOINROOM': Position(440 + 1200, 575),
        'HIDEMOUSE': Position(440 + 2560-10, 1440-10),
        'EXITROOM': Position(440 + 1625, 1300),
    },
    {
        # { width: 2560, height: 1080 },
        'ACTIVATEWINDOW': Position(320 + 10, 10),
        'HOME': Position(320 + 600, 900),
        'USERPROFILE': Position(320 + 1521, 488),
        'JOINROOM': Position(320 + 900, 430),
        'HIDEMOUSE': Position(320 + 1920-10, 1080-10),
        'EXITROOM': Position(320 + 1217, 974),
    },
    {
        # { width: 3840, height: 1600 },
        'ACTIVATEWINDOW': Position(10, 10),
        'HOME': Position(1433, 1292),
        'USERPROFILE': Position(2700, 730),
        'JOINROOM': Position(1830, 650),
        'HIDEMOUSE': Position(3840-10, 1600-10),
        'EXITROOM': Position(2310, 1400),
    },
    {
        # { width: 2560, height: 1067 },
        'ACTIVATEWINDOW': Position(10, 10),
        'HOME': Position(960, 870),
        'USERPROFILE': Position(1800, 500),
        'JOINROOM': Position(1230, 440),
        'HIDEMOUSE': Position(2560-10, 1060-10),
        'EXITROOM': Position(1537, 930),
    },
]


def _clickPos(x, y):
    pyautogui.moveTo(x, y)
    # pyautogui.click()
    pyautogui.mouseDown()
    sleep(0.05)
    pyautogui.mouseUp()


def clickButton(button):
    _clickPos(mappings[resolutionId][button].x,
              mappings[resolutionId][button].y)
    print(f"Clicked {button}")


def type(str):
    print(f"Pressed {str}")
    pyautogui.write(str)


def joinRoom():
    global firstMatch

    # Press somewhere in the main screen to switch to ETT
    clickButton("ACTIVATEWINDOW")

    # Press 0 to switch to default view
    type(str(neutralCamNr))

    # Go to home menu
    clickButton("HOME")

    # Click button can take a while
    sleep(0.5)

    # Click my main user profile
    clickButton("USERPROFILE")

    # Click button can take a while
    sleep(2)

    # Click "join room" button
    # DANGEROUS OPERATION. IF USER IS NOT IN THE ROOM, THIS LOCATION WOULD BE "REMOVE FRIEND"
    clickButton("JOINROOM")

    # Join room can take a while
    sleep(2)

    # Hide camera
    if firstMatch:
        type("f")
        firstMatch = False

    # Switch to spectate view
    type(str(homeCamNr))

    # Hide mouse
    clickButton("HIDEMOUSE")


def exitRoom():
    # Press 0 to switch to default view
    type("0")

    # Click exit room
    clickButton("EXITROOM")

    # Exit room can take a while
    sleep(2)

    # Press 0 to switch to default view
    type("0")


def init():
    global resolutionId
    print(f"💻 Initiating...")

    # Check resolution
    resolution = pyautogui.size()
    print(f"Screen resolution: {resolution.width}x{resolution.height}")

    for resolutionId in range(0, len(supportedResolutions)):
        if (
            supportedResolutions[resolutionId]['width'] == resolution.width and
            supportedResolutions[resolutionId]['height'] == resolution.height
        ):
            break
    else:
        print(f"Only these resolutions are supported for now: {supportedResolutions} \
            . If you have a resolution to be supported, please contact the author of this project")
        sys.exit(1)

    print(f"Please make sure 2d ETT is running on main screen in full screen mode and you haven't changed its camera position & angle.\n\
If you have changed main account's user name, please edit '{configFile}' and relaunch script.")

    # Load config
    print(f"Loading config from {configFile}")
    try:
        f = open(configFile, "r")
        user = f.readline().strip('\n').strip('\t')
        f.close()
    except FileNotFoundError:
        print(
            f"Please create a new file called '{configFile}' and write your ETT username in there")
        sys.exit(1)

    print(f"Going to spectate user {user} when match starts.")

    return user


def isInRoom(user):
    # TODO: This can be done via OCR instead, to minimize server load
    # OR....can also get it from the logs
    try:
        with urllib.request.urlopen("http://elevenlogcollector-env.js6z6tixhb.us-west-2.elasticbeanstalk.com/ElevenServerLiteSnapshot") as url:
            json_res = json.loads(url.read().decode())
            users = [x for x in json_res['UsersInRooms']
                     if x['UserName'] == user]
            if (len(users) > 0):
                print("y",  end='')
                sys.stdout.flush()
                return True
    except:
        print("x",  end='')
        sys.stdout.flush()
        return None

    print("n",  end='')
    sys.stdout.flush()
    return False


def main():
    user = init()
    print(resolutionId)

    while True:
        print(f"🎵 Waiting until user {user} is in a room...")
        inRoom = None  # TODO: yuck
        while (inRoom == False or inRoom == None):
            inRoom = isInRoom(user)
            sleep(interval)
        print("")

        # Save initial camera view to key 0
        clickButton("ACTIVATEWINDOW")
        pyautogui.keyDown('shift')
        pyautogui.press("0")
        pyautogui.keyUp('shift')
        print("Saved initial camera view to key 0")

        print(f"👁 Start spectating.")
        joinRoom()

        while (inRoom == True or inRoom == None):
            inRoom = isInRoom(user)
            sleep(interval)

        print("")

        print(f"👻 User {user} is not in a room anymore. Leave the room.")

        exitRoom()


if __name__ == '__main__':
    main()
