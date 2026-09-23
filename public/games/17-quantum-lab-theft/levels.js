window.CURRENT_LEVEL = {
  "id": 17,
  "title": "Quantum Realm: The Vanished Formula",
  "subtitle": "At the Geneva particle facility, a revolutionary unified quantum field theorem was extracted from en...",
  "difficulty": "Normal (4x4)",
  "icon": "⚛️",
  "synopsis": "Superconducting magnets hum softly as blue Cherenkov radiation glows in the particle storage pools.",
  "description": "At the Geneva particle facility, a revolutionary unified quantum field theorem was extracted from encrypted cleanrooms. Use logic matrix deduction to trace the theft.",
  "categories": {
    "categoryA": {
      "name": "Physicists",
      "items": [
        {
          "id": "oppen",
          "name": "Dr. Oppen"
        },
        {
          "id": "curie",
          "name": "Dr. Curie-Tan"
        },
        {
          "id": "feynman",
          "name": "Dr. Feynman-Lee"
        },
        {
          "id": "bohr",
          "name": "Dr. Bohr-Kowalski"
        }
      ]
    },
    "categoryB": {
      "name": "Laboratories",
      "items": [
        {
          "id": "smasher",
          "name": "Particle Smasher"
        },
        {
          "id": "cleanroom",
          "name": "Clean Room 101"
        },
        {
          "id": "supercomp",
          "name": "Supercomputing Pod"
        },
        {
          "id": "cryolab",
          "name": "Cryo-Vacuum Chamber"
        }
      ]
    },
    "categoryC": {
      "name": "Breakthroughs",
      "items": [
        {
          "id": "entangle",
          "name": "Entanglement Drive"
        },
        {
          "id": "darkmatter",
          "name": "Dark Matter Filter"
        },
        {
          "id": "tachyon_drive",
          "name": "Tachyon Field"
        },
        {
          "id": "antimatter",
          "name": "Antimatter Battery"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Dr. Oppen ran experiments in the Particle Smasher on the Antimatter Battery.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "oppen",
        "cat2": "categoryB",
        "item2": "smasher",
        "state": "CHECK",
        "reason": "Dr. Oppen was at Particle Smasher."
      }
    },
    {
      "id": "c2",
      "text": "The Entanglement Drive was housed in Clean Room 101.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "cleanroom",
        "cat2": "categoryC",
        "item2": "entangle",
        "state": "CHECK",
        "reason": "Clean Room 101 holds Entanglement Drive."
      }
    },
    {
      "id": "c3",
      "text": "Dr. Curie-Tan did not work in Clean Room 101 nor in the Cryo-Vacuum Chamber.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "curie",
        "cat2": "categoryB",
        "item2": "cleanroom",
        "state": "CROSS",
        "reason": "Dr. Curie-Tan was not in Clean Room 101."
      }
    },
    {
      "id": "c4",
      "text": "The Dark Matter Filter was being calibrated in the Supercomputing Pod.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "supercomp",
        "cat2": "categoryC",
        "item2": "darkmatter",
        "state": "CHECK",
        "reason": "Supercomputing Pod matches Dark Matter Filter."
      }
    },
    {
      "id": "c5",
      "text": "Dr. Feynman-Lee was stationed in Clean Room 101.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "feynman",
        "cat2": "categoryB",
        "item2": "cleanroom",
        "state": "CHECK",
        "reason": "Dr. Feynman-Lee was in Clean Room 101."
      }
    }
  ],
  "solution": {
    "oppen": {
      "categoryB": "smasher",
      "categoryC": "antimatter"
    },
    "curie": {
      "categoryB": "supercomp",
      "categoryC": "darkmatter"
    },
    "feynman": {
      "categoryB": "cleanroom",
      "categoryC": "entangle"
    },
    "bohr": {
      "categoryB": "cryolab",
      "categoryC": "tachyon_drive"
    }
  }
};
