window.CURRENT_LEVEL = {
  "id": 9,
  "title": "Station Alpha: Orbital Sabotage",
  "subtitle": "High above Earth in geostationary orbit, orbital telemetry drops off. A saboteur has compromised sta...",
  "difficulty": "Normal (4x4)",
  "icon": "🛰️",
  "synopsis": "A silent flash illuminates the solar panels of Station Alpha as primary power drops to 40 percent.",
  "description": "High above Earth in geostationary orbit, orbital telemetry drops off. A saboteur has compromised station subsystems before the supply shuttle arrives.",
  "categories": {
    "categoryA": {
      "name": "Specialists",
      "items": [
        {
          "id": "ryker",
          "name": "Pilot Ryker"
        },
        {
          "id": "lin",
          "name": "Astrobiologist Lin"
        },
        {
          "id": "novak",
          "name": "Cyber-Tech Novak"
        },
        {
          "id": "diaz",
          "name": "Chief Diaz"
        }
      ]
    },
    "categoryB": {
      "name": "Station Wings",
      "items": [
        {
          "id": "hab",
          "name": "Habitation Ring"
        },
        {
          "id": "comm",
          "name": "Communications Hub"
        },
        {
          "id": "solar",
          "name": "Solar Array"
        },
        {
          "id": "dock",
          "name": "Docking Bay"
        }
      ]
    },
    "categoryC": {
      "name": "Subsystems",
      "items": [
        {
          "id": "o2",
          "name": "Oxygen Scrubber"
        },
        {
          "id": "relay",
          "name": "Solar Relay"
        },
        {
          "id": "nav",
          "name": "Guidance Nav"
        },
        {
          "id": "clamps",
          "name": "Docking Clamps"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Astrobiologist Lin was stationed in the Habitation Ring where the Oxygen Scrubber was choked.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "lin",
        "cat2": "categoryB",
        "item2": "hab",
        "state": "CHECK",
        "reason": "Lin was at Habitation Ring."
      }
    },
    {
      "id": "c2",
      "text": "The subsystem failure in the Solar Array was the Solar Relay.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "solar",
        "cat2": "categoryC",
        "item2": "relay",
        "state": "CHECK",
        "reason": "Solar Array matches Solar Relay."
      }
    },
    {
      "id": "c3",
      "text": "Cyber-Tech Novak inspected the Communications Hub, which was suffering Guidance Nav errors.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "novak",
        "cat2": "categoryB",
        "item2": "comm",
        "state": "CHECK",
        "reason": "Novak was at Comms Hub."
      }
    },
    {
      "id": "c4",
      "text": "Chief Diaz was inspecting the Solar Array during the power spike.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "diaz",
        "cat2": "categoryB",
        "item2": "solar",
        "state": "CHECK",
        "reason": "Diaz was at Solar Array."
      }
    },
    {
      "id": "c5",
      "text": "Pilot Ryker was not responsible for the Oxygen Scrubber.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "ryker",
        "cat2": "categoryC",
        "item2": "o2",
        "state": "CROSS",
        "reason": "Ryker did not touch Oxygen Scrubber."
      }
    }
  ],
  "solution": {
    "lin": {
      "categoryB": "hab",
      "categoryC": "o2"
    },
    "diaz": {
      "categoryB": "solar",
      "categoryC": "relay"
    },
    "novak": {
      "categoryB": "comm",
      "categoryC": "nav"
    },
    "ryker": {
      "categoryB": "dock",
      "categoryC": "clamps"
    }
  }
};
