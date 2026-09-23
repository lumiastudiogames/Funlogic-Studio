window.CURRENT_LEVEL = {
  "id": 2,
  "title": "The Hound of Dartmoor Moor",
  "subtitle": "Step into Victorian England as Sherlock Holmes and Dr. Watson investigate supernatural sightings acr...",
  "difficulty": "Normal (4x4)",
  "icon": "🔍",
  "synopsis": "A terrifying spectral howl echoes across the fog-choked Grimpen Mire. Four investigators spread across Devonshire to collect tangible proof before another life is claimed.",
  "description": "Step into Victorian England as Sherlock Holmes and Dr. Watson investigate supernatural sightings across Dartmoor. Use deductive reasoning to catalog footprints, phosphorescent chemicals, and abandoned walking canes.",
  "categories": {
    "categoryA": {
      "name": "Investigators",
      "items": [
        {
          "id": "holmes",
          "name": "Sherlock Holmes"
        },
        {
          "id": "watson",
          "name": "Dr. John Watson"
        },
        {
          "id": "lestrade",
          "name": "Insp. Lestrade"
        },
        {
          "id": "mortimer",
          "name": "Dr. Mortimer"
        }
      ]
    },
    "categoryB": {
      "name": "Locations",
      "items": [
        {
          "id": "hall",
          "name": "Baskerville Hall"
        },
        {
          "id": "mire",
          "name": "Grimpen Mire"
        },
        {
          "id": "house",
          "name": "Merripit House"
        },
        {
          "id": "quarry",
          "name": "Stone Quarry"
        }
      ]
    },
    "categoryC": {
      "name": "Evidence",
      "items": [
        {
          "id": "phosphor",
          "name": "Phosphorescent Paste"
        },
        {
          "id": "cane",
          "name": "Thorn Cane"
        },
        {
          "id": "boot",
          "name": "Muddy Boot"
        },
        {
          "id": "watch",
          "name": "Antique Watch"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Sherlock Holmes investigated Grimpen Mire and recovered the Phosphorescent Paste.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "holmes",
        "cat2": "categoryB",
        "item2": "mire",
        "state": "CHECK",
        "reason": "Holmes was at Grimpen Mire."
      }
    },
    {
      "id": "c2",
      "text": "The investigator at Baskerville Hall discovered the Thorn Cane.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "hall",
        "cat2": "categoryC",
        "item2": "cane",
        "state": "CHECK",
        "reason": "The cane was found at Baskerville Hall."
      }
    },
    {
      "id": "c3",
      "text": "Dr. Mortimer did not visit Baskerville Hall nor did he find the Muddy Boot.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "mortimer",
        "cat2": "categoryB",
        "item2": "hall",
        "state": "CROSS",
        "reason": "Dr. Mortimer was not at Baskerville Hall."
      }
    },
    {
      "id": "c4",
      "text": "Dr. Watson was stationed at Baskerville Hall during the evening.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "watson",
        "cat2": "categoryB",
        "item2": "hall",
        "state": "CHECK",
        "reason": "Dr. Watson was at Baskerville Hall."
      }
    },
    {
      "id": "c5",
      "text": "Inspector Lestrade discovered the Muddy Boot, but he did not go to the Stone Quarry.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "lestrade",
        "cat2": "categoryC",
        "item2": "boot",
        "state": "CHECK",
        "reason": "Lestrade found the Muddy Boot."
      }
    },
    {
      "id": "c6",
      "text": "The Antique Watch was found at the Stone Quarry.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "quarry",
        "cat2": "categoryC",
        "item2": "watch",
        "state": "CHECK",
        "reason": "The watch was at the Stone Quarry."
      }
    }
  ],
  "solution": {
    "holmes": {
      "categoryB": "mire",
      "categoryC": "phosphor"
    },
    "watson": {
      "categoryB": "hall",
      "categoryC": "cane"
    },
    "lestrade": {
      "categoryB": "house",
      "categoryC": "boot"
    },
    "mortimer": {
      "categoryB": "quarry",
      "categoryC": "watch"
    }
  }
};
