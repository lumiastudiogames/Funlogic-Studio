window.CURRENT_LEVEL = {
  "id": 1,
  "title": "Murder on the Continental Express",
  "subtitle": "Murder on the Continental Express is a classic 1930s train murder mystery logic grid puzzle. Solve t...",
  "difficulty": "Normal (4x4)",
  "icon": "🚂",
  "synopsis": "During a blizzard in the Balkan mountains, the Continental Express is stopped dead on the tracks. An aristocrat has been found deceased, and four suspects hold contradictory alibis.",
  "description": "Murder on the Continental Express is a classic 1930s train murder mystery logic grid puzzle. Solve the cross-references between suspects, luxury compartments, and critical physical evidence before the locomotive reaches Istanbul.",
  "categories": {
    "categoryA": {
      "name": "Suspects",
      "items": [
        {
          "id": "arbuthnot",
          "name": "Col. Arbuthnot"
        },
        {
          "id": "elena",
          "name": "Countess Elena"
        },
        {
          "id": "macqueen",
          "name": "Hector MacQueen"
        },
        {
          "id": "debenham",
          "name": "Mary Debenham"
        }
      ]
    },
    "categoryB": {
      "name": "Compartments",
      "items": [
        {
          "id": "cabin2",
          "name": "Cabin No. 2"
        },
        {
          "id": "cabin5",
          "name": "Cabin No. 5"
        },
        {
          "id": "cabin8",
          "name": "Cabin No. 8"
        },
        {
          "id": "cabin12",
          "name": "Cabin No. 12"
        }
      ]
    },
    "categoryC": {
      "name": "Belongings",
      "items": [
        {
          "id": "dagger",
          "name": "Silver Dagger"
        },
        {
          "id": "draught",
          "name": "Sleeping Draught"
        },
        {
          "id": "pistol",
          "name": "Pocket Pistol"
        },
        {
          "id": "scarf",
          "name": "Silk Scarf"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The passenger in Cabin No. 5 was carrying the Silk Scarf.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "cabin5",
        "cat2": "categoryC",
        "item2": "scarf",
        "state": "CHECK",
        "reason": "Cabin No. 5 directly matches the Silk Scarf."
      }
    },
    {
      "id": "c2",
      "text": "Countess Elena stayed in Cabin No. 2, but she was not the one carrying the Sleeping Draught.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "elena",
        "cat2": "categoryB",
        "item2": "cabin2",
        "state": "CHECK",
        "reason": "Countess Elena was in Cabin No. 2."
      }
    },
    {
      "id": "c3",
      "text": "Col. Arbuthnot had the Silver Dagger and stayed in a higher numbered cabin than Hector MacQueen.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "arbuthnot",
        "cat2": "categoryC",
        "item2": "dagger",
        "state": "CHECK",
        "reason": "Col. Arbuthnot carried the Silver Dagger."
      }
    },
    {
      "id": "c4",
      "text": "The Pocket Pistol was discovered inside Cabin No. 2.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "cabin2",
        "cat2": "categoryC",
        "item2": "pistol",
        "state": "CHECK",
        "reason": "The Pocket Pistol belongs to Cabin No. 2."
      }
    },
    {
      "id": "c5",
      "text": "Mary Debenham stayed in Cabin No. 5.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "debenham",
        "cat2": "categoryB",
        "item2": "cabin5",
        "state": "CHECK",
        "reason": "Mary Debenham was assigned to Cabin No. 5."
      }
    },
    {
      "id": "c6",
      "text": "Hector MacQueen did not stay in Cabin No. 12.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "macqueen",
        "cat2": "categoryB",
        "item2": "cabin12",
        "state": "CROSS",
        "reason": "Hector MacQueen was not in Cabin No. 12."
      }
    }
  ],
  "solution": {
    "elena": {
      "categoryB": "cabin2",
      "categoryC": "pistol"
    },
    "debenham": {
      "categoryB": "cabin5",
      "categoryC": "scarf"
    },
    "macqueen": {
      "categoryB": "cabin8",
      "categoryC": "draught"
    },
    "arbuthnot": {
      "categoryB": "cabin12",
      "categoryC": "dagger"
    }
  }
};
