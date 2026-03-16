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


