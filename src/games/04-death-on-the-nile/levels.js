window.CURRENT_LEVEL = {
  "id": 4,
  "title": "Death on the Nile Steamer",
  "subtitle": "A grand paddle steamer sails past the monuments of Luxor. When an heiress vanishes, Hercule Renard g...",
  "difficulty": "Normal (4x4)",
  "icon": "🚢",
  "synopsis": "As twilight falls over Karnak temple, a gunshot pierces the desert silence aboard the S.S. Karnak.",
  "description": "A grand paddle steamer sails past the monuments of Luxor. When an heiress vanishes, Hercule Renard gathers all suspects in the salon to expose the deceit using precise grid deduction.",
  "categories": {
    "categoryA": {
      "name": "Passengers",
      "items": [
        {
          "id": "simon",
          "name": "Simon Doyle"
        },
        {
          "id": "linnet",
          "name": "Linnet Ridgeway"
        },
        {
          "id": "jacqueline",
          "name": "Jacqueline Belle"
        },
        {
          "id": "renard",
          "name": "Hercule Renard"
        }
      ]
    },
    "categoryB": {
      "name": "Decks",
      "items": [
        {
          "id": "promenade",
          "name": "Promenade Deck"
        },
        {
          "id": "salon",
          "name": "Salon Stateroom"
        },
        {
          "id": "sundeck",
          "name": "Upper Sun Deck"
        },
        {
          "id": "boiler",
          "name": "Boiler Room"
        }
      ]
    },
    "categoryC": {
      "name": "Heirlooms",
      "items": [
        {
          "id": "pearls",
          "name": "Pearl Necklace"
        },
        {
          "id": "will",
          "name": "Forged Will"
        },
        {
          "id": "stiletto",
          "name": "Velvet Stiletto"
        },
        {
          "id": "locket",
          "name": "Gold Locket"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Linnet Ridgeway was staying in the Salon Stateroom with her Pearl Necklace.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "linnet",
        "cat2": "categoryB",
        "item2": "salon",
        "state": "CHECK",
        "reason": "Linnet was in the Salon Stateroom."
      }
    },
    {
      "id": "c2",
      "text": "The person on the Upper Sun Deck was carrying the Gold Locket.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "sundeck",
        "cat2": "categoryC",
        "item2": "locket",
        "state": "CHECK",
        "reason": "Upper Sun Deck matches Gold Locket."
      }
    },
    {
      "id": "c3",
      "text": "Jacqueline Belle was seen near the Boiler Room, but she did not have the Forged Will.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "jacqueline",
        "cat2": "categoryB",
        "item2": "boiler",
        "state": "CHECK",
        "reason": "Jacqueline Belle was at the Boiler Room."
      }
    },
    {
      "id": "c4",
      "text": "Hercule Renard spent the night observing the stars from the Upper Sun Deck.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "renard",
        "cat2": "categoryB",
        "item2": "sundeck",
        "state": "CHECK",
        "reason": "Renard was on the Upper Sun Deck."
      }
    },
    {
      "id": "c5",
      "text": "Simon Doyle was discovered with the Forged Will.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "simon",
        "cat2": "categoryC",
        "item2": "will",
        "state": "CHECK",
        "reason": "Simon Doyle carried the Forged Will."
      }
    }
  ],
  "solution": {
    "linnet": {
      "categoryB": "salon",
      "categoryC": "pearls"
    },
    "renard": {
      "categoryB": "sundeck",
      "categoryC": "locket"
    },
    "jacqueline": {
      "categoryB": "boiler",
      "categoryC": "stiletto"
    },
    "simon": {
      "categoryB": "promenade",
      "categoryC": "will"
    }
  }
};
