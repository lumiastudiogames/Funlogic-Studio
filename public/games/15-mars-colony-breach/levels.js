window.CURRENT_LEVEL = {
  "id": 15,
  "title": "Mars Colony: Dome 7 Breach",
  "subtitle": "In the red dust of Acidalia Planitia, Dome 7 suffered sudden pressure loss. Colonists must pinpoint ...",
  "difficulty": "Normal (4x4)",
  "icon": "🔴",
  "synopsis": "Red Martian sandstorms howl against the reinforced pressurized glass as emergency oxygen vents activate.",
  "description": "In the red dust of Acidalia Planitia, Dome 7 suffered sudden pressure loss. Colonists must pinpoint who handled which maintenance gear and why.",
  "categories": {
    "categoryA": {
      "name": "Colonists",
      "items": [
        {
          "id": "sarah",
          "name": "Geologist Sarah"
        },
        {
          "id": "kane",
          "name": "Cmdr. Kane"
        },
        {
          "id": "malik",
          "name": "Terraformer Malik"
        },
        {
          "id": "chen",
          "name": "Roboticist Chen"
        }
      ]
    },
    "categoryB": {
      "name": "Biodomes",
      "items": [
        {
          "id": "hydrodome",
          "name": "Hydro-Dome Alpha"
        },
        {
          "id": "core",
          "name": "Terraforming Core"
        },
        {
          "id": "garage",
          "name": "Rover Garage"
        },
        {
          "id": "commarray",
          "name": "Comm Array"
        }
      ]
    },
    "categoryC": {
      "name": "Specialist Gear",
      "items": [
        {
          "id": "cutter",
          "name": "Plasma Torch"
        },
        {
          "id": "override",
          "name": "Airlock Bypass"
        },
        {
          "id": "gauge",
          "name": "Digital Pressure Gauge"
        },
        {
          "id": "spectro",
          "name": "Laser Spectrometer"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Cmdr. Kane rushed to the Rover Garage armed with the Plasma Torch.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "kane",
        "cat2": "categoryB",
        "item2": "garage",
        "state": "CHECK",
        "reason": "Cmdr. Kane was in Rover Garage."
      }
    },
    {
      "id": "c2",
      "text": "The colonist at the Comm Array was utilizing the Laser Spectrometer.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "commarray",
        "cat2": "categoryC",
        "item2": "spectro",
        "state": "CHECK",
        "reason": "Comm Array matches Laser Spectrometer."
      }
    },
    {
      "id": "c3",
      "text": "Terraformer Malik checked the Terraforming Core with the Digital Pressure Gauge.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "malik",
        "cat2": "categoryB",
        "item2": "core",
        "state": "CHECK",
        "reason": "Malik was at Terraforming Core."
      }
    },
    {
      "id": "c4",
      "text": "Roboticist Chen did not work in Hydro-Dome Alpha.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "chen",
        "cat2": "categoryB",
        "item2": "hydrodome",
        "state": "CROSS",
        "reason": "Chen was not in Hydro-Dome Alpha."
      }
    }
  ],
  "solution": {
    "kane": {
      "categoryB": "garage",
      "categoryC": "cutter"
    },
    "malik": {
      "categoryB": "core",
      "categoryC": "gauge"
    },
    "chen": {
      "categoryB": "commarray",
      "categoryC": "spectro"
    },
    "sarah": {
      "categoryB": "hydrodome",
      "categoryC": "override"
    }
  }
};
