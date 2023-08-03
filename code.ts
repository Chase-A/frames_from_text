function extractDimensions(pastedString: string): string[] {
  // Remove any line breaks and extra spaces from the string
  const cleanedString = pastedString.replace(/\s+/g, " ").trim().toLowerCase();

  // Extract the dimensions using a regular expression
  const regex = /(\d+(?:w)?\s*x\s*\d+(?:h)?|\d+\s*x\s*\d+)/g;
  const matches = cleanedString.match(regex);

  // Create an array of dimensions strings from the matches
  const dimensions = matches?.map((match) => {
    const [width, height] = match.split(/[wxh\s]+/);
    return `${width}x${height}`;
  }) || [];

  return dimensions;
}




figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'generate-dimensions') {

    // Figma plugin code

    // Get the list of dimensions from the user
    const dimensionStrings = extractDimensions(msg.text);
    if (dimensionStrings.length === 0) {
      figma.notify('no dimensions provided')
    }
    // Define initial position for the frames
    let x = figma.viewport.center.x;
    let y = figma.viewport.center.y;


    // Create frames for each dimension
    dimensionStrings.forEach((dimensionString, index) => {
      const [width, height] = dimensionString.split("x").map(Number);

      const frame = figma.createFrame();
      frame.name = `${width}x${height}`;
      frame.resizeWithoutConstraints(width, height);
      frame.x = x;
      frame.y = y;
      y += height + 100; // Adjust the spacing between frames (100 in this example)

      figma.currentPage.appendChild(frame);
    });

    // Zoom to fit all frames on the canvas
    // figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);


  }
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
