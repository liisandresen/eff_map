# Fungitsiidi resistentsuse kaart - GitHub Pages Setup Guide

## 📁 File Structure

Your repository should have this structure:

```
your-repo/
├── index.html              # Main page
├── css/
│   └── styles.css          # All styling
├── js/
│   └── map.js             # Map logic
├── data/
│   └── fungicides.json    # Your data (generated from CSV)
├── images/
│   ├── ZT_pilt.jpg        # Zymoseptoria image
│   └── Ptt_pilt.jpg       # Pyrenophora image
└── README.md              # This file
```

## 🚀 Step-by-Step Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon → **"New repository"**
3. Name it something like: `fungicide-map`
4. Make it **Public**
5. ✅ Check "Add a README file"
6. Click **"Create repository"**

### Step 2: Upload Your Files

**Option A: Using GitHub Web Interface (Easiest)**

1. In your repository, click **"Add file"** → **"Upload files"**
2. Drag and drop ALL files maintaining the folder structure:
   - `index.html` (root)
   - `css/styles.css`
   - `js/map.js`
   - `data/fungicides.json`
   - `images/ZT_pilt.jpg`
   - `images/Ptt_pilt.jpg`
3. Click **"Commit changes"**

**Option B: Using Git (Command Line)**

```bash
git clone https://github.com/YOUR-USERNAME/fungicide-map.git
cd fungicide-map
# Copy all files into this folder
git add .
git commit -m "Initial map upload"
git push
```

### Step 3: Generate Your Data File

Before uploading, run the Python script to create the JSON file:

```bash
python generate_json_data.py
```

This creates `github-pages/data/fungicides.json` from your CSV.

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu)
3. Click **"Pages"** (left sidebar)
4. Under **"Source"**, select:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
5. Click **"Save"**
6. Wait 1-2 minutes for deployment

### Step 5: Access Your Map

Your map will be available at:
```
https://YOUR-USERNAME.github.io/fungicide-map/
```

## 🔄 Updating Your Map

To update the data:

1. Update your CSV file
2. Run `EM_CSV_to_JSON.py`
3. Upload the new `fungicides.json` to GitHub
4. Changes appear automatically in 1-2 minutes

## ⚙️ What Each File Does

**index.html**
- Main structure of the page
- Contains all the text and HTML elements
- Links to CSS and JavaScript files

**css/styles.css**
- All visual styling
- Colors, fonts, layouts
- Responsive design

**js/map.js**
- Loads data from JSON file
- Creates the interactive map
- Handles filtering and marker display

**data/fungicides.json**
- Your dataset in JSON format
- Generated from CSV
- Loaded dynamically by JavaScript

**images/**
- Photos displayed on the page
- Separate files (not embedded)

## 🛠️ Troubleshooting

**Map doesn't show?**
- Check browser console (F12) for errors
- Verify `fungicides.json` exists in `data/` folder
- Check file paths are correct

**Images don't load?**
- Verify images are in `images/` folder
- Check filenames match exactly (case-sensitive!)

**Changes don't appear?**
- Wait 1-2 minutes for GitHub Pages to rebuild
- Clear browser cache (Ctrl+Shift+R)
- Check you uploaded to correct branch

## 📊 Benefits of This Setup

✅ **Easy updates** - Just replace the JSON file
✅ **Free hosting** - GitHub Pages is free
✅ **Version control** - Track all changes
✅ **Professional** - Clean, maintainable code
✅ **Fast loading** - Browser caches files separately

---

**Questions?** Check GitHub Pages documentation: https://pages.github.com/
