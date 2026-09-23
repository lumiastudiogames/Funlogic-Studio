window.CURRENT_LEVEL = {
  "id": 6,
  "title": "The Mystery of Blackwood Manor",
  "subtitle": "Lord Blackwood summoned his relatives to read his new last will. By midnight, the patriarch was sile...",
  "difficulty": "Normal (4x4)",
  "icon": "🏰",
  "synopsis": "Rain lashes against the stained-glass windows of the historic Blackwood estate as thunder shakes the stone manor.",
  "description": "Lord Blackwood summoned his relatives to read his new last will. By midnight, the patriarch was silenced. Can you determine who had what motive and where they hid?",
  "categories": {
    "categoryA": {
      "name": "Suspects",
      "items": [
        {
          "id": "lord",
          "name": "Lord Blackwood Jr."
        },
        {
          "id": "eleanor",
          "name": "Lady Eleanor"
        },
        {
          "id": "higgins",
          "name": "Butler Higgins"
        },
        {
          "id": "sterling",
          "name": "Dr. Sterling"
        }
      ]
    },
    "categoryB": {
      "name": "Rooms",
      "items": [
        {
          "id": "library",
          "name": "Library"
        },
        {
          "id": "conservatory",
          "name": "Conservatory"
        },
        {
          "id": "billiard",
          "name": "Billiard Room"
        },
        {
          "id": "cellar",
          "name": "Wine Cellar"
        }
      ]
    },
    "categoryC": {
      "name": "Motives",
      "items": [
        {
          "id": "forgery",
          "name": "Forged Will"
        },
        {
          "id": "extortion",
          "name": "Blackmail Letters"
        },
        {
          "id": "debt",
          "name": "Gambler Debt"
        },
        {
          "id": "secret",
          "name": "Family Secret"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The suspect in the Library was driven by the Forged Will.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "library",
        "cat2": "categoryC",
        "item2": "forgery",
        "state": "CHECK",
        "reason": "Library matches Forged Will."
      }
    },
    {
      "id": "c2",
      "text": "Lady Eleanor waited inside the Conservatory, but she had no connection to Gambler Debt.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "eleanor",
        "cat2": "categoryB",
        "item2": "conservatory",
        "state": "CHECK",
        "reason": "Lady Eleanor was in Conservatory."
      }
    },
    {
      "id": "c3",
      "text": "Butler Higgins hid in the Wine Cellar to conceal the Blackmail Letters.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "higgins",
        "cat2": "categoryB",
        "item2": "cellar",
        "state": "CHECK",
        "reason": "Higgins was in the Wine Cellar."
      }
    },
    {
      "id": "c4",
      "text": "Dr. Sterling was not the person in the Library.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "sterling",
        "cat2": "categoryB",
        "item2": "library",
        "state": "CROSS",
        "reason": "Dr. Sterling was not in the Library."
      }
    },
    {
      "id": "c5",
      "text": "The Gambler Debt motive was tied to the person in the Billiard Room.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "billiard",
        "cat2": "categoryC",
        "item2": "debt",
        "state": "CHECK",
        "reason": "Billiard Room matches Gambler Debt."
      }
    }
  ],
  "solution": {
    "higgins": {
      "categoryB": "cellar",
      "categoryC": "extortion"
    },
    "eleanor": {
      "categoryB": "conservatory",
      "categoryC": "secret"
    },
    "lord": {
      "categoryB": "library",
      "categoryC": "forgery"
    },
    "sterling": {
      "categoryB": "billiard",
      "categoryC": "debt"
    }
  }
};
