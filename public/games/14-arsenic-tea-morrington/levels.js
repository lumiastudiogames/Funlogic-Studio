window.CURRENT_LEVEL = {
  "id": 14,
  "title": "The Arsenic Tea Party at Morrington",
  "subtitle": "During a refined 5 o'clock afternoon tea in the Cotswolds, bitter almond scent drifted from the silv...",
  "difficulty": "Normal (4x4)",
  "icon": "☕",
  "synopsis": "Chintz curtains flutter gently in the English drawing room as four teacups sit upon delicate porcelain saucers.",
  "description": "During a refined 5 o'clock afternoon tea in the Cotswolds, bitter almond scent drifted from the silver teapot. Sift through the polite conversation to expose the poisoned teacup.",
  "categories": {
    "categoryA": {
      "name": "Guests",
      "items": [
        {
          "id": "marpleton",
          "name": "Miss Marpleton"
        },
        {
          "id": "kensington",
          "name": "Col. Kensington"
        },
        {
          "id": "evelyn",
          "name": "Evelyn Cross"
        },
        {
          "id": "finch",
          "name": "Dr. Finch"
        }
      ]
    },
    "categoryB": {
      "name": "Parlor Seats",
      "items": [
        {
          "id": "fireside",
          "name": "Fireside Armchair"
        },
        {
          "id": "baywindow",
          "name": "Bay Window Seat"
        },
        {
          "id": "piano",
          "name": "Piano Stool"
        },
        {
          "id": "table",
          "name": "Mahogany Table"
        }
      ]
    },
    "categoryC": {
      "name": "Poisons",
      "items": [
        {
          "id": "arsenic",
          "name": "Powdered Arsenic"
        },
        {
          "id": "belladonna",
          "name": "Belladonna Drops"
        },
        {
          "id": "cyanide",
          "name": "Almond Cyanide"
        },
        {
          "id": "monkshood",
          "name": "Monkshood Herb"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Miss Marpleton sat in the Bay Window Seat sipping tea tainted with Almond Cyanide.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "marpleton",
        "cat2": "categoryB",
        "item2": "baywindow",
        "state": "CHECK",
        "reason": "Marpleton was at Bay Window Seat."
      }
    },
    {
      "id": "c2",
      "text": "The guest sitting at the Piano Stool brought Powdered Arsenic.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "piano",
        "cat2": "categoryC",
        "item2": "arsenic",
        "state": "CHECK",
        "reason": "Piano Stool matches Powdered Arsenic."
      }
    },
    {
      "id": "c3",
      "text": "Colonel Kensington occupied the Fireside Armchair.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "kensington",
        "cat2": "categoryB",
        "item2": "fireside",
        "state": "CHECK",
        "reason": "Kensington was in the Fireside Armchair."
      }
    },
    {
      "id": "c4",
      "text": "Dr. Finch did not sit at the Piano Stool.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "finch",
        "cat2": "categoryB",
        "item2": "piano",
        "state": "CROSS",
        "reason": "Dr. Finch was not at the Piano Stool."
      }
    },
    {
      "id": "c5",
      "text": "The cup at the Fireside Armchair was laced with Belladonna Drops.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "fireside",
        "cat2": "categoryC",
        "item2": "belladonna",
        "state": "CHECK",
        "reason": "Fireside matches Belladonna Drops."
      }
    }
  ],
  "solution": {
    "marpleton": {
      "categoryB": "baywindow",
      "categoryC": "cyanide"
    },
    "kensington": {
      "categoryB": "fireside",
      "categoryC": "belladonna"
    },
    "evelyn": {
      "categoryB": "piano",
      "categoryC": "arsenic"
    },
    "finch": {
      "categoryB": "table",
      "categoryC": "monkshood"
    }
  }
};
