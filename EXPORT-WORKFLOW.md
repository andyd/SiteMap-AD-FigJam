# Export to Figma - Workflow Guide

## ⚠️ Important Understanding

**Figma plugins CANNOT create new files** - this is a limitation of the Figma Plugin API. 

The "Export to Figma" feature creates page design frames **in the current file** where the plugin is running.

---

## 🎯 Recommended Workflows

### Workflow 1: Separate FigJam & Figma Files (Recommended)

**Step 1: Create Sitemap in FigJam**
1. Open your FigJam file
2. Run the "Sitemap Builder" plugin
3. Create your sitemap structure with text
4. Click "Save Sitemap"
5. Your visual sitemap is created in FigJam

**Step 2: Export Page Designs in Figma**
1. **Open a NEW Figma Design file** (File → New Design File)
2. Run the "Sitemap Builder" plugin again
3. Paste the same sitemap text (or recreate it)
4. Click "Export to Figma"
5. Choose frame size (Desktop/Tablet/Mobile)
6. Page design frames are created in the Figma file

**Result:**
- ✅ Sitemap lives in FigJam (for planning/collaboration)
- ✅ Page designs live in Figma (for actual design work)
- ✅ Clean separation of concerns

---

### Workflow 2: All-in-One FigJam File

**Single File Approach:**
1. Open your FigJam file
2. Run the plugin
3. Create sitemap → Click "Save Sitemap"
4. Click "Export to Figma"
5. Page design frames are created on the same canvas

**Result:**
- ✅ Everything in one place
- ✅ Quick and simple
- ⚠️ FigJam file may get cluttered
- ⚠️ Page design frames aren't in a dedicated Figma file

---

### Workflow 3: Design-First in Figma

**Start in Figma:**
1. **Open a Figma Design file**
2. Run the plugin
3. Create your sitemap text
4. Click "Save Sitemap" → creates sitemap on canvas
5. Click "Export to Figma" → creates page designs
6. Both sitemap and frames in same Figma file

**Result:**
- ✅ Everything in Figma (no FigJam needed)
- ✅ Good for design-heavy projects
- ✅ Frames ready for immediate design work

---

## 🔍 What Gets Created

### "Save Sitemap" Creates:
- Visual sitemap with rectangles and connectors
- Shows hierarchy and relationships
- Grouped in a section for organization
- Great for presentations and planning

### "Export to Figma" Creates:
- Individual page design frames
- Each frame is blank and ready to design on
- Frame sizes: Desktop (1920×1080), Tablet, Mobile, or custom
- Includes page name (32px title)
- Includes hierarchy level ("Level 1", "Level 2", etc.)
- Organized in a section container

---

## 💡 Pro Tips

1. **Keep sitemap text saved**: Copy your sitemap text to a text file so you can easily paste it into either FigJam or Figma

2. **Use both environments**: 
   - FigJam for sitemap planning and collaboration
   - Figma for actual page designs

3. **Frame sizes**: Choose the right device size before exporting:
   - Desktop: Start with 1920×1080
   - Tablet: iPad Pro 11" (834×1194)
   - Mobile: iPhone 14 Pro (393×852)

4. **Organization**: Each export creates a new section container, so you can export multiple times with different frame sizes if needed

---

## ❓ FAQ

**Q: Can the plugin create a completely new Figma file?**
A: No. Figma's Plugin API doesn't allow plugins to create new files. You need to manually create a new file first, then run the plugin in it.

**Q: Why are the frames created in my FigJam file?**
A: Because that's where you're running the plugin! To get frames in a Figma Design file, open a Figma file and run the plugin there.

**Q: Can I have both sitemap and page designs in one file?**
A: Yes! Both FigJam and Figma can contain both the sitemap and the page design frames. Use sections to keep them organized.

**Q: What if I want to update the page designs later?**
A: Re-run the plugin with your updated sitemap text and export again. The plugin will create a new set of frames (it won't automatically update existing ones).

**Q: Can I customize the page design frames?**
A: Yes! Once exported, they're regular Figma frames. Design directly on them, add components, create layouts, etc.

---

## 📦 What's in Each Export

```
Section: "Page Designs (N pages, WxH)"
├─ Metadata (stored in plugin data)
│  ├─ sitemapText (full text structure)
│  ├─ createdAt (timestamp)
│  ├─ pageCount (number)
│  └─ frame dimensions
│
└─ Page Frames (grid layout, 5 per row)
   ├─ Frame 1: Home
   │  ├─ Title: "Home" (32px)
   │  └─ Metadata (depth, index, name)
   │
   ├─ Frame 2: About
   │  ├─ Title: "About" (32px)
   │  ├─ Label: "Level 1"
   │  └─ Metadata
   │
   └─ [... more frames ...]
```

---

## 🎨 Next Steps After Export

Once you have your page design frames:

1. **Add page-specific content**:
   - Headers and navigation
   - Content sections
   - Footers

2. **Create components**:
   - Reusable headers
   - Navigation menus
   - Buttons and UI elements

3. **Link frames**:
   - Add prototyping connections
   - Create interactive flows

4. **Design variations**:
   - Desktop vs mobile layouts
   - Light vs dark mode
   - Different states

---

**Updated**: October 17, 2025  
**Plugin Version**: 1.1  
**GitHub**: https://github.com/andyd/SiteMap-AD-FigJam

