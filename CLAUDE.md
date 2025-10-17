# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a FigJam plugin that creates visual website sitemaps using sticky notes and native connectors. Users can build sitemaps from indented text input or import from existing websites (via sitemap.xml or web crawling). The plugin demonstrates FigJam-specific APIs including sticky notes, auto-routing connectors, and sections.

## Architecture

### Plugin Structure
- **code.js**: Main plugin code running in the FigJam sandbox with access to the `figma` global object
- **ui.html**: User interface running in an iframe with standard web APIs (text editor, preview panel, import functionality)
- **manifest.json**: Plugin configuration with `"editorType": ["figjam"]` to restrict to FigJam only

### Communication Model
The plugin uses message-passing between environments:
- UI → Plugin: `parent.postMessage({ pluginMessage: {...} }, '*')` from ui.html
- Plugin → UI: `figma.ui.postMessage({...})` from code.js
- Plugin receives messages via `figma.ui.onmessage` callback

### Message Types
- `init`: Plugin sends initial state to UI with existing sitemap count and text
- `check-existing`: UI requests count of existing sitemaps on canvas
- `existing-count`: Plugin sends updated count of sitemaps to UI
- `create-sitemap`: UI requests sitemap creation with `nodes` array and `mode` ('new', 'update', or 'delete-all')
- `cancel`: UI requests plugin closure

## Core Functionality

### Text Parsing (ui.html:529-559)
The `parseText()` function converts indented text to node structure:
- Calculates depth from leading spaces/tabs (2 spaces = 1 level)
- Validates that indentation doesn't skip levels
- Returns `{nodes, errors}` with nodes containing `{name, depth, line}`

### Simple Sitemap Creation (code.js:146-272)
The `createSitemap()` function uses a **basic sticky notes and connectors approach**:

**Architecture:**
- Individual sticky notes positioned in a tree layout
- Connectors between parent and child stickies using FigJam's default auto-routing
- No frame nesting or grouping - just standalone elements

**Layout Algorithm:**
1. Build tree structure with parent-child relationships using stack-based parser
2. Calculate tree width recursively (leaf nodes = 1, parents = sum of children)
3. Position nodes using simple centering algorithm:
   - Parents centered above their children
   - Horizontal spacing: 300px between sibling subtrees
   - Vertical spacing: 250px between parent-child levels
4. Multiple root trees positioned side-by-side with extra spacing

**Sitemap Creation Process:**
1. Parse nodes into tree structure
2. Calculate positions (x, y coordinates) for each node
3. Create sticky notes (200x200px) at calculated positions with color coding:
   - Root nodes (depth 0): Yellow `{r: 1, g: 0.9, b: 0.6}`
   - Child nodes: Light blue `{r: 0.8, g: 0.95, b: 1}`
4. Create connectors between parent and child stickies:
   - Uses `endpointNodeId` with `magnet: 'AUTO'` for attachment
   - FigJam handles all routing automatically
   - No stroke weight or color customization - uses FigJam defaults
5. Centers viewport on all created elements

**Connector Behavior:**
- Connectors attach to sticky notes via `endpointNodeId`
- FigJam's `magnet: 'AUTO'` handles attachment point selection
- Connectors automatically re-route when stickies are moved
- Moving a parent sticky DOES NOT move children (they're independent)

### Existing Sitemap Detection (code.js:7-18)
- `checkExistingSitemaps()`: Currently returns empty array (no detection)
- `extractSitemapText()`: Returns null (no extraction from existing sitemaps)
- Users should save their text input separately if they want to reload/edit

### Website Import (ui.html:308-526)
Two-tier import strategy:
1. **fetchSitemap()**: Attempts to fetch sitemap.xml via CORS proxy (https://api.allorigins.win/raw?url=)
2. **crawlWebsite()**: Falls back to BFS crawling if no sitemap found (max 50 pages, respects depth limit)
3. **buildTreeFromUrls()**: Converts URL paths to hierarchical tree structure
4. Generates indented text via `treeToText()`

## FigJam-Specific APIs

### Key FigJam Node Types
- `figma.createSticky()`: Creates sticky notes (main sitemap nodes)
  - Use `sticky.resize(width, height)` to set dimensions
  - Set text with `sticky.text.characters = "text"`
- `figma.createConnector()`: Creates auto-routing connectors
  - `connectorStart/End`: Objects with `{endpointNodeId, magnet: 'AUTO'}` for attachment
  - Connectors stay attached when sticky notes are moved
  - Auto-routes around obstacles

### Visual Styling
- Root nodes: `{r: 1, g: 0.9, b: 0.6}` (yellow sticky notes)
- Child nodes: `{r: 0.8, g: 0.95, b: 1}` (light blue sticky notes)
- Connectors: FigJam default styling (no customization applied)

## Development Workflow

### Installing/Testing the Plugin
1. Open FigJam Desktop App
2. Navigate to `Plugins` → `Development` → `Import plugin from manifest...`
3. Select `manifest.json` from this directory
4. Plugin appears as "Sitemap Builder (FigJam)" in plugins menu

### Making Changes
1. Edit code.js or ui.html
2. In FigJam, close and reopen the plugin to reload
3. For manifest.json changes, re-import the plugin entirely

### Key Constraints
- Plugin code (code.js) cannot access DOM, fetch, localStorage, or browser APIs
- UI code (ui.html) cannot access FigJam document APIs or `figma` object
- All data exchange requires postMessage
- Must call `figma.closePlugin()` when done, or plugin remains open
- Fonts must be loaded with `figma.loadFontAsync()` before creating text

## Important Implementation Details

### Sitemap Update/Delete Modes
- **'new'**: Creates new sitemap without removing existing ones
- **'update'**: Removes most recent sitemap (last in array) before creating new one
- **'delete-all'**: Removes all existing sitemaps before creating new one

### State Management in UI
- `existingSitemapCount`: Tracks number of sitemaps on canvas
- `isEditingExisting`: Boolean flag indicating if user loaded an existing sitemap
- `pendingNodes`: Temporarily stores parsed nodes while modal is open
- Modal shown when existing sitemaps detected, offering update/create-new/delete-all options

### CORS Proxy for Website Import
- Uses https://api.allorigins.win/raw?url= to bypass CORS restrictions
- Required for both sitemap.xml fetching and page crawling
- Import feature may fail if proxy is down or website blocks it

### Layout Characteristics
The simple sticky note approach provides:
- **Predictable tree layout**: Parent nodes centered above their children
- **Independent stickies**: Each sticky can be moved freely without affecting others
- **Auto-routing connectors**: Connectors automatically adjust when endpoints move
- **Clean visual hierarchy**: Color coding distinguishes root from child nodes
- **FigJam native behavior**: Uses standard FigJam elements without complex nesting
- **Manual editing friendly**: Users can easily reposition individual nodes as needed
