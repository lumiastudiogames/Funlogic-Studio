window.CURRENT_LEVEL = {
  "id": 7,
  "title": "Chronos Station: Time Paradox",
  "subtitle": "When history begins rewriting itself in the Chronos temporal archives, four time agents are dispatch...",
  "difficulty": "Normal (4x4)",
  "icon": "⏳",
  "synopsis": "Chronometers spin backwards as reality fractures. Four temporal ruptures must be sealed simultaneously.",
  "description": "When history begins rewriting itself in the Chronos temporal archives, four time agents are dispatched across millennia to retrieve displaced artifacts.",
  "categories": {
    "categoryA": {
      "name": "Temporal Agents",
      "items": [
        {
          "id": "delta",
          "name": "Agent Delta"
        },
        {
          "id": "vera",
          "name": "Chrono Vera"
        },
        {
          "id": "thorne",
          "name": "Archon Thorne"
        },
        {
          "id": "kai",
          "name": "Pilot Kai"
        }
      ]
    },
    "categoryB": {
      "name": "Century Eras",
      "items": [
        {
          "id": "year1890",
          "name": "Year 1890"
        },
        {
          "id": "year1945",
          "name": "Year 1945"
        },
        {
          "id": "year2084",
          "name": "Year 2084"
        },
        {
          "id": "year2412",
          "name": "Year 2412"
        }
      ]
    },
    "categoryC": {
      "name": "Artifacts",
      "items": [
        {
          "id": "tachyon",
          "name": "Tachyon Emitter"
        },
        {
          "id": "chronometer",
          "name": "Brass Chronometer"
        },
        {
          "id": "qcore",
          "name": "Quantum Core"
        },
        {
          "id": "photo",
          "name": "Faded Photograph"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Agent Delta jumped to Year 1890 and recovered the Brass Chronometer.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "delta",
        "cat2": "categoryB",
        "item2": "year1890",
        "state": "CHECK",
        "reason": "Delta jumped to 1890."
      }
    },
    {
      "id": "c2",
      "text": "The operative who retrieved the Quantum Core traveled to the farthest future: Year 2412.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "year2412",
        "cat2": "categoryC",
        "item2": "qcore",
        "state": "CHECK",
        "reason": "Year 2412 holds Quantum Core."
      }
    },
    {
      "id": "c3",
      "text": "Chrono Vera visited Year 1945 to track down the Faded Photograph.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "vera",
        "cat2": "categoryB",
        "item2": "year1945",
        "state": "CHECK",
        "reason": "Vera jumped to 1945."
      }
    },
    {
      "id": "c4",
      "text": "Archon Thorne was not sent to Year 2084.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "thorne",
        "cat2": "categoryB",
        "item2": "year2084",
        "state": "CROSS",
        "reason": "Thorne was not in 2084."
      }
    }
  ],
  "solution": {
    "delta": {
      "categoryB": "year1890",
      "categoryC": "chronometer"
    },
    "vera": {
      "categoryB": "year1945",
      "categoryC": "photo"
    },
    "thorne": {
      "categoryB": "year2412",
      "categoryC": "qcore"
    },
    "kai": {
      "categoryB": "year2084",
      "categoryC": "tachyon"
    }
  }
};
