var robot = require("robotjs");
var nconf = require("nconf");
const fetch = require("node-fetch");
const prompt = require("prompt-sync")();

const user = "[w]SolidSlime";
const configFile = "config.json";
const interval = 5 * 1000; // in ms
const neutralCamNr = 0;
const spectatorCamNr = 8;
const supportedResolutions = [{ width: 1920, height: 1080 }];
let inRoom = false;

// Busy sleep function
function sleep(ms, callback) {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + ms) {
    //console.log(stop + ms);
  }
  callback();
}

function clickButton(button) {}
function clickPos(x, y) {
  robot.moveMouse(x, y);
  // Has to break keypress into down&up, otherwise unity doesn't register it
  robot.mouseToggle("down", "left");
  robot.mouseToggle("up", "left");
}
function type(str) {
  robot.keyTap(str);
}

function spectate() {
  // Press somewhere in the main screen to switch to ETT
  clickPos(42, 42);

  // Press 0 to switch to default view
  type(neutralCamNr.toString());

  // Go to home menu
  clickPos(632, 842);

  // Click my main user profile
  clickPos(1551, 456);

  // Join room can take a while
  sleep(500, () => {});

  // Click "join room" button
  // DANGER OPERATION. IF USER IS NOT IN THE ROOM, THIS LOCATION WOULD BE "REMOVE FRIEND"
  clickPos(902, 411);

  // Join room can take a while
  sleep(2000, () => {});

  // Hide camera
  type("f");

  // Switch to spectate view
  type(spectatorCamNr.toString());

  // Hide menu
  type("m");
}

function leaveRoom() {
  // Press 0 to switch to default view
  type("0");

  // Click exit room
  clickPos(1199, 912);

  // Exit room can take a while
  sleep(2000, () => {});

  // Press 0 to switch to default view
  type("0");
}

function init() {
  let screenSize = robot.getScreenSize();
  console.log(`💻Initiating...`);

  // Check resolution
  console.log(`Screen resolution: ${screenSize.width}x${screenSize.height}`);
  if (
    supportedResolutions.filter(
      (resolution) =>
        resolution.width === screenSize.width &&
        resolution.height === screenSize.height
    ).length === 0
  ) {
    console.log(
      `Only these resolutions are supported for now: ${JSON.stringify(
        supportedResolutions
      )}`
    );
    process.exit(1);
  }

  // Load config
  console.log(`Loading config from ${configFile}`);
  nconf.file(configFile);
  if (undefined === nconf.get("user")) {
    let user = prompt(
      "What's your player name that is running in the VR device? "
    );
    nconf.set("user", user);
    nconf.save();
  }
  console.log(`Going to spectate user ${nconf.get("user")} when match starts.`);
  console.log(`Done.`);
}

async function isInRoom(user) {
  // TODO: This can be done via OCR instead, to minimize server load
  try {
    let url =
      "http://elevenlogcollector-env.js6z6tixhb.us-west-2.elasticbeanstalk.com/ElevenServerLiteSnapshot";
    let settings = { method: "Get" };
    const res = await fetch(url, settings);
    const json = await res.json();
    users = json.UsersInRooms.filter((obj) => obj.UserName === user);
    if (users.length > 0) {
      return true;
    }
  } catch (error) {
    console.error(error);
  }
  return false;
}
async function main() {
  init();

  while (true) {
    console.log(`🎵 Waiting until user ${user} is in a room...`);
    while (false === (await isInRoom(user))) {
      sleep(interval, () => {});
    }

    console.log(`👁 Start spectating.`);
    spectate();

    while (true === (await isInRoom(user))) {
      sleep(interval, () => {});
    }

    console.log(`👻User ${user} is not in a room anymore. Leave the room.`);

    leaveRoom();
  }
}
main();