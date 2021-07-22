var robot = require("robotjs");
var nconf = require("nconf");
const fetch = require("node-fetch");
const prompt = require("prompt-sync")();

const configFile = "config.json";
const interval = 5 * 1000; // in ms
const neutralCamNr = 0;
const homeCamNr = 8;
const awayCamNr = 9;
const supportedResolutions = [
  { width: 1920, height: 1080 },
  { width: 3840, height: 2160 },
];
let resolutionId; // Id of the resolution in supportedResolutions that matches user's main screen
let firstMatch = true;

// Busy sleep function
function sleep(ms, callback) {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + ms) {}
  callback();
}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const mappings = [
  {
    ACTIVATEWINDOW: new Position(10, 10),
    HOME: new Position(600, 900),
    USERPROFILE: new Position(1521, 488),
    JOINROOM: new Position(900, 430),
    HIDEMOUSE: new Position(1920, 1080),
    EXITROOM: new Position(1217, 974),
  },
  {
    ACTIVATEWINDOW: new Position(10, 10),
    HOME: new Position(1250, 1760),
    USERPROFILE: new Position(2977, 983),
    JOINROOM: new Position(1813, 875),
    HIDEMOUSE: new Position(3840, 2160),
    EXITROOM: new Position(2400, 1900),
  },
];

function _clickPos(x, y) {
  robot.moveMouse(x, y);
  // Has to break keypress into down&up, otherwise unity doesn't register it
  robot.mouseToggle("down", "left");
  robot.mouseToggle("up", "left");
}

function clickButton(button) {
  _clickPos(mappings[resolutionId][button].x, mappings[resolutionId][button].y);
  console.log(`Clicked ${button}`);
}
function type(str) {
  console.log(`Pressed ${str}`);
  robot.keyTap(str);
}

function joinRoom() {
  // Press somewhere in the main screen to switch to ETT
  clickButton("ACTIVATEWINDOW");

  // Press 0 to switch to default view
  type(neutralCamNr.toString());

  // Go to home menu
  clickButton("HOME");

  // Click my main user profile
  clickButton("USERPROFILE");

  // Join room can take a while
  sleep(2000, () => {});

  // Click "join room" button
  // DANGER OPERATION. IF USER IS NOT IN THE ROOM, THIS LOCATION WOULD BE "REMOVE FRIEND"
  clickButton("JOINROOM");

  // Join room can take a while
  sleep(2000, () => {});

  // Hide camera
  if (firstMatch === true) {
    type("f");
    firstMatch = false;
  }

  // Switch to spectate view
  type(homeCamNr.toString());

  // TODO: Looks like if the game has already started when spectator joins the room, then the menu would already be hidden.
  //       In which case, pressing m here will reveal the menu.
  //       But if the game hasn't already started when spectator joins the room, then pressing m here will hide the menu successfully.
  // Hide menu
  type("m");

  // Hide mouse
  clickButton("HIDEMOUSE");
}

function exitRoom() {
  // Press 0 to switch to default view
  type("0");

  // Click exit room
  clickButton("EXITROOM");

  // Exit room can take a while
  sleep(2000, () => {});

  // Press 0 to switch to default view
  type("0");
}

function init() {
  console.log(`💻 Initiating...`);

  // Check resolution
  resolution = robot.getScreenSize();
  console.log(`Screen resolution: ${resolution.width}x${resolution.height}`);

  for (
    resolutionId = 0;
    resolutionId < supportedResolutions.length;
    resolutionId++
  ) {
    if (
      supportedResolutions[resolutionId].width === resolution.width &&
      supportedResolutions[resolutionId].height === resolution.height
    ) {
      break;
    }
  }

  if (resolutionId == supportedResolutions.length) {
    console.log(
      `Only these resolutions are supported for now: ${JSON.stringify(
        supportedResolutions
      )}. If you have a resolution to be supported, please contact the author of this project`
    );
    process.exit(1);
  }

  console.log(
    `Please make sure 2d ETT is running on main screen in full screen mode and you haven't changed its camera position&angle.
If you have changed main account's user name, please edit config.json and relaunch script.`
  );

  // Load config
  console.log(`Loading config from ${configFile}`);
  nconf.file(configFile);
  if (undefined === nconf.get("user")) {
    let user = prompt(
      "What's your ETT player name that is running in the VR device? "
    );
    nconf.set("user", user);
    nconf.save();
    console.log(`Config is written to ${configFile}`);
  }
  console.log(`Going to spectate user ${nconf.get("user")} when match starts.`);

  console.log(`All Done.`);
}

async function isInRoom(user) {
  // TODO: This can be done via OCR instead, to minimize server load
  // OR....can also get it from the logs
  try {
    let url =
      "http://elevenlogcollector-env.js6z6tixhb.us-west-2.elasticbeanstalk.com/ElevenServerLiteSnapshot";
    let settings = { method: "Get" };
    const res = await fetch(url, settings);
    process.stdout.write(`.`);
    const json = await res.json();
    users = json.UsersInRooms.filter((obj) => obj.UserName === user);
    if (users.length > 0) {
      return true;
    }
  } catch (error) {
    process.stdout.write(`x`);
    return null;
  }
  return false;
}
async function main() {
  init();

  while (true) {
    console.log(`🎵 Waiting until user ${nconf.get("user")} is in a room...`);
    let inRoom; // TODO: yuck
    do {
      inRoom = await isInRoom(nconf.get("user"));
      sleep(interval, () => {});
    } while (inRoom === false || inRoom == null);
    console.log("");

    // Save initial camera view to key 0
    clickButton("ACTIVATEWINDOW");
    robot.keyTap("0", "shift");
    console.log("Saved initial camera view to key 0");

    console.log(`👁 Start spectating.`);
    joinRoom();

    do {
      inRoom = await isInRoom(nconf.get("user"));
      sleep(interval, () => {});
    } while (inRoom === true || inRoom == null);
    console.log("");

    console.log(
      `👻 User ${nconf.get("user")} is not in a room anymore. Leave the room.`
    );

    exitRoom();
  }
}
main();
