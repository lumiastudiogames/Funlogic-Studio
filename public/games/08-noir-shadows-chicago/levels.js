window.CURRENT_LEVEL = {
  "id": 8,
  "title": "Shadows Over Chicago: 1932",
  "subtitle": "Prohibition-era Chicago is caught between crooked syndicate bosses and private eyes in fedoras. Dedu...",
  "difficulty": "Normal (4x4)",
  "icon": "🕵️",
  "synopsis": "Sirens wail through the rain-drenched alleys as neon beer signs buzz in the Chicago night.",
  "description": "Prohibition-era Chicago is caught between crooked syndicate bosses and private eyes in fedoras. Deduce where mobsters stashed stolen diamonds and counterfeit bank notes.",
  "categories": {
    "categoryA": {
      "name": "Underworld Figures",
      "items": [
        {
          "id": "malone",
          "name": "Jack Malone"
        },
        {
          "id": "frankie",
          "name": "Frankie Two-Face"
        },
        {
          "id": "moretti",
          "name": "Tommy Moretti"
        },
        {
          "id": "stella",
          "name": "Stella Vance"
        }
      ]
    },
    "categoryB": {
      "name": "Speakeasies",
      "items": [
        {
          "id": "flamingo",
          "name": "The Blue Flamingo"
        },
        {
          "id": "clover",
          "name": "Lucky Clover"
        },
        {
          "id": "warehouse9",
          "name": "Warehouse 9"
        },
        {
          "id": "pier42",
          "name": "Pier 42"
        }
      ]
    },
    "categoryC": {
      "name": "Contraband",
      "items": [
        {
          "id": "thompson",
          "name": "Thompson Submachine"
        },
        {
          "id": "bonds",
          "name": "Counterfeit Bonds"
        },
        {
          "id": "ledger",
          "name": "Bribe Ledger"
        },
        {
          "id": "diamonds",
          "name": "Diamond Case"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The contraband stashed at Warehouse 9 was the Thompson Submachine.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "warehouse9",
        "cat2": "categoryC",
        "item2": "thompson",
        "state": "CHECK",
        "reason": "Warehouse 9 stored the Thompson."
      }
    },
    {
      "id": "c2",
      "text": "Frankie Two-Face operates out of The Blue Flamingo, but was not involved with Counterfeit Bonds.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "frankie",
        "cat2": "categoryB",
        "item2": "flamingo",
        "state": "CHECK",
        "reason": "Frankie was at Blue Flamingo."
      }
    },
    {
      "id": "c3",
      "text": "Stella Vance was cornered at Pier 42 carrying the Diamond Case.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "stella",
        "cat2": "categoryB",
        "item2": "pier42",
        "state": "CHECK",
        "reason": "Stella was at Pier 42."
      }
    },
    {
      "id": "c4",
      "text": "Jack Malone was seen snooping around Warehouse 9.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "malone",
        "cat2": "categoryB",
        "item2": "warehouse9",
        "state": "CHECK",
        "reason": "Jack Malone was at Warehouse 9."
      }
    },
    {
      "id": "c5",
      "text": "The Lucky Clover safe contained the Counterfeit Bonds.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "clover",
        "cat2": "categoryC",
        "item2": "bonds",
        "state": "CHECK",
        "reason": "Lucky Clover matches Counterfeit Bonds."
      }
    }
  ],
  "solution": {
    "malone": {
      "categoryB": "warehouse9",
      "categoryC": "thompson"
    },
    "frankie": {
      "categoryB": "flamingo",
      "categoryC": "ledger"
    },
    "stella": {
      "categoryB": "pier42",
      "categoryC": "diamonds"
    },
    "moretti": {
      "categoryB": "clover",
      "categoryC": "bonds"
    }
  }
};
