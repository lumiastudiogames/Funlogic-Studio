window.CURRENT_LEVEL = {
  "id": 5,
  "title": "Derelict Chimera: Alien Protocol",
  "subtitle": "Drifting in the Orion nebula, the research ship Chimera went dark. Board the silent vessel, review l...",
  "difficulty": "Normal (4x4)",
  "icon": "🚀",
  "synopsis": "Emergency red warning lights pulse rhythmically along the bulkhead walls of the dead starship.",
  "description": "Drifting in the Orion nebula, the research ship Chimera went dark. Board the silent vessel, review log terminals, and deduce who quarantined which module.",
  "categories": {
    "categoryA": {
      "name": "Officers",
      "items": [
        {
          "id": "sterling",
          "name": "Capt. Sterling"
        },
        {
          "id": "vance",
          "name": "Cmdr. Vance"
        },
        {
          "id": "zhang",
          "name": "Dr. Zhang"
        },
        {
          "id": "ortiz",
          "name": "Engineer Ortiz"
        }
      ]
    },
    "categoryB": {
      "name": "Modules",
      "items": [
        {
          "id": "hydroponics",
          "name": "Hydroponics Bay"
        },
        {
          "id": "reactor",
          "name": "Reactor Core"
        },
        {
          "id": "medlab",
          "name": "Medical Lab"
        },
        {
          "id": "cryo",
          "name": "Cryo Chamber"
        }
      ]
    },
    "categoryC": {
      "name": "Anomalies",
      "items": [
        {
          "id": "slime",
          "name": "Bio-Slime"
        },
        {
          "id": "plasma",
          "name": "Plasma Leak"
        },
        {
          "id": "cable",
          "name": "Severed Cable"
        },
        {
          "id": "breach",
          "name": "Cryo Breach"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Engineer Ortiz was stationed at the Reactor Core where the Plasma Leak erupted.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "ortiz",
        "cat2": "categoryB",
        "item2": "reactor",
        "state": "CHECK",
        "reason": "Ortiz was at Reactor Core."
      }
    },
    {
      "id": "c2",
      "text": "Dr. Zhang documented the Bio-Slime anomaly in the Medical Lab.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "zhang",
        "cat2": "categoryC",
        "item2": "slime",
        "state": "CHECK",
        "reason": "Zhang found Bio-Slime."
      }
    },
    {
      "id": "c3",
      "text": "Capt. Sterling was not at the Cryo Chamber and did not encounter the Severed Cable.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "sterling",
        "cat2": "categoryB",
        "item2": "cryo",
        "state": "CROSS",
        "reason": "Sterling was not at Cryo Chamber."
      }
    },
    {
      "id": "c4",
      "text": "The Hydroponics Bay was crippled by the Severed Cable.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "hydroponics",
        "cat2": "categoryC",
        "item2": "cable",
        "state": "CHECK",
        "reason": "Hydroponics matches Severed Cable."
      }
    },
    {
      "id": "c5",
      "text": "Cmdr. Vance locked down the Cryo Chamber.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "vance",
        "cat2": "categoryB",
        "item2": "cryo",
        "state": "CHECK",
        "reason": "Vance locked the Cryo Chamber."
      }
    }
  ],
  "solution": {
    "ortiz": {
      "categoryB": "reactor",
      "categoryC": "plasma"
    },
    "zhang": {
      "categoryB": "medlab",
      "categoryC": "slime"
    },
    "vance": {
      "categoryB": "cryo",
      "categoryC": "breach"
    },
    "sterling": {
      "categoryB": "hydroponics",
      "categoryC": "cable"
    }
  }
};
