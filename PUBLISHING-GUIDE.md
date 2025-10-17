# Publishing to Figma Community - Complete Guide

## 📋 Pre-Publishing Checklist

Before you can publish, ensure your plugin meets these requirements:

### ✅ Required Files & Content

- [ ] **manifest.json** - Must have unique plugin ID
- [ ] **README** - Clear description and usage instructions
- [ ] **Plugin icon** - 128×128px PNG (will add in Figma)
- [ ] **Cover image** - 1920×960px showcasing your plugin
- [ ] **Screenshots** - 3-5 images showing plugin in action
- [ ] **Description** - Clear, concise explanation of what it does
- [ ] **Tags** - Relevant categories for discoverability

### ✅ Plugin Quality Standards

- [ ] **Tested thoroughly** - Works without errors
- [ ] **Clear UI** - Intuitive and easy to understand
- [ ] **Good UX** - Follows Figma design patterns
- [ ] **Performance** - Doesn't lag or freeze
- [ ] **Error handling** - Graceful failures with helpful messages
- [ ] **Documentation** - Clear instructions for users

---

## 🎨 Step 1: Prepare Visual Assets

### Plugin Icon (Required)
**Size**: 128×128px PNG  
**Guidelines**:
- Simple, recognizable design
- Works at small sizes
- Transparent or solid background
- Represents your plugin's purpose

**Example for Sitemap Builder**:
- Icon idea: Hierarchy tree structure or connected boxes
- Colors: Blue (#18A0FB - Figma brand color) and white
- Style: Minimal, modern

### Cover Image (Required)
**Size**: 1920×960px  
**Guidelines**:
- Showcases your plugin in action
- High quality, professional looking
- Shows before/after or key features
- Can include text overlay

**For Sitemap Builder**:
- Show a sitemap being created from text
- Split screen: text editor on left, visual sitemap on right
- Title: "Build Visual Sitemaps from Text"

### Screenshots (Recommended 3-5)
**Size**: Flexible, but high resolution  
**Show**:
1. Main plugin interface
2. Sitemap creation in progress
3. Final sitemap result
4. Export to Figma feature
5. Example use case

---

## 🔧 Step 2: Update Plugin Manifest

### Current Manifest Issues

Your current `manifest.json` has a placeholder ID. You need to update it:

**Current**:
```json
{
  "name": "Sitemap Builder",
  "id": "1234567892",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figjam", "figma"]
}
```

### Required Changes

1. **Generate Unique Plugin ID**
   - IDs are 10-13 digit numbers
   - Must be unique
   - Generated automatically when you first publish
   - Can use a random number for now: `1234567890123`

2. **Add Metadata for Community**

**Updated manifest.json**:
```json
{
  "name": "Sitemap Builder",
  "id": "1234567890123",
  "api": "1.0.0",
  "main": "code.js",
  "ui": "ui.html",
  "editorType": ["figjam", "figma"],
  "networkAccess": {
    "allowedDomains": [
      "https://api.allorigins.win"
    ],
    "reasoning": "Required for website import feature - fetches sitemap.xml and crawls websites to build sitemap structure"
  }
}
```

**Note**: The `networkAccess` field is REQUIRED because your plugin uses `fetch()` for website import.

---

## 📝 Step 3: Write Plugin Description

### Short Description (for listing)
**150 characters max**

"Create visual website sitemaps from indented text. Import from websites, export to design frames. Perfect for IA planning and collaboration."

### Full Description (for detail page)

```markdown
# Sitemap Builder

Build beautiful, structured website sitemaps in minutes using simple indented text.

## ✨ Key Features

### 📝 Text-Based Creation
Type your sitemap structure using simple indentation - no complex tools needed. 
Each indent level represents a page hierarchy.

### 🌐 Website Import
Import existing sitemaps from:
- sitemap.xml files
- Automatic website crawling
- Popular CMS platforms

### 🎨 Visual Output
Creates clean, connected diagrams with:
- Automatic layout and spacing
- Color-coded hierarchy
- Easy-to-read structure
- Professional presentation

### 📤 Export to Design Frames
Generate individual page design frames for each page in your sitemap:
- Multiple device sizes (Desktop, Tablet, Mobile)
- Ready-to-design blank canvases
- Organized in sections
- Includes page hierarchy labels

### 🔄 Edit & Update
Load existing sitemaps to make changes. Plugin remembers your structure 
and lets you update without starting from scratch.

## 🎯 Perfect For

- **UX Designers**: Planning information architecture
- **Product Managers**: Documenting site structure
- **Developers**: Understanding page relationships
- **Agencies**: Client presentations and proposals

## 🚀 How to Use

1. Open FigJam or Figma
2. Run Sitemap Builder plugin
3. Type your sitemap structure:
   ```
   Home
     About
     Products
       Product A
       Product B
     Contact
   ```
4. Click "Save Sitemap" - done!

## 💡 Pro Tips

- Use tabs or spaces for indentation (2 spaces = 1 level)
- Import from live websites to save time
- Export to Figma for instant page design templates
- Run in FigJam for planning, Figma for designing

## 🔗 Learn More

- GitHub: [github.com/andyd/SiteMap-AD-FigJam]
- Documentation: See README in plugin
- Support: [your support email/link]

## 🆓 Free & Open Source

This plugin is free to use. Source code available on GitHub.
```

---

## 🚀 Step 4: Publishing Process

### Method 1: Through Figma Desktop App (Recommended)

1. **Open Figma Desktop App**

2. **Go to Plugins Menu**
   - Plugins → Development → Manage plugins in development

3. **Find Your Plugin**
   - You should see "Sitemap Builder" listed

4. **Click "Publish"**
   - Button appears next to your plugin name

5. **Fill Out Publishing Form**
   - **Name**: Sitemap Builder
   - **Tagline**: Create visual website sitemaps from text
   - **Description**: (paste the full description from above)
   - **Categories**: Select relevant tags:
     - UX/UI Design
     - Productivity
     - Documentation
     - Planning
   
6. **Upload Assets**
   - Plugin icon (128×128px)
   - Cover image (1920×960px)
   - Screenshots (3-5 images)

7. **Configure Settings**
   - **Visibility**: Public (anyone can install)
   - **Price**: Free
   - **Support URL**: GitHub repo link
   - **Version**: 1.0.0

8. **Review & Submit**
   - Check all fields are filled
   - Read Figma's Community Guidelines
   - Agree to terms
   - Click "Submit for Review"

### Method 2: Through Figma Web

This method is being phased out. Desktop app is preferred.

---

## 📋 Step 5: Figma Review Process

### What Happens Next

1. **Automated Checks** (Instant)
   - Manifest validation
   - Code security scan
   - Asset quality check

2. **Human Review** (1-5 business days)
   - Figma team reviews your plugin
   - Checks against community guidelines
   - Tests functionality
   - Reviews description and assets

3. **Approval or Feedback**
   - **Approved**: Plugin goes live immediately
   - **Needs Changes**: You'll get specific feedback
   - **Rejected**: Explanation provided (rare)

### Common Rejection Reasons

- ❌ Poor quality assets (blurry images, bad icon)
- ❌ Misleading description
- ❌ Broken functionality or bugs
- ❌ Violates Figma's terms of service
- ❌ Similar to existing plugin (must differentiate)
- ❌ Security concerns with code
- ❌ Missing network access disclosure

---

## 🔒 Step 6: Security & Privacy Review

### Your Plugin Uses Network Access

Because your plugin fetches data from websites, Figma will scrutinize:

**✅ What's Good**:
- Clear `networkAccess` declaration in manifest
- Uses public CORS proxy (allorigins.win)
- No collection of user data
- No external tracking or analytics

**⚠️ Be Ready to Explain**:
- Why network access is needed (website import feature)
- What domains are accessed
- What data is transmitted
- How user privacy is protected

**In Your Review Response**:
```
Network Access Justification:

The plugin uses network access solely for the "Import from Website" 
feature, which allows users to import sitemap structures from live 
websites. This feature:

1. Fetches sitemap.xml files via CORS proxy (api.allorigins.win)
2. Optionally crawls public website pages (user-initiated)
3. Processes data locally in the browser
4. Does not store, transmit, or track any user data
5. Does not collect analytics or telemetry

Users can create sitemaps entirely offline using the text editor - 
network access is optional and only used when explicitly requested 
by the user via the "Import from Web" button.

The CORS proxy is necessary because browsers block direct cross-origin 
requests. We use a public, trusted proxy service.
```

---

## 📊 Step 7: Post-Publication

### Once Approved

1. **Plugin Goes Live**
   - Available in Figma Community
   - Searchable by all users
   - Installs tracked by Figma

2. **Promote Your Plugin**
   - Share on Twitter/LinkedIn
   - Post in Figma Community
   - Add to your portfolio
   - Write a blog post

3. **Monitor Feedback**
   - Check reviews regularly
   - Respond to user questions
   - Address bug reports
   - Consider feature requests

4. **Update Regularly**
   - Fix bugs promptly
   - Add requested features
   - Keep improving UX
   - Maintain compatibility

### Updating Your Published Plugin

**To Release Updates**:

1. Update your code
2. Test thoroughly
3. Update version in manifest: `"version": "1.1.0"`
4. Open Figma Desktop App
5. Plugins → Development → Manage plugins
6. Click "Publish update" next to your plugin
7. Describe changes in release notes
8. Submit for review

**Version Numbering**:
- Major: `2.0.0` (breaking changes)
- Minor: `1.1.0` (new features)
- Patch: `1.0.1` (bug fixes)

---

## 🎨 Creating Your Plugin Icon

### Quick Icon Creation Guide

**Option 1: Design in Figma**
1. Create 128×128px frame
2. Design icon (simple shapes work best)
3. Export as PNG (2x for retina)

**Option 2: Use Iconify or Figma Icons**
1. Find suitable icon (tree, hierarchy, map)
2. Customize colors
3. Export at 128×128px

**Option 3: Generate with AI**
- Midjourney, DALL-E, or similar
- Prompt: "Minimalist icon for sitemap builder plugin, blue and white, 
  shows connected hierarchy boxes, modern flat design, transparent background"

### Recommended Icon Concept

For "Sitemap Builder":
- **Symbol**: Three connected boxes in tree structure
- **Colors**: Figma blue (#18A0FB) for boxes, gray connectors
- **Style**: Flat, minimal, 2-3 colors max
- **Background**: Transparent or white

---

## 📸 Creating Screenshots

### Screenshot Ideas

**Screenshot 1: Main Interface**
- Show the plugin UI with text editor and preview side-by-side
- Caption: "Type your sitemap structure with simple indentation"

**Screenshot 2: Visual Sitemap Result**
- Show a completed sitemap on canvas
- Caption: "Beautiful, connected diagrams created automatically"

**Screenshot 3: Website Import**
- Show the import dialog with a URL
- Caption: "Import from live websites or sitemap.xml files"

**Screenshot 4: Export Feature**
- Show the export modal with frame size options
- Caption: "Export to design frames for all devices"

**Screenshot 5: Final Result**
- Show page design frames created on canvas
- Caption: "Ready-to-design page templates in seconds"

### Screenshot Best Practices

- **Resolution**: At least 1920×1080 or higher
- **Format**: PNG for crisp quality
- **Context**: Show plugin in actual Figma/FigJam environment
- **Annotations**: Add arrows or text to highlight features
- **Clean**: Hide unnecessary UI, use example data
- **Consistent**: Use same color scheme across all screenshots

---

## 🏆 Marketing Your Plugin

### After Publication

**1. Figma Community**
- Post in "Show and Tell" forum
- Share use cases and examples
- Engage with comments

**2. Social Media**
- Twitter: Tag @figma
- LinkedIn: Share with your network
- Design communities (Designer News, etc.)

**3. Content Creation**
- Blog post about the plugin
- YouTube tutorial video
- Case study of real usage
- Templates showcasing the plugin

**4. Portfolio**
- Add to your portfolio site
- Showcase the problem it solves
- Include user testimonials

---

## 📞 Support & Maintenance

### Provide Good Support

**Set Up**:
- GitHub Issues for bug reports
- Discussions for feature requests
- Email for direct support
- FAQ in README

**Response Times**:
- Critical bugs: 24-48 hours
- Feature requests: 1 week
- Questions: 2-3 days

**Communication**:
- Be friendly and helpful
- Thank users for feedback
- Explain technical decisions
- Set realistic expectations

---

## 🚨 Common Issues & Solutions

### Issue: "Plugin ID already exists"
**Solution**: Change the ID in manifest.json to a unique number

### Issue: "Network access not approved"
**Solution**: Clearly justify network usage in submission

### Issue: "Icon too small/blurry"
**Solution**: Export at 256×256px (2x) then scale down

### Issue: "Description too vague"
**Solution**: Add specific features, use cases, and benefits

### Issue: "Doesn't work as described"
**Solution**: Test thoroughly, record demo video

---

## ✅ Final Pre-Publish Checklist

Before clicking "Submit":

- [ ] Plugin tested in both Figma and FigJam
- [ ] No console errors or warnings
- [ ] Icon looks good at 128×128px
- [ ] Cover image is eye-catching
- [ ] 3-5 quality screenshots ready
- [ ] Description is clear and complete
- [ ] Tags/categories selected
- [ ] Network access justified in manifest
- [ ] README is comprehensive
- [ ] GitHub repo is public (if linking)
- [ ] Support contact provided
- [ ] Version number set correctly
- [ ] All features documented

---

## 📚 Additional Resources

**Official Figma Documentation**:
- [Plugin Publishing Guide](https://www.figma.com/plugin-docs/publishing/)
- [Community Guidelines](https://www.figma.com/community/guidelines)
- [Plugin Review Process](https://www.figma.com/plugin-docs/review-guidelines/)

**Community**:
- [Figma Plugin Slack](https://figma.com/plugin-docs/slack/)
- [Plugin API Discord](https://discord.gg/figma-community)

---

## 🎯 Success Metrics

After publishing, track:

- **Installs**: How many users install
- **Active Users**: Daily/weekly usage
- **Reviews**: Star ratings and feedback
- **Run Count**: How often plugin is used
- **Retention**: Users who keep using it

**Success Benchmarks**:
- 100+ installs in first month = Good start
- 4+ star rating = Quality plugin
- 1000+ installs = Popular plugin
- 10000+ installs = Highly successful

---

**Good luck with your plugin! 🚀**

Need help with any specific step? I'm here to assist!

