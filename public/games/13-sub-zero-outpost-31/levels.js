window.CURRENT_LEVEL = {
  "id": 13,
  "title": "Sub-Zero: Outpost 31 Enigma",
  "subtitle": "Cut off by a catastrophic polar blizzard at -60 degrees, four polar researchers uncover an ancient s...",
  "difficulty": "Normal (4x4)",
  "icon": "❄️",
  "synopsis": "Howling polar winds batter the corrugated steel walls of Outpost 31 as the radio antenna snaps in two.",
  "description": "Cut off by a catastrophic polar blizzard at -60 degrees, four polar researchers uncover an ancient specimen frozen deep beneath the ice sheet.",
  "categories": {
    "categoryA": {
      "name": "Researchers",
      "items": [
        {
          "id": "macready",
          "name": "Dr. MacReady"
        },
        {
          "id": "blair",
          "name": "Biologist Blair"
        },
        {
          "id": "childs",
          "name": "Operator Childs"
        },
        {
          "id": "norris",
          "name": "Dr. Norris"
        }
      ]
    },
    "categoryB": {
      "name": "Facilities",
      "items": [
        {
          "id": "bunker",
          "name": "Bunker Sub-Level"
        },
        {
          "id": "weather",
          "name": "Weather Station"
        },
        {
          "id": "kennels",
          "name": "Dog Kennels"
        },
        {
          "id": "generator",
          "name": "Generator Shed"
        }
      ]
    },
    "categoryC": {
      "name": "Discoveries",
      "items": [
        {
          "id": "tissue",
          "name": "Thawed Tissue"
        },
        {
          "id": "icecore",
          "name": "Ancient Ice Core"
        },
        {
          "id": "thermo",
          "name": "Sabotaged Meter"
        },
        {
          "id": "flare",
          "name": "Burnt Distress Flare"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Biologist Blair discovered the Thawed Tissue in the Bunker Sub-Level.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "blair",
        "cat2": "categoryB",
        "item2": "bunker",
        "state": "CHECK",
        "reason": "Blair was at Bunker Sub-Level."
      }
    },
    {
      "id": "c2",
      "text": "The Ancient Ice Core was analyzed inside the Weather Station.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "weather",
        "cat2": "categoryC",
        "item2": "icecore",
        "state": "CHECK",
        "reason": "Weather Station holds Ancient Ice Core."
      }
    },
    {
      "id": "c3",
      "text": "Dr. MacReady was stationed at the Generator Shed keeping emergency heat alive.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "macready",
        "cat2": "categoryB",
        "item2": "generator",
        "state": "CHECK",
        "reason": "MacReady was at Generator Shed."
      }
    },
    {
      "id": "c4",
      "text": "Operator Childs did not visit the Weather Station nor did he find the Sabotaged Meter.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "childs",
        "cat2": "categoryB",
        "item2": "weather",
        "state": "CROSS",
        "reason": "Childs was not at Weather Station."
      }
    },
    {
      "id": "c5",
      "text": "A Burnt Distress Flare was found outside by the Dog Kennels.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "kennels",
        "cat2": "categoryC",
        "item2": "flare",
        "state": "CHECK",
        "reason": "Dog Kennels matches Burnt Distress Flare."
      }
    }
  ],
  "solution": {
    "blair": {
      "categoryB": "bunker",
      "categoryC": "tissue"
    },
    "norris": {
      "categoryB": "weather",
      "categoryC": "icecore"
    },
    "childs": {
      "categoryB": "kennels",
      "categoryC": "flare"
    },
    "macready": {
      "categoryB": "generator",
      "categoryC": "thermo"
    }
  }
};
