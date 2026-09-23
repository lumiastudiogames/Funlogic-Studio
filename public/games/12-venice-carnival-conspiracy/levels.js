window.CURRENT_LEVEL = {
  "id": 12,
  "title": "The Venice Carnival Conspiracy",
  "subtitle": "Behind gilded porcelain masks and silk capes, a secret plot threatens the Republic of Venice. Use de...",
  "difficulty": "Normal (4x4)",
  "icon": "🎭",
  "synopsis": "Gondolas glide silently under the Bridge of Sighs while masquerade music masks whispered assassination plots.",
  "description": "Behind gilded porcelain masks and silk capes, a secret plot threatens the Republic of Venice. Use deduction to identify which masquerader carried which poisoned artifact along the Grand Canal.",
  "categories": {
    "categoryA": {
      "name": "Masked Figures",
      "items": [
        {
          "id": "doctor",
          "name": "The Plague Doctor"
        },
        {
          "id": "harlequin",
          "name": "The Harlequin"
        },
        {
          "id": "dove",
          "name": "The Gilded Dove"
        },
        {
          "id": "doge",
          "name": "The Venetian Doge"
        }
      ]
    },
    "categoryB": {
      "name": "Palazzos & Piers",
      "items": [
        {
          "id": "ducale",
          "name": "Palazzo Ducale"
        },
        {
          "id": "rialto",
          "name": "Rialto Bridge"
        },
        {
          "id": "canal",
          "name": "Grand Canal Pier"
        },
        {
          "id": "sanmarco",
          "name": "San Marco Square"
        }
      ]
    },
    "categoryC": {
      "name": "Paraphernalia",
      "items": [
        {
          "id": "goblet",
          "name": "Poisoned Goblet"
        },
        {
          "id": "stiletto_v",
          "name": "Murano Stiletto"
        },
        {
          "id": "cipher",
          "name": "Ciphered Letter"
        },
        {
          "id": "ducats",
          "name": "Gold Ducats"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The Plague Doctor lurked near the Rialto Bridge carrying the Poisoned Goblet.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "doctor",
        "cat2": "categoryB",
        "item2": "rialto",
        "state": "CHECK",
        "reason": "The Plague Doctor was at Rialto Bridge."
      }
    },
    {
      "id": "c2",
      "text": "The Venetian Doge presided over Palazzo Ducale.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "doge",
        "cat2": "categoryB",
        "item2": "ducale",
        "state": "CHECK",
        "reason": "The Doge was at Palazzo Ducale."
      }
    },
    {
      "id": "c3",
      "text": "The person carrying the Murano Stiletto stood at the Grand Canal Pier.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "canal",
        "cat2": "categoryC",
        "item2": "stiletto_v",
        "state": "CHECK",
        "reason": "Grand Canal Pier matches Murano Stiletto."
      }
    },
    {
      "id": "c4",
      "text": "The Gilded Dove was seen in San Marco Square with a pouch of Gold Ducats.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "dove",
        "cat2": "categoryB",
        "item2": "sanmarco",
        "state": "CHECK",
        "reason": "The Gilded Dove was in San Marco Square."
      }
    },
    {
      "id": "c5",
      "text": "The Harlequin was not carrying the Poisoned Goblet.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "harlequin",
        "cat2": "categoryC",
        "item2": "goblet",
        "state": "CROSS",
        "reason": "The Harlequin did not hold the Goblet."
      }
    }
  ],
  "solution": {
    "doctor": {
      "categoryB": "rialto",
      "categoryC": "goblet"
    },
    "doge": {
      "categoryB": "ducale",
      "categoryC": "cipher"
    },
    "dove": {
      "categoryB": "sanmarco",
      "categoryC": "ducats"
    },
    "harlequin": {
      "categoryB": "canal",
      "categoryC": "stiletto_v"
    }
  }
};
