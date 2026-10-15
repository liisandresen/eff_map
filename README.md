# Fungitsiiditundlikkuse kaart

Veebikaart, mis näitab kõrreliste helelaiksuse (*Zymoseptoria tritici*) ja odra võrklaiksuse
(*Pyrenophora teres* f. *teres*) tekitajate tundlikkust kaheksa fungitsiidi toimeaine suhtes Eesti
põldudel aastate kaupa.

Haldaja: METKi taimekaitse osakonna resistentsuse töörühm, <liis.andresen@metk.agri.ee>

## Tehniline ülevaade

- Staatiline veebileht (HTML, CSS, JavaScript): serveripoolset koodi ega andmebaasi ei ole.
- Kaarditeek: [Leaflet](https://leafletjs.com) 1.9.4, projektiga kaasas kaustas `vendor/leaflet/`.
- Aluskaart: OpenStreetMap (`tile.openstreetmap.org`). See on lehe ainus väline ressurss; fonte,
  analüütikat ega küpsiseid ei kasutata.
- Toetatud brauserid: Chrome, Edge, Firefox ja Safari värskeimad versioonid.

Leafleti uuendamiseks laadi uus versioon aadressilt <https://leafletjs.com/download> ja asenda
kausta `vendor/leaflet/` sisu.

Kujundus järgib METKi brändijuhendit. Brändi fondid (Manuale, Roboto) on CSS-is esimesena
kirjas, kuid lehega kaasa ei tule; kui neid soovitakse, lisa fondifailid (WOFF2) kausta `fonts/`
ja `@font-face` reeglid faili `css/styles.css` algusesse. Google Fontsi serverit ei kasutata.

## Kaustastruktuur

```text
fungitsiiditundlikkuse-kaart/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── map.js
├── data/
│   └── fungicides.json
├── images/
│   ├── nisu_k.jpg          taustapilt väga laial ekraanil
│   ├── Ptt_pilt_r.jpg      odra võrklaiksus
│   ├── ZT_pilt_r.jpg       kõrreliste helelaiksus
│   └── logos/
│       ├── Eesti-Teadusagentuur-logo-color_RGB-300x94.webp
│       ├── METK_EE_HORIS_MUST.png
│       └── Zymo_logo_tekstita.png
└── vendor/
    └── leaflet/            Leaflet 1.9.4
        ├── images/
        ├── leaflet.css
        └── leaflet.js
```

## Andmed

`data/fungicides.json` sisaldab kirjete massiivi; iga kirje on üks isolaat. 

| Väli | Sisu |
| --- | --- |
| `aasta` | uuringuaasta |
| `organism` | `ZT` – kõrreliste helelaiksus, `PTT` – odra võrklaiksus |
| `vald`, `maakond` | põllu asukoht hüpikaknas |
| `latitude`, `longitude` | koordinaadid kümnendkraadides (WGS84), ümardatud kahe kümnendkohani (umbes ±500 m); samas punktis olevad kirjed kuvatakse kaardil ühe tähisena |
| `FLX`, `BIX`, `PROD`, `TEB`, `MEF`, `FEN`, `PYR`, `AZO` | EC50 (mg/l) toimeainete kaupa; testimata toimeaine puhul `null` |

EC50 võib olla arv või piirväärtus kujul `">10"` või `"<0.01"`; piirväärtust käsitletakse piiri
väärtusena. Muud tekstiväärtused jätab skript välja ja loetleb need.

Põllu tähis näitab sellelt põllult leitud suurima EC50 väärtusega isolaadi gruppi.

| Grupp | EC50 (mg/l) | Tähis |
| --- | --- | --- |
| Tundlik | ≤ 0,5 | ring |
| Vähem tundlik | > 0,5 ja < 5 | kolmnurk |
| Mittetundlik | ≥ 5 | ruut |

Piirid on kirjas failis `js/map.js` ja legendis failis `index.html`; muutmisel tuleb uuendada
mõlemat.

## Litsents

Kood (HTML, CSS, JavaScript, Pythoni skript): MIT.
Andmed (data/fungicides.json): CC BY 4.0. Andmete kasutamisel viita Maaelu Teadmuskeskusele (METK).



