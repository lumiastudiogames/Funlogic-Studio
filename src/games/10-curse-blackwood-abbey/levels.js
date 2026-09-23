window.CURRENT_LEVEL = {
  "id": 10,
  "title": "The Curse of Blackwood Abbey",
  "subtitle": "In an isolated Yorkshire monastery ruin, candlelight flickers through hollow stone arches. Uncover m...",
  "difficulty": "Normal (4x4)",
  "icon": "🕯️",
  "synopsis": "Heavy iron bells toll across the moor as mist creeps over the ancient gargoyles of Blackwood Abbey.",
  "description": "In an isolated Yorkshire monastery ruin, candlelight flickers through hollow stone arches. Uncover medieval manuscripts, secret reliquaries, and hidden motives.",
  "categories": {
    "categoryA": {
      "name": "Scholars",
      "items": [
        {
          "id": "thomas",
          "name": "Father Thomas"
        },
        {
          "id": "graves",
          "name": "Prof. Graves"
        },
        {
          "id": "ross",
          "name": "Antiquarian Ross"
        },
        {
          "id": "beatrice",
          "name": "Lady Beatrice"
        }
      ]
    },
    "categoryB": {
      "name": "Abbey Grounds",
      "items": [
        {
          "id": "crypt",
          "name": "Crypt Vault"
        },
        {
          "id": "cloister",
          "name": "Cloister Garden"
        },
        {
          "id": "tower",
          "name": "Bell Tower"
        },
        {
          "id": "reliquary",
          "name": "Hidden Reliquary"
        }
      ]
    },
    "categoryC": {
      "name": "Sacred Relics",
      "items": [
        {
          "id": "rosary",
          "name": "Obsidian Rosary"
        },
        {
          "id": "manuscript",
          "name": "Illuminated Tome"
        },
        {
          "id": "chalice",
          "name": "Golden Chalice"
        },
        {
          "id": "key",
          "name": "Abbey Iron Key"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The scholar in the Crypt Vault unearthed the Obsidian Rosary.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "crypt",
        "cat2": "categoryC",
        "item2": "rosary",
        "state": "CHECK",
        "reason": "Crypt Vault matches Obsidian Rosary."
      }
    },
    {
      "id": "c2",
      "text": "Father Thomas spent the night in prayer at the Bell Tower.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "thomas",
        "cat2": "categoryB",
        "item2": "tower",
        "state": "CHECK",
        "reason": "Father Thomas was in the Bell Tower."
      }
    },
    {
      "id": "c3",
      "text": "Prof. Graves was searching for the Illuminated Tome, but did not visit the Cloister Garden.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "graves",
        "cat2": "categoryC",
        "item2": "manuscript",
        "state": "CHECK",
        "reason": "Prof. Graves sought the Illuminated Tome."
      }
    },
    {
      "id": "c4",
      "text": "The Golden Chalice was hidden inside the Cloister Garden.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "cloister",
        "cat2": "categoryC",
        "item2": "chalice",
        "state": "CHECK",
        "reason": "Cloister Garden holds Golden Chalice."
      }
    },
    {
      "id": "c5",
      "text": "Lady Beatrice was discovered in the Cloister Garden at dawn.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "beatrice",
        "cat2": "categoryB",
        "item2": "cloister",
        "state": "CHECK",
        "reason": "Lady Beatrice was in Cloister Garden."
      }
    },
    {
      "id": "c6",
      "text": "Father Thomas was holding the Abbey Iron Key.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "thomas",
        "cat2": "categoryC",
        "item2": "key",
        "state": "CHECK",
        "reason": "Father Thomas possessed the Abbey Iron Key."
      }
    }
  ],
  "solution": {
    "thomas": {
      "categoryB": "tower",
      "categoryC": "key"
    },
    "beatrice": {
      "categoryB": "cloister",
      "categoryC": "chalice"
    },
    "graves": {
      "categoryB": "reliquary",
      "categoryC": "manuscript"
    },
    "ross": {
      "categoryB": "crypt",
      "categoryC": "rosary"
    }
  }
};
