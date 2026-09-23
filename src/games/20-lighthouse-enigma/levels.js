window.CURRENT_LEVEL = {
  "id": 20,
  "title": "The Flannan Isle Lighthouse Enigma",
  "subtitle": "On a remote gale-swept Hebridean rock, the lighthouse light went dark. The relief crew arrived to fi...",
  "difficulty": "Normal (4x4)",
  "icon": "🗼",
  "synopsis": "Towering North Atlantic waves crash against sheer sea cliffs as the massive brass lighthouse Fresnel lens sits frozen in silence.",
  "description": "On a remote gale-swept Hebridean rock, the lighthouse light went dark. The relief crew arrived to find an untouched dinner, a stopped clock, and no living soul.",
  "categories": {
    "categoryA": {
      "name": "Keepers",
      "items": [
        {
          "id": "ducat",
          "name": "Principal Ducat"
        },
        {
          "id": "marshall",
          "name": "Assistant Marshall"
        },
        {
          "id": "macarthur",
          "name": "Second MacArthur"
        },
        {
          "id": "moore",
          "name": "Relief Pilot Moore"
        }
      ]
    },
    "categoryB": {
      "name": "Lighthouse Quarters",
      "items": [
        {
          "id": "lantern",
          "name": "Lantern Gallery"
        },
        {
          "id": "tower_room",
          "name": "Storm Watch Tower"
        },
        {
          "id": "kitchen",
          "name": "Living Kitchen"
        },
        {
          "id": "pier",
          "name": "West Landing Pier"
        }
      ]
    },
    "categoryC": {
      "name": "Log Artifacts",
      "items": [
        {
          "id": "stoppedclock",
          "name": "Stopped Brass Clock"
        },
        {
          "id": "oilskin",
          "name": "Discarded Oilskin Coat"
        },
        {
          "id": "dinner",
          "name": "Untouched Mutton Stew"
        },
        {
          "id": "diary",
          "name": "Waterlogged Logbook"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The Stopped Brass Clock was hanging on the wall of the Living Kitchen.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "kitchen",
        "cat2": "categoryC",
        "item2": "stoppedclock",
        "state": "CHECK",
        "reason": "Living Kitchen matches Stopped Clock."
      }
    },
    {
      "id": "c2",
      "text": "Principal Ducat was stationed in the Lantern Gallery with the Discarded Oilskin Coat.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "ducat",
        "cat2": "categoryB",
        "item2": "lantern",
        "state": "CHECK",
        "reason": "Ducat was in the Lantern Gallery."
      }
    },
    {
      "id": "c3",
      "text": "Relief Pilot Moore arrived at the West Landing Pier clutching the Waterlogged Logbook.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "moore",
        "cat2": "categoryB",
        "item2": "pier",
        "state": "CHECK",
        "reason": "Moore landed at West Pier."
      }
    },
    {
      "id": "c4",
      "text": "Assistant Marshall was inside the Living Kitchen.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "marshall",
        "cat2": "categoryB",
        "item2": "kitchen",
        "state": "CHECK",
        "reason": "Marshall was in the Living Kitchen."
      }
    },
    {
      "id": "c5",
      "text": "Second MacArthur was stationed in the Storm Watch Tower where the Untouched Mutton Stew remained.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "macarthur",
        "cat2": "categoryB",
        "item2": "tower_room",
        "state": "CHECK",
        "reason": "MacArthur was in Storm Watch Tower."
      }
    }
  ],
  "solution": {
    "ducat": {
      "categoryB": "lantern",
      "categoryC": "oilskin"
    },
    "marshall": {
      "categoryB": "kitchen",
      "categoryC": "stoppedclock"
    },
    "macarthur": {
      "categoryB": "tower_room",
      "categoryC": "dinner"
    },
    "moore": {
      "categoryB": "pier",
      "categoryC": "diary"
    }
  }
};
