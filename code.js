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

// Check for existing page design collections
function checkExistingPageDesigns() {
  const pageDesigns = [];
  
  // Look for "Page Designs" page
  const designPage = figma.root.children.find(page => page.name === 'Page Designs');
  if (!designPage) return pageDesigns;
  
  // Look for sections or frames with the "pageDesigns" plugin data
  for (const node of designPage.children) {
    // Check both SECTION and FRAME types for compatibility
    if ((node.type === 'SECTION' || node.type === 'FRAME') && 
        node.getPluginData('pageDesigns') === 'true') {
      pageDesigns.push(node);
    }
  }
  
  console.log('Found', pageDesigns.length, 'existing page design collections');
  return pageDesigns;
}

// Extract sitemap structure from existing page designs
function extractSitemapFromDesigns(designContainer) {
  if (!designContainer) return null;
  
  try {
    // Get the stored sitemap text from plugin data
    const storedText = designContainer.getPluginData('sitemapText');
    if (storedText) {
      console.log('Extracted sitemap text from page designs');
      return storedText;
    }
    
    // Fallback: reconstruct from individual frames
    console.log('Reconstructing sitemap from design frames...');
    const nodeData = [];
    
    for (const child of designContainer.children) {
      if (child.type === 'FRAME' && child.getPluginData('pageDepth')) {
        const depth = parseInt(child.getPluginData('pageDepth') || '0');
        const name = child.getPluginData('pageName') || child.name;
        const index = parseInt(child.getPluginData('pageIndex') || '0');
        
        nodeData.push({ index, name, depth });
      }
    }
    
    // Sort by original index
    nodeData.sort((a, b) => a.index - b.index);
    
    // Convert to indented text
    const lines = nodeData.map(node => {
      const indent = '  '.repeat(node.depth);
      return indent + node.name;
    });
    
    return lines.join('\n');
  } catch (error) {
    console.error('Error extracting sitemap from designs:', error);
    return null;
  }
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
      // Check if we're in FigJam
      if (figma.editorType === 'figjam') {
        figma.notify('⚠️ Export creates frames in current FigJam file. For best results, run this plugin in a Figma Design file.', { timeout: 5000 });
      }
      
      await exportToFigmaDesign(nodes, frameWidth, frameHeight);
      
      if (figma.editorType === 'figjam') {
        figma.notify('✅ Page design frames created in current file!');
      } else {
        figma.notify('✅ Page design frames created successfully!');
      }
    } catch (error) {
      figma.notify('❌ Error creating frames: ' + error.message);
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

  try {
    // Load fonts
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    console.log('Fonts loaded');
  } catch (error) {
    console.error('Error loading fonts:', error);
    throw new Error('Failed to load fonts: ' + error.message);
  }

  // Find or create the "Page Designs" page
  let designPage = null;
  
  try {
    // Try to find existing "Page Designs" page
    if (figma.root && figma.root.children) {
      designPage = figma.root.children.find(page => page.name === 'Page Designs');
      console.log('Found existing Page Designs page:', !!designPage);
    }
    
    if (!designPage) {
      // Try to create new page (may not work in FigJam)
      if (typeof figma.createPage === 'function') {
        console.log('Creating new Page Designs page...');
        designPage = figma.createPage();
        designPage.name = 'Page Designs';
        console.log('Created new page:', designPage.name);
      } else {
        // Fallback: use current page
        console.log('Cannot create new page, using current page');
        designPage = figma.currentPage;
      }
    }

    // Switch to the design page
    figma.currentPage = designPage;
    console.log('Using page:', designPage.name);
  } catch (error) {
    console.error('Error with page creation:', error);
    // Fallback to current page if all else fails
    console.log('Falling back to current page');
    designPage = figma.currentPage;
  }

  // Calculate layout
  console.log('Calculating layout for', nodes.length, 'nodes...');
  const FRAME_SPACING = 100;
  const FRAMES_PER_ROW = 5;
  const pageFrames = [];
  
  // Calculate grid positions
  const positions = [];
  for (let i = 0; i < nodes.length; i++) {
    const row = Math.floor(i / FRAMES_PER_ROW);
    const col = i % FRAMES_PER_ROW;
    
    positions.push({
      x: col * (frameWidth + FRAME_SPACING),
      y: row * (frameHeight + FRAME_SPACING)
    });
  }
  console.log('Calculated', positions.length, 'positions');

  // Calculate bounds for container
  const maxX = Math.max(...positions.map(p => p.x)) + frameWidth;
  const maxY = Math.max(...positions.map(p => p.y)) + frameHeight;
  console.log('Container bounds: maxX=', maxX, 'maxY=', maxY);
  
  const PADDING = 100;
  const containerWidth = maxX + PADDING * 2;
  const containerHeight = maxY + PADDING * 2;

  // Create container (section or frame depending on support)
  let container;
  try {
    // Try to create a section (available in newer Figma/FigJam)
    if (typeof figma.createSection === 'function') {
      container = figma.createSection();
      console.log('Created section container');
    } else {
      throw new Error('Sections not supported');
    }
  } catch (error) {
    // Fallback: create a large frame as container
    console.log('Sections not supported, using frame container');
    container = figma.createFrame();
    container.clipsContent = false;
    console.log('Created frame container');
  }
  
  // Set container properties with error handling
  try {
    container.name = `Page Designs (${nodes.length} pages, ${frameWidth}×${frameHeight})`;
    console.log('Set container name');
    
    container.x = 0;
    container.y = 0;
    console.log('Set container position');
    
    // Resize may not work on sections
    if (typeof container.resize === 'function') {
      container.resize(containerWidth, containerHeight);
      console.log('Resized container to', containerWidth, 'x', containerHeight);
    } else {
      console.log('Resize not available on this container type');
    }
    
    // Set background (may not work on all container types)
    if (container.fills !== figma.mixed && container.fills !== undefined) {
      try {
        container.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 1 }, opacity: 0.5 }];
        console.log('Set container background');
      } catch (fillError) {
        console.log('Could not set container background:', fillError.message);
      }
    }
  } catch (error) {
    console.error('Error setting container properties:', error);
    throw error;
  }

  // Store metadata on container
  try {
    container.setPluginData('pageDesigns', 'true');
    container.setPluginData('sitemapText', nodes.map(n => '  '.repeat(n.depth) + n.name).join('\n'));
    container.setPluginData('createdAt', new Date().toISOString());
    container.setPluginData('pageCount', nodes.length.toString());
    container.setPluginData('frameWidth', frameWidth.toString());
    container.setPluginData('frameHeight', frameHeight.toString());
    console.log('Stored metadata on container');
  } catch (error) {
    console.error('Error storing metadata:', error);
  }

  console.log('Creating', nodes.length, 'page design frames...');

  // Create a frame for each page
  for (let i = 0; i < nodes.length; i++) {
    try {
      const node = nodes[i];
      const pos = positions[i];
      console.log(`Creating frame ${i + 1}/${nodes.length}: ${node.name}`);

      // Create frame
      const frame = figma.createFrame();
      frame.name = node.name;
      frame.x = pos.x + PADDING;
      frame.y = pos.y + PADDING;
      frame.resize(frameWidth, frameHeight);
      console.log(`  Frame created and positioned`);

      // Add background fill
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      console.log(`  Background set`);

      // Store metadata on frame
      frame.setPluginData('pageDepth', node.depth.toString());
      frame.setPluginData('pageIndex', i.toString());
      frame.setPluginData('pageName', node.name);
      console.log(`  Metadata stored`);

      // Add page title text
      const titleText = figma.createText();
      titleText.fontName = { family: "Inter", style: "Medium" };
      titleText.characters = node.name;
      titleText.fontSize = 32;
      titleText.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
      
      // Position title
      titleText.x = 60;
      titleText.y = 60;
      
      frame.appendChild(titleText);
      console.log(`  Title text added`);

      // Add hierarchy indicator if not root
      if (node.depth > 0) {
        const depthLabel = figma.createText();
        depthLabel.fontName = { family: "Inter", style: "Regular" };
        depthLabel.characters = `Level ${node.depth}`;
        depthLabel.fontSize = 14;
        depthLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
        depthLabel.x = 60;
        depthLabel.y = 105;
        
        frame.appendChild(depthLabel);
        console.log(`  Depth label added`);
      }

      // Add to container
      container.appendChild(frame);
      pageFrames.push(frame);
      console.log(`  Frame ${i + 1} complete and added to container`);
    } catch (frameError) {
      console.error(`Error creating frame ${i + 1}:`, frameError);
      throw frameError;
    }
  }

  console.log('Created', pageFrames.length, 'design frames in container');

  // Select container and zoom to view
  designPage.selection = [container];
  figma.viewport.scrollAndZoomIntoView([container]);

  console.log('Export complete! Container:', container.name);
}
