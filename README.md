# Fungitsiidi resistentsuse kaart

## Kausta struktuur: 

```
eff_map/
├── index.html              # alus
├── css/
│   └── styles.css          # kujundus
├── js/
│   └── map.js             # kaart
├── data/
│   └── fungicides.json    # andmestik
├── images/
│   └── logos/
│      ├── Eesti-Teadusagentuur-logo-color_RGB-300x94.webp
│      ├── METK_EE_HORIS_MUST.png
│      ├── Zymo_logo_tekstita.png
│   ├── ZT_pilt.jpg        # Zymoseptoria kahjustuse foto
│   └── Ptt_pilt.jpg       # Pyrenophora kahjustuse foto
└── README.md              # üldine ja tehniline info
```


## Kaardi uuendamine:

Andmete uuendamiseks:

1. Uuenda CSV alusfaili
2. Konverteeri JSON formaati kasutades koodi `EM_CSV_to_JSON.py`
3. Asenda `fungicides.json` uue versiooniga GitHubis
4. Uuendused ilmuvad automaatselt 1-2 minuti pärast

####################
# Fungicide Map Improvement To-Do List

## **Phase 1: Design & Layout Foundation**

### 1. [ ] Redesign intro section layout (#2)
**Why first:** Sets the overall structure before adding content  
**Tasks:**
- Consider hero image at top or stacked layout instead of side-by-side
- Improve visual flow between text and images
- Test on medium screens (tablets)

### 2. [ ] Improve title design (#1)
**Why here:** Affects header space and visual hierarchy  
**Tasks:**
- Add subtitle or tagline
- Improve typography (font size, weight, spacing)
- Consider adding a subtle background or banner
- Make it look less like a Word document header

### 3. [ ] Decide legend placement (#7)
**Why here:** Affects control panel layout structure  
**Tasks:**
- Consider making legend sticky/always visible
- Option: Place legend ON the map itself
- Option: Move to top of control panel (more prominent)
- Test what feels most natural for users

### 4. [ ] Add intro-to-map visual transition (#3)
**Why here:** Affects section boundaries and spacing  
**Tasks:**
- Add visual connection between intro and map
- Consider preview marker or sample data highlight
- Smooth transition instead of harsh break
- Could be as simple as color/border adjustment

---

## **Phase 2: Accessibility Foundation (Color System)**

Do this BEFORE other visual work to avoid redoing colors later.

### 5. [ ] Add color-blind accessible patterns (#22 - partial)
**Why here:** Changes core color system that affects all future visual work  
**Tasks:**
- Add pattern overlays to red/orange/green markers (stripes, dots, crosshatch)
- Test with color-blind simulator tools
- Document pattern meanings in legend
- CSS-only solution preferred

**Example approach:**
```css
/* Add SVG patterns to markers */
.marker-red { fill: url(#diagonal-stripes); }
.marker-orange { fill: url(#dots); }
.marker-green { fill: url(#solid); }
```

---

## **Phase 3: Content & Information Architecture**

Now that layout is stable, add content that fits the structure.

### 6. [ ] Add plain language explanations (#16)
**Why here:** Content goes into finalized layout  
**Tasks:**
- Add tooltips/glossary for scientific terms
- "EC50" → explain in simple Estonian
- "Zymoseptoria tritici" → add common name explanation
- Consider toggle between "Scientific" and "Simple" language mode

### 7. [ ] Add farmer recommendations (#18)
**Why here:** Major content addition, needs stable layout  
**Tasks:**
- Add "What should I do with this information?" section
- Provide actionable next steps based on resistance levels
- Link to fungicide rotation recommendations
- Consider adding near the intro or as a FAQ section

### 8. [ ] Improve contact visibility (#20)
**Why here:** Content placement decision  
**Tasks:**
- Move email address higher up (maybe in intro section)
- Add "Need help?" or "Questions?" header
- Increase font size and prominence
- Consider adding a feedback form link

### 9. [ ] Add "Last updated" date (#19)
**Why here:** Simple metadata addition  
**Tasks:**
- Add date to footer: "Andmed viimati uuendatud: DD.MM.YYYY"
- Update this manually when data changes
- Consider adding: "Proovisid kokku: 1594"

### 10. [ ] Improve disease photo presentation (#17)
**Why here:** Visual content improvement on stable layout  
**Tasks:**
- Make images larger and clearer
- Improve labels (bigger, more descriptive)
- Consider modal popup on click for full-size view
- Add more context to photo captions

---

## **Phase 4: Visual Polish**

Once content is in place, polish the visuals.

### 11. [ ] Balance footer logo sizes (#8)
**Why last in design:** Pure aesthetics, doesn't affect anything else  
**Tasks:**
- Make logos visually equal weight (not same size, but balanced)
- METK currently looks too small compared to Zymo
- Adjust max-height values to create visual harmony
- Test alignment and spacing

---

## **Phase 5: Interactive Features**

Add functionality that builds on the stable design.

### 12. [ ] Add year range selector (#10)
**Why here:** New control element, needs finalized layout  
**Tasks:**
- Allow selecting multiple years (e.g., 2020-2023 combined)
- Options: Range slider, checkboxes, or "From-To" dropdowns
- Show combined data from selected years
- Update map title to show selected range

**Implementation ideas:**
- Replace single slider with range slider (min/max handles)
- OR add checkboxes below slider for multi-select
- Display: "Showing data from 2020-2023"

### 13. [ ] Add loading states & error handling (#23)
**Why here:** Enhances existing functionality  
**Tasks:**
- Add loading spinner when switching filters
- Replace `alert()` with styled notification box
- Show "Loading data..." message
- Graceful error messages if JSON fails
- Test on slow connection

**Example:**
```javascript
// Show spinner
document.getElementById('map').classList.add('loading');
// After data loads
document.getElementById('map').classList.remove('loading');
```

---

## **Phase 6: Performance & Technical Optimization**

Optimize what's already working.

### 14. [ ] Implement caching & progressive loading (#21)
**Why here:** Optimize finished product  
**Tasks:**
- Add browser caching headers for fungicides.json
- Consider service worker for offline access
- Progressive loading: Show map first, load data after
- Test on 3G connection speed

### 15. [ ] Full accessibility audit (#22 - complete)
**Why last:** Comprehensive testing of finished product  
**Tasks:**
- Add keyboard navigation (Tab through controls, Enter to select)
- Add ARIA labels to all interactive elements
- Test with screen reader (NVDA or JAWS)
- Ensure all images have descriptive alt text
- Add skip-to-content link
- Test with keyboard-only navigation

**Checklist:**
- [ ] Can navigate entire map with keyboard only
- [ ] Screen reader announces all important info
- [ ] Focus indicators are visible
- [ ] Color is not the only way to convey information
- [ ] All interactive elements have ARIA labels

---

## **Dependencies Summary**

```
Phase 1 (Layout)
    ↓
Phase 2 (Color System)
    ↓
Phase 3 (Content)
    ↓
Phase 4 (Polish)
    ↓
Phase 5 (Features)
    ↓
Phase 6 (Performance)
```

**Each phase builds on the previous without requiring rework.**

---

## **Priority Notes**

**Must Do (Core Functionality):**
- #7 Legend placement
- #16 Plain language
- #18 Farmer recommendations
- #23 Loading states

**Should Do (User Experience):**
- #1 Title design
- #2 Intro layout
- #19 Last updated date
- #22 Color-blind patterns

**Nice to Have (Enhancement):**
- #3 Intro transition
- #8 Logo balance
- #10 Year range
- #17 Photo improvements
- #21 Performance optimization
- #22 Full accessibility

---

## **Estimated Timeline**

**Phase 1-2:** 1-2 weeks (design decisions + color system)  
**Phase 3:** 1 week (content writing + placement)  
**Phase 4:** 1-2 days (visual tweaking)  
**Phase 5:** 1 week (feature development)  
**Phase 6:** 1 week (testing + optimization)

**Total:** ~4-6 weeks for complete implementation

---


