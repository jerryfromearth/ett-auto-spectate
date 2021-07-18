var robot = require("robotjs");
// Get mouse position.
while (true) {
  try {
    var mouse = robot.getMousePos();
    var hex = robot.getPixelColor(mouse.x, mouse.y);
    console.log("x:" + mouse.x + " y:" + mouse.y);
  } catch (error) {
    console.error(error.message);
  }
}
