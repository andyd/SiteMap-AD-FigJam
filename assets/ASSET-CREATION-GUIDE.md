# Asset Creation Guide - Step by Step

## ✅ Icon: DONE!

**File**: `plugin-icon.svg` (created for you)

### To Convert SVG to PNG:

**Method 1: Using Figma** (Recommended)
1. Open Figma
2. Create a 128×128px frame
3. Copy the SVG code from `plugin-icon.svg`
4. Paste into Figma (Ctrl/Cmd + Shift + V)
5. Select all → Right-click → "Flatten"
6. Export as PNG @ 2x (will be 256×256, perfect for retina)
7. Save as `plugin-icon.png`

**Method 2: Online Converter**
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `plugin-icon.svg`
3. Set width to 256px (2x for retina)
4. Download PNG
5. Rename to `plugin-icon.png`

**Method 3: Command Line** (if you have ImageMagick)
```bash
convert plugin-icon.svg -resize 256x256 plugin-icon.png
```

---

## 📸 Cover Image (1920×960px)

### Option A: Create in Figma (Best)

**Steps:**

1. **Create Frame**
   - New Figma file
   - Create frame: 1920×960px
   - Name it "Plugin Cover"

2. **Add Background**
   - Fill: Linear gradient
   - Top: #E6F4FF (light blue)
   - Bottom: #F0F9FF (lighter blue)
   - Or solid: #F7FAFC (light gray)

3. **Split Layout (Two Sections)**

   **Left Side (960px wide):**
   - Title: "Sitemap Builder" (72px, bold)
   - Subtitle: "Create Visual Sitemaps from Text" (32px)
   - Show text editor with example:
     ```
     Home
       About
       Products
         Product A
         Product B
       Contact
     ```
   - Use code font (Monaco, Courier)

   **Right Side (960px wide):**
   - Screenshot of the actual sitemap result
   - Show connected boxes in tree structure
   - Or mockup of the visual sitemap

4. **Add Icon**
   - Place your plugin icon in top-left corner (80×80px)
   - Add subtle shadow

5. **Export**
   - Select frame
   - Export as PNG @ 2x
   - Save as `cover-image.png`

### Option B: Quick Screenshot Method

1. Open your plugin in FigJam
2. Create a nice example sitemap
3. Zoom to show both text editor and result
4. Take screenshot (Cmd/Ctrl + Shift + 4)
5. Open in Photoshop/Figma
6. Crop to 1920×960px
7. Add title text overlay
8. Export as PNG

### Option C: Use Template (Easiest!)

I'll create an HTML template you can screenshot:

---

## 📷 Screenshots (3-5 needed)

### Screenshot 1: Plugin Interface
**What to show**: Main plugin UI with text editor and preview

**Steps:**
1. Open FigJam
2. Run Sitemap Builder plugin
3. Type example sitemap:
   ```
   Home
     About Us
     Services
       Web Design
       Branding
       Marketing
     Portfolio
     Contact
   ```
4. Make sure preview panel shows parsed structure
5. Screenshot the plugin window (Cmd/Ctrl + Shift + 4)
6. Crop to show just the plugin
7. Save as `screenshot-1-interface.png`

### Screenshot 2: Sitemap Result
**What to show**: The visual sitemap created on canvas

**Steps:**
1. After creating sitemap above, close plugin
2. Zoom to fit the sitemap nicely
3. Take screenshot of the canvas with sitemap
4. Show the connected boxes clearly
5. Save as `screenshot-2-result.png`

### Screenshot 3: Website Import
**What to show**: Import feature in action

**Steps:**
1. Open plugin
2. Enter a URL in import field (e.g., "apple.com")
3. Set depth to 2
4. Take screenshot before clicking Import
5. Save as `screenshot-3-import.png`

### Screenshot 4: Export Modal (Optional but good)
**What to show**: Export to Figma feature

**Steps:**
1. With sitemap text entered
2. Click "Export to Figma"
3. Screenshot the frame size selection modal
4. Shows all device options
5. Save as `screenshot-4-export.png`

### Screenshot 5: Final Page Designs (Optional)
**What to show**: Exported page design frames

**Steps:**
1. After exporting to design frames
2. Zoom out to show all frames in grid
3. Show the section container with frames inside
4. Save as `screenshot-5-designs.png`

---

## 🎨 Cover Image Template (HTML)

I'll create an HTML file you can open and screenshot:


