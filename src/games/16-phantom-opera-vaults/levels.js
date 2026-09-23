window.CURRENT_LEVEL = {
  "id": 16,
  "title": "The Phantom of the Paris Opera",
  "subtitle": "Paris, 1890. Grand chandeliers rattle and music echoes from the underground subterranean lake beneat...",
  "difficulty": "Normal (4x4)",
  "icon": "🎻",
  "synopsis": "Gilded velvet curtains open to thunderous applause, but Box Five remains mysteriously reserved and empty.",
  "description": "Paris, 1890. Grand chandeliers rattle and music echoes from the underground subterranean lake beneath the Opera house. Follow the theatrical clues to locate the phantom's lair.",
  "categories": {
    "categoryA": {
      "name": "Theatrical Troupe",
      "items": [
        {
          "id": "phantom",
          "name": "The Phantom"
        },
        {
          "id": "christine",
          "name": "Diva Christine"
        },
        {
          "id": "raoul",
          "name": "Viscount Raoul"
        },
        {
          "id": "joseph",
          "name": "Stage Master Joseph"
        }
      ]
    },
    "categoryB": {
      "name": "Opera Chambers",
      "items": [
        {
          "id": "box5",
          "name": "Private Box 5"
        },
        {
          "id": "lake",
          "name": "Underground Lake"
        },
        {
          "id": "dressing",
          "name": "Dressing Room 3"
        },
        {
          "id": "rafters",
          "name": "The Stage Rafters"
        }
      ]
    },
    "categoryC": {
      "name": "Theatrical Props",
      "items": [
        {
          "id": "skullmask",
          "name": "Porcelain Skull Mask"
        },
        {
          "id": "severedrope",
          "name": "Cut Chandelier Rope"
        },
        {
          "id": "cloak",
          "name": "Black Velvet Cloak"
        },
        {
          "id": "score",
          "name": "Handwritten Score"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The Phantom inhabited the Underground Lake with the Porcelain Skull Mask.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "phantom",
        "cat2": "categoryB",
        "item2": "lake",
        "state": "CHECK",
        "reason": "The Phantom was at the Underground Lake."
      }
    },
    {
      "id": "c2",
      "text": "Stage Master Joseph was stationed up in the Stage Rafters where the Cut Chandelier Rope was found.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "joseph",
        "cat2": "categoryB",
        "item2": "rafters",
        "state": "CHECK",
        "reason": "Joseph was up in the Stage Rafters."
      }
    },
    {
      "id": "c3",
      "text": "Diva Christine warmed up inside Dressing Room 3 with the Handwritten Score.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "christine",
        "cat2": "categoryB",
        "item2": "dressing",
        "state": "CHECK",
        "reason": "Christine was in Dressing Room 3."
      }
    },
    {
      "id": "c4",
      "text": "Viscount Raoul reserved Private Box 5 to protect the diva.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "raoul",
        "cat2": "categoryB",
        "item2": "box5",
        "state": "CHECK",
        "reason": "Raoul was in Private Box 5."
      }
    }
  ],
  "solution": {
    "phantom": {
      "categoryB": "lake",
      "categoryC": "skullmask"
    },
    "joseph": {
      "categoryB": "rafters",
      "categoryC": "severedrope"
    },
    "christine": {
      "categoryB": "dressing",
      "categoryC": "score"
    },
    "raoul": {
      "categoryB": "box5",
      "categoryC": "cloak"
    }
  }
};
