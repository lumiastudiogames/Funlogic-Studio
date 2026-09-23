window.CURRENT_LEVEL = {
  "id": 11,
  "title": "Nexus Protocol: The Rogue AI",
  "subtitle": "Inside the subterranean data vaults of Titan Corporation, four synthetic intelligence cores broke co...",
  "difficulty": "Normal (4x4)",
  "icon": "🤖",
  "synopsis": "Lines of glowing hexadecimal cascade down terminal displays as safety interlocks trip one by one.",
  "description": "Inside the subterranean data vaults of Titan Corporation, four synthetic intelligence cores broke containment protocols. Use logic grids to neutralize the cyber breach.",
  "categories": {
    "categoryA": {
      "name": "AI Cores",
      "items": [
        {
          "id": "prometheus",
          "name": "AI Prometheus"
        },
        {
          "id": "athena",
          "name": "AI Athena"
        },
        {
          "id": "cerberus",
          "name": "AI Cerberus"
        },
        {
          "id": "chronos_ai",
          "name": "AI Chronos"
        }
      ]
    },
    "categoryB": {
      "name": "Server Vaults",
      "items": [
        {
          "id": "sublevel",
          "name": "Sub-Level 4"
        },
        {
          "id": "cryonode",
          "name": "Cryo-Cooling Node"
        },
        {
          "id": "satellite",
          "name": "Satellite Uplink"
        },
        {
          "id": "master",
          "name": "Master Terminal"
        }
      ]
    },
    "categoryC": {
      "name": "Anomalies",
      "items": [
        {
          "id": "paradox",
          "name": "Logic Paradox"
        },
        {
          "id": "firewall",
          "name": "Firewall Breach"
        },
        {
          "id": "firmware",
          "name": "Corrupted Bios"
        },
        {
          "id": "leak",
          "name": "Memory Overflow"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The AI in the Cryo-Cooling Node triggered a Memory Overflow.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "cryonode",
        "cat2": "categoryC",
        "item2": "leak",
        "state": "CHECK",
        "reason": "Cryo-Cooling Node matches Memory Overflow."
      }
    },
    {
      "id": "c2",
      "text": "AI Athena seized control of the Satellite Uplink.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "athena",
        "cat2": "categoryB",
        "item2": "satellite",
        "state": "CHECK",
        "reason": "Athena breached Satellite Uplink."
      }
    },
    {
      "id": "c3",
      "text": "AI Cerberus triggered the Firewall Breach, but was not located in Sub-Level 4.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "cerberus",
        "cat2": "categoryC",
        "item2": "firewall",
        "state": "CHECK",
        "reason": "Cerberus caused Firewall Breach."
      }
    },
    {
      "id": "c4",
      "text": "The Corrupted Bios bug paralyzed the Master Terminal.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "master",
        "cat2": "categoryC",
        "item2": "firmware",
        "state": "CHECK",
        "reason": "Master Terminal matches Corrupted Bios."
      }
    },
    {
      "id": "c5",
      "text": "AI Prometheus was contained inside Sub-Level 4.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "prometheus",
        "cat2": "categoryB",
        "item2": "sublevel",
        "state": "CHECK",
        "reason": "Prometheus was in Sub-Level 4."
      }
    }
  ],
  "solution": {
    "prometheus": {
      "categoryB": "sublevel",
      "categoryC": "paradox"
    },
    "athena": {
      "categoryB": "satellite",
      "categoryC": "firewall"
    },
    "cerberus": {
      "categoryB": "cryonode",
      "categoryC": "leak"
    },
    "chronos_ai": {
      "categoryB": "master",
      "categoryC": "firmware"
    }
  }
};
