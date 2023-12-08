function extractDimensions(pastedString: string): string[] {
  const cleanedString = pastedString.replace(/\s+/g, " ").trim().toLowerCase();

  const regex = /(\d+(?:w)?\s*x\s*\d+(?:h)?|\d+\s*x\s*\d+)/g;
  const matches = cleanedString.match(regex);

  const dimensions = matches?.map((match) => {
    const [width, height] = match.split(/[wxh\s]+/);
    return `${width}x${height}`;
  }) || [];

  return dimensions;
}




figma.showUI(__html__);
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'generate-dimensions') {

    const dimensionStrings = extractDimensions(msg.text);
    if (dimensionStrings.length === 0) {
      figma.notify('no dimensions provided')
    }

    let x = figma.viewport.center.x;
    let y = figma.viewport.center.y;

    dimensionStrings.forEach((dimensionString, index) => {
      const [width, height] = dimensionString.split("x").map(Number);

      const frame = figma.createFrame();
      frame.name = `${width}x${height}`;
      frame.resizeWithoutConstraints(width, height);
      frame.x = x;
      frame.y = y;
      y += height + 100;

      figma.currentPage.appendChild(frame);
    });
  }
  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
  figma.closePlugin();
};
