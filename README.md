# Sitemap Builder for FigJam

A FigJam plugin that creates visual website sitemaps using sticky notes and native connectors. Build sitemaps from indented text or import from existing websites.

## Features

- **Text-based sitemap creation**: Use simple indentation to define hierarchy
- **Website import**: Import from sitemap.xml or crawl websites automatically
- **Native FigJam elements**: Uses sticky notes and auto-routing connectors
- **Edit existing sitemaps**: Load and update previously created sitemaps
- **Auto-layout**: Intelligent tree positioning with proper spacing
- **Movable nodes**: Connectors stay attached when moving sticky notes

## How to Install

1. Open FigJam Desktop App
2. Go to `Plugins` → `Development` → `Import plugin from manifest...`
3. Select the `manifest.json` file from this directory
4. The plugin will appear as "Sitemap Builder (FigJam)" in your plugins menu

## How to Use

### Creating a Sitemap from Text

1. Open any FigJam file
2. Go to `Plugins` → `Development` → `Sitemap Builder (FigJam)`
3. Enter your sitemap structure using indentation:
   ```
   Home
     About
     Services
       Consulting
       Design
     Contact
   ```
4. Click "Generate Sitemap"
5. Sticky notes with connectors will be created on the canvas

### Importing from a Website

1. Open the plugin
2. Enter a website URL (e.g., "anthropic.com")
3. Set the crawl depth (1-3 levels recommended)
4. Click "Import from Web"
5. The plugin will attempt to fetch sitemap.xml or crawl the site
6. Review and edit the generated text structure
7. Click "Generate Sitemap"

### Editing Existing Sitemaps

1. If a sitemap already exists on the canvas, it will automatically load into the text editor
2. Make your changes in the text editor
3. Click "Generate Sitemap" and choose "Update Existing Sitemap"

### Moving and Reorganizing

- Simply drag sticky notes to reposition them
- Connectors automatically update and stay attached
- Move parent nodes and all connections remain intact

## Key Differences from Figma Version

**Advantages:**
- Native connectors that auto-route and stay attached
- No complex frame nesting required
- More collaborative and freeform
- Better for brainstorming sessions

**Limitations:**
- Less precise positioning than Figma
- Sticky notes are larger than custom rectangles
- Export options are more limited

## Files

- `manifest.json` - Plugin configuration (set to FigJam)
- `code.js` - Main plugin code using FigJam APIs
- `ui.html` - User interface for text editing and import
- `spec/` - Technical specifications

## Technical Details

### FigJam APIs Used

- `figma.createSticky()` - Creates sticky notes for sitemap nodes
- `figma.createConnector()` - Creates auto-routing connectors between nodes
- `figma.createSection()` - Groups sitemap elements together
- Connector `endpointNodeId` and `magnet: 'AUTO'` for automatic attachment

### Visual Styling

- Root nodes: Yellow sticky notes
- Child nodes: Light blue sticky notes
- Connectors: 3px gray lines with auto-routing
- Section: Light gray background grouping all elements

## Development

To modify this plugin:

1. Edit the files in this directory
2. Reload the plugin in FigJam (close and reopen)
3. For manifest changes, re-import the plugin

## Related

See the sibling `SiteMap-AD` directory for the Figma version of this plugin, which uses custom rectangles and manual connector drawing.
