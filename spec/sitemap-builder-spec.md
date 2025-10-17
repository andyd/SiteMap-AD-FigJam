# Sitemap Builder Plugin - Technical Specification

## Overview

A Figma plugin that enables users to create, edit, and visualize website sitemaps through both a text-based editor and a visual tree representation. The plugin provides bidirectional synchronization between text input and visual output, making it easy to plan information architecture.

## Core Features

### 1. Text Editor Interface
- Multi-line text input using indentation to define hierarchy
- Real-time syntax validation with error highlighting
- Support for indentation styles (tabs or spaces)
- Line numbers for easy navigation
- Undo/redo functionality

### 2. Visual Tree Representation
- Automatic generation of connected node tree from text input
- Hierarchical layout with consistent spacing
- Visual indicators for node depth/level
- Auto-layout with intelligent positioning
- Connection lines showing parent-child relationships

### 3. Drag & Drop Editing
- Drag nodes in the visual tree to reorganize structure
- Visual feedback during drag operations
- Snap-to-grid for consistent alignment
- Update text editor when visual tree is modified

### 4. Bidirectional Synchronization
- Changes in text editor immediately update visual tree
- Changes in visual tree immediately update text editor
- Maintain cursor position and selection state when possible
- Preserve formatting and whitespace

### 5. Auto-Layout System
- Intelligent spacing between nodes (horizontal and vertical)
- Automatic repositioning when structure changes
- Collision detection and resolution
- Center alignment for child nodes under parents
- Configurable spacing parameters

## Technical Requirements

### Data Structure

```javascript
{
  nodes: [
    {
      id: string,           // Unique identifier
      name: string,         // Page/section name
      depth: number,        // Indentation level (0-based)
      parent: string|null,  // Parent node ID
      children: string[],   // Array of child node IDs
      x: number,           // X position on canvas
      y: number,           // Y position on canvas
      frameId: string      // Figma frame reference
    }
  ],
  textContent: string,     // Raw text input
  spacing: {
    horizontal: number,    // Space between sibling nodes
    vertical: number       // Space between parent-child levels
  }
}
```

### Key Functions

#### Text Parser
```javascript
parseTextToTree(text: string): Node[]
```
- Parse indented text into node structure
- Validate hierarchy (no skipped levels)
- Detect and report syntax errors
- Generate unique IDs for each node

#### Tree Renderer
```javascript
renderTreeToCanvas(nodes: Node[]): void
```
- Create Figma rectangles for each node
- Add text labels
- Draw connection lines
- Apply auto-layout positioning

#### Layout Algorithm
```javascript
calculateNodePositions(nodes: Node[], spacing: Spacing): Position[]
```
- Calculate x,y coordinates for each node
- Ensure no overlapping
- Center children under parents
- Optimize for readability

#### Sync Manager
```javascript
syncTextToVisual(text: string): void
syncVisualToText(nodes: Node[]): string
```
- Handle bidirectional updates
- Debounce rapid changes
- Maintain state consistency

### Figma API Usage

**Node Creation:**
- `figma.createRectangle()` - Create page boxes
- `figma.createText()` - Add labels
- `figma.createLine()` - Draw connections
- `figma.group()` - Group related elements

**Node Manipulation:**
- `node.x`, `node.y` - Position nodes
- `node.resize()` - Set dimensions
- `node.fills` - Set colors
- `node.strokes` - Set borders

**Selection & Events:**
- `figma.currentPage.selection` - Get/set selected nodes
- `figma.on('selectionchange')` - Detect user interaction
- Drag event handling via position changes

## UI/UX Design

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Sitemap Builder                            [×]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────────────┐  ┌────────────────────┐   │
│  │ Text Editor        │  │ Visual Preview     │   │
│  │                    │  │                    │   │
│  │ Home               │  │     ┌────────┐     │   │
│  │   About            │  │     │  Home  │     │   │
│  │   Services         │  │     └───┬────┘     │   │
│  │     Consulting     │  │       ┌─┴─┬─┐      │   │
│  │     Design         │  │       │   │ │      │   │
│  │   Contact          │  │    About Srv Cnt   │   │
│  │                    │  │          │         │   │
│  │                    │  │        ┌─┴─┐       │   │
│  │                    │  │       Cns Dsg      │   │
│  └────────────────────┘  └────────────────────┘   │
│                                                     │
│  [Create Visual] [Export...] [Settings]            │
└─────────────────────────────────────────────────────┘
```

### Visual Style
- **Node boxes**: Rounded rectangles, white fill, gray stroke
- **Text**: 14px, Inter font, center-aligned
- **Connections**: 2px gray lines
- **Hover state**: Light blue highlight
- **Selected state**: Blue stroke, 3px
- **Error state**: Red outline with warning icon

### Controls
- **Create Visual**: Generate/update tree from text
- **Export**: Download as JSON, PNG, or nested frames
- **Settings**: Configure spacing, colors, export options
- **Auto-sync toggle**: Enable/disable real-time updates

## User Workflows

### 1. Quick Sitemap Entry
1. User opens plugin
2. Types indented sitemap structure
3. Clicks "Create Visual"
4. Tree appears on canvas
5. User adjusts node positions if needed
6. Exports final sitemap

### 2. Visual-First Editing
1. User creates initial structure in text
2. Switches to visual mode
3. Drags nodes to reorganize
4. Text automatically updates
5. Continues editing in either mode

### 3. Large Sitemap Management
1. User pastes large sitemap from external tool
2. Plugin validates and highlights errors
3. User fixes indentation issues
4. Creates visual in sections (by depth level)
5. Exports full tree or specific branches

### 4. Collaborative Editing
1. User creates sitemap visual on canvas
2. Teammate edits structure by moving frames
3. Original user re-opens plugin
4. Plugin detects changes and updates text
5. Sync continues bidirectionally

## Edge Cases & Error Handling

### Invalid Input
- **Skipped levels**: "Home" → "    Services" (missing intermediate level)
  - Action: Show error message, highlight problematic line
- **Mixed indentation**: Tabs and spaces combined
  - Action: Detect and normalize to user preference
- **Empty lines**: Treat as intentional separators or ignore
  - Action: User setting for behavior

### Large Sitemaps
- **500+ nodes**: May cause performance issues
  - Solution: Virtualization, lazy rendering
- **Deep nesting** (10+ levels): Hard to visualize
  - Solution: Collapsible sections, zoom controls

### Canvas Limits
- **Nodes outside viewport**: User can't see full tree
  - Solution: Auto-zoom to fit, mini-map navigation
- **Overlapping nodes**: Collision from manual edits
  - Solution: Auto-adjust with "Clean Layout" button

### Sync Conflicts
- **Circular dependencies**: A → B → A
  - Solution: Detect cycles, show error
- **Orphaned nodes**: Child has deleted parent
  - Solution: Promote to root or auto-delete

## Export Options

### 1. Figma Frame Export
- Create nested auto-layout frames
- Preserves editability in Figma
- Option to lock structure

### 2. JSON Export
```json
{
  "sitemap": {
    "name": "Home",
    "children": [
      {
        "name": "About",
        "children": []
      },
      {
        "name": "Services",
        "children": [
          {"name": "Consulting"},
          {"name": "Design"}
        ]
      }
    ]
  }
}
```

### 3. PNG Export
- Rasterized image of visual tree
- Configurable resolution
- Transparent or white background

### 4. HTML Export
- Interactive web-based sitemap
- Clickable nodes
- Expandable/collapsible sections

### 5. Text Export
- Plain text with indentation
- Markdown format with bullets
- CSV format for spreadsheet import

## Development Roadmap

### V1.0 - MVP (Core Features)
- [ ] Text editor with basic parsing
- [ ] Visual tree generation
- [ ] Manual layout (drag to position)
- [ ] Basic node styling
- [ ] Text export

### V1.5 - Enhanced
- [ ] Auto-layout algorithm
- [ ] Bidirectional sync
- [ ] Drag & drop reorganization
- [ ] Settings panel (spacing, colors)
- [ ] JSON export

### V2.0 - Advanced
- [ ] Real-time collaboration
- [ ] Templates library
- [ ] Advanced export formats (HTML, PNG)
- [ ] Node metadata (URLs, descriptions)
- [ ] Search & filter
- [ ] Version history
- [ ] Collapsible tree sections
- [ ] Custom node icons

## Technical Constraints

### Figma API Limitations
- Plugin UI runs in iframe (limited to 500px width default)
- Main thread cannot access DOM
- Async communication required between UI and plugin code
- Text nodes require font loading

### Performance Targets
- Parse and render <100 nodes: <500ms
- Parse and render <500 nodes: <2s
- Sync delay: <100ms for real-time feel
- Canvas operations: Use figma.createRectangle() batch mode

### Browser Compatibility
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript
- No external dependencies in plugin code

## Security & Privacy

- No external API calls (all processing local)
- No data storage outside Figma document
- No analytics or tracking
- User data stays in Figma file

## Future Considerations

- Integration with actual website URLs (validation, screenshots)
- Import from existing website (crawl and generate)
- Multi-language support for node labels
- Accessibility features (screen reader support, keyboard navigation)
- Mobile app companion
- Plugin API for extensibility
