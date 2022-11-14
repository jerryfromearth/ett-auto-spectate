var robot = require("robotjs");
var nconf = require("nconf");
const fetch = require("node-fetch");
const prompt = require("prompt-sync")();

const configFile = "config.json";
const interval = 2 * 1000; // in ms
const neutralCamNr = 0;
const homeCamNr = 8;
const awayCamNr = 9;
const supportedResolutions = [
  { width: 1920, height: 1080 },
  { width: 3840, height: 2160 },
  { width: 2560, height: 1440 },
  { width: 3440, height: 1440 },
  { width: 2560, height: 1080 },
  { width: 3840, height: 1600 },
  { width: 2560, height: 1067 },
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
    // { width: 1920, height: 1080 },
    ACTIVATEWINDOW: new Position(10, 10),
    HOME: new Position(600, 900),
    USERPROFILE: new Position(1521, 488),
    JOINROOM: new Position(900, 430),
    HIDEMOUSE: new Position(1920, 1080),
    EXITROOM: new Position(1217, 974),
  },
  {
    // { width: 3840, height: 2160 },
    ACTIVATEWINDOW: new Position(10, 10),
    HOME: new Position(1250, 1760),
    USERPROFILE: new Position(2977, 983),
    JOINROOM: new Position(1813, 875),
    HIDEMOUSE: new Position(3840, 2160),
    EXITROOM: new Position(2400, 1900),
  },
  {
    // { width: 2560, height: 1440 },
    ACTIVATEWINDOW: new Position(10, 10),
    HOME: new Position(800, 1200),
    USERPROFILE: new Position(2027, 653),
    JOINROOM: new Position(1200, 575),
    HIDEMOUSE: new Position(2560, 1440),
    EXITROOM: new Position(1625, 1300),
  },
  {
    // { width: 3440, height: 1440 },
    ACTIVATEWINDOW: new Position(440 + 10, 10),
    HOME: new Position(440 + 800, 1200),
    USERPROFILE: new Position(440 + 2027, 653),
    JOINROOM: new Position(440 + 1200, 575),
    HIDEMOUSE: new Position(440 + 2560, 1440),
    EXITROOM: new Position(440 + 1625, 1300),
  },
  {
    // { width: 2560, height: 1080 },
    ACTIVATEWINDOW: new Position(320 + 10, 10),
    HOME: new Position(320 + 600, 900),
    USERPROFILE: new Position(320 + 1521, 488),
    JOINROOM: new Position(320 + 900, 430),
    HIDEMOUSE: new Position(320 + 1920, 1080),
    EXITROOM: new Position(320 + 1217, 974),
  },
  {
    // { width: 3840, height: 1600 },
    ACTIVATEWINDOW: new Position(10, 10),
    HOME: new Position(1433, 1292),
    USERPROFILE: new Position(2700, 730),
    JOINROOM: new Position(1830, 650),
    HIDEMOUSE: new Position(3840, 1600),
    EXITROOM: new Position(2310, 1400),
  },
  {
    // { width: 2560, height: 1067 },
    ACTIVATEWINDOW: new Position(10, 10),
    HOME: new Position(960, 870),
    USERPROFILE: new Position(1800, 500),
    JOINROOM: new Position(1230, 440),
    HIDEMOUSE: new Position(2560, 1060),
    EXITROOM: new Position(1537, 930),
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

  // Click button can take a while
  sleep(500, () => {});

  // Click my main user profile
  clickButton("USERPROFILE");

  // Click button can take a while
  sleep(2000, () => {});

  // Click "join room" button
  // DANGEROUS OPERATION. IF USER IS NOT IN THE ROOM, THIS LOCATION WOULD BE "REMOVE FRIEND"
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

  // Hide mouse
  clickButton("HIDEMOUSE");

  // // Hide menu, if not in match?
  // if (false == isInMatch()) {
  //   type("m");
  // }
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
      "What's your ETT player name that is running in the VR device? (case sensitive) "
    );
    nconf.set("user", user);
    nconf.save();
    console.log(`Config is written to ${configFile}`);
  }
  console.log(`Going to spectate user ${nconf.get("user")} when match starts.`);

  if (undefined === nconf.get("joinRoom")) {
    nconf.set("joinRoom", false);
    nconf.save();
  }
  if (undefined === nconf.get("exitRoom")) {
    nconf.set("exitRoom", true);
    nconf.save();
  }
  console.log(`auto-join room: ${nconf.get("joinRoom")}`);
  console.log(`auto-leave room: ${nconf.get("joinRoom")}`);
  console.log(`All Done.`);
}

async function isInMatch(user) {
  try {
    // https://github.com/ForFunLabs/webapi
    let url = "https://elevenvr.club/api/v1/accounts/4008/matches/latest";
    let settings = { method: "Get" };
    const res = await fetch(url, settings);
    process.stdout.write(`:`);
    const json = await res.json();
    let data = json.data;
    console.log(data);
    if (data.state == 0 || data.state < 0) {
      console.log("Match in progress");
      return true;
    }
  } catch (error) {
    process.stdout.write(`X`);
    return null;
  }
  console.log("Not in match");
  return false;
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
    if (nconf.get("joinRoom")) joinRoom();

    do {
      inRoom = await isInRoom(nconf.get("user"));
      sleep(interval, () => {});
    } while (inRoom === true || inRoom == null);
    console.log("");

    console.log(
      `👻 User ${nconf.get("user")} is not in a room anymore. Leave the room.`
    );

    if (nconf.get("exitRoom")) exitRoom();
  }
}
main();
