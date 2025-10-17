// Sitemap Builder Plugin for FigJam
// Creates visual sitemaps from indented text input using sticky notes and connectors

figma.showUI(__html__, { width: 600, height: 500 });

// Check for existing sitemaps on load
function checkExistingSitemaps() {
  // Look for groups of sticky notes with connectors (simple heuristic)
  // Just return empty for now - user can manually load if needed
  return [];
}

// Extract sitemap structure from existing sitemap
function extractSitemapText(selection) {
  // For now, return null - extraction from simple sticky notes is complex
  // User will need to rebuild from scratch or save their text
  return null;
}

// Send initial state to UI
const existingSitemaps = checkExistingSitemaps();
let sitemapText = '';

if (existingSitemaps.length > 0) {
  // Load the most recent sitemap
  sitemapText = extractSitemapText(existingSitemaps[existingSitemaps.length - 1]) || '';
}

figma.ui.postMessage({
  type: 'init',
  existingSitemaps: existingSitemaps.length,
  sitemapText: sitemapText
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'check-existing') {
    const existing = checkExistingSitemaps();
    figma.ui.postMessage({
      type: 'existing-count',
      count: existing.length
    });
  }

  if (msg.type === 'create-sitemap') {
    const nodes = msg.nodes;
    const mode = msg.mode;

    try {
      if (mode === 'update') {
        // Remove the most recent sitemap
        const existingSitemaps = checkExistingSitemaps();
        if (existingSitemaps.length > 0) {
          existingSitemaps[existingSitemaps.length - 1].remove();
        }
      } else if (mode === 'delete-all') {
        // Remove all existing sitemaps
        const existingSitemaps = checkExistingSitemaps();
        existingSitemaps.forEach(sitemap => sitemap.remove());
      }

      await createSitemap(nodes);

      const message = mode === 'update'
        ? '✅ Sitemap updated successfully!'
        : '✅ Sitemap created successfully!';
      figma.notify(message);

      // Update count in UI
      const updated = checkExistingSitemaps();
      figma.ui.postMessage({
        type: 'existing-count',
        count: updated.length
      });

      // Close plugin after successful creation
      figma.closePlugin();
    } catch (error) {
      figma.notify('❌ Error creating sitemap: ' + error.message);
      console.error(error);
    }
  }

  if (msg.type === 'export-to-figma') {
    const nodes = msg.nodes;
    const frameWidth = msg.frameWidth;
    const frameHeight = msg.frameHeight;

    try {
      await exportToFigmaDesign(nodes, frameWidth, frameHeight);
      figma.notify('✅ Figma design file created successfully!');
    } catch (error) {
      figma.notify('❌ Error creating Figma file: ' + error.message);
      console.error(error);
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

async function createSitemap(nodes) {
  console.log('createSitemap called with nodes:', nodes);

  if (!nodes || nodes.length === 0) {
    figma.notify('No nodes to create');
    console.error('No nodes provided');
    return;
  }

  const allElements = [];

  // Load fonts for text labels
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });

  console.log('Creating page nodes...');
  const nodeMap = new Map();

  // Build tree structure to calculate layout
  const tree = [];
  const stack = [];

  for (let index = 0; index < nodes.length; index++) {
    const node = Object.assign({}, nodes[index], { id: index, children: [] });

    // Find parent
    while (stack.length > 0 && stack[stack.length - 1].depth >= node.depth) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      tree.push(node);
    }

    stack.push(node);
  }

  // Calculate positions - same level = same Y, children below parents
  const HORIZONTAL_SPACING = 250;
  const VERTICAL_SPACING = 200;
  const positions = new Map();

  function layoutTree(nodeList, startX, startY) {
    let currentX = startX;

    for (const node of nodeList) {
      positions.set(node.id, { x: currentX, y: startY });

      if (node.children.length > 0) {
        layoutTree(node.children, currentX, startY + VERTICAL_SPACING);
      }

      currentX += HORIZONTAL_SPACING;
    }
  }

  // Layout each tree
  let treeStartX = 0;
  for (const rootNode of tree) {
    layoutTree([rootNode], treeStartX, 0);
    treeStartX += HORIZONTAL_SPACING * 2;
  }

  // Create visual elements
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    const pos = positions.get(index);

    // Create rounded rectangle
    const rect = figma.createRectangle();
    rect.x = pos.x;
    rect.y = pos.y;
    rect.resize(200, 100);
    rect.cornerRadius = 8;

    // Style the rectangle
    if (node.depth === 0) {
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.9, b: 0.6 } }]; // Yellow
    } else {
      rect.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.95, b: 1 } }]; // Light blue
    }
    rect.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
    rect.strokeWeight = 2;

    // Create text label
    const text = figma.createText();

    // Set font BEFORE setting characters
    text.fontName = { family: "Inter", style: "Regular" };
    text.characters = node.name || '';
    text.fontSize = 16;
    text.textAlignHorizontal = 'CENTER';
    text.textAlignVertical = 'CENTER';
    text.resize(180, 50);

    // Create a frame to group rectangle and text
    const frame = figma.createFrame();
    frame.name = node.name || 'Page';
    frame.x = pos.x;
    frame.y = pos.y;
    frame.resize(200, 100);
    frame.clipsContent = false;
    frame.fills = [];

    // Add children to frame
    frame.appendChild(rect);
    frame.appendChild(text);

    // Reset child positions relative to frame
    rect.x = 0;
    rect.y = 0;
    text.x = 10;
    text.y = 25;

    nodeMap.set(index, { frame, rect, depth: node.depth || 0 });
    allElements.push(frame);
  }
  console.log('Created', nodeMap.size, 'page nodes');

  // Create connectors based on depth relationships
  const depthStack = [];

  for (let i = 0; i < nodes.length; i++) {
    const currentNode = nodes[i];
    const currentDepth = currentNode.depth || 0;

    // Update stack for current depth
    depthStack[currentDepth] = i;

    // If not root level, connect to parent
    if (currentDepth > 0) {
      const parentIndex = depthStack[currentDepth - 1];

      if (parentIndex !== undefined) {
        const parentRect = nodeMap.get(parentIndex).rect;
        const childRect = nodeMap.get(i).rect;

        const connector = figma.createConnector();

        // Parent connects from BOTTOM
        connector.connectorStart = {
          endpointNodeId: parentRect.id,
          magnet: 'BOTTOM'
        };

        // Child connects from TOP
        connector.connectorEnd = {
          endpointNodeId: childRect.id,
          magnet: 'TOP'
        };

        allElements.push(connector);
      }
    }
  }

  // Center viewport
  console.log('Centering viewport on', allElements.length, 'elements');
  if (allElements.length > 0) {
    figma.currentPage.selection = allElements;
    figma.viewport.scrollAndZoomIntoView(allElements);
  }
  console.log('Sitemap creation complete!');
}

async function exportToFigmaDesign(nodes, frameWidth, frameHeight) {
  console.log('Exporting to Figma design with frame size:', frameWidth, 'x', frameHeight);

  // Load font
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Find or create a new page for the designs
  let designPage = null;

  // Look for existing "Page Designs" page
  const existingPage = figma.root.children.find(function(page) {
    return page.name === 'Page Designs';
  });

  if (existingPage) {
    designPage = existingPage;
  } else {
    // Create new page using the root.appendChild pattern
    designPage = figma.createPage();
    designPage.name = 'Page Designs';
  }

  // Switch to the design page
  figma.currentPage = designPage;

  const frames = [];
  const FRAME_SPACING = 100;
  let currentX = 0;
  let currentY = 0;
  let maxHeight = 0;

  // Create a frame for each page
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // Create frame
    const frame = figma.createFrame();
    frame.name = node.name;
    frame.x = currentX;
    frame.y = currentY;
    frame.resize(frameWidth, frameHeight);

    // Add background fill
    frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

    // Add page title text
    const text = figma.createText();
    text.fontName = { family: "Inter", style: "Regular" };
    text.characters = node.name;
    text.fontSize = 24;
    text.x = 40;
    text.y = 40;

    // Add text to frame
    frame.appendChild(text);

    frames.push(frame);

    // Update position for next frame
    currentX += frameWidth + FRAME_SPACING;
    maxHeight = Math.max(maxHeight, frameHeight);

    // Wrap to next row if needed (after 5 frames)
    if ((i + 1) % 5 === 0) {
      currentX = 0;
      currentY += maxHeight + FRAME_SPACING;
      maxHeight = 0;
    }
  }

  // Select all frames and zoom to view
  designPage.selection = frames;
  figma.viewport.scrollAndZoomIntoView(frames);

  console.log('Created', frames.length, 'design frames');
}
