window.CURRENT_LEVEL = {
  "id": 3,
  "title": "Neon Syndicate: Memory Breach",
  "subtitle": "In Neo-Kyoto 2099, a high-value memory canister containing military cyberware blueprints was comprom...",
  "difficulty": "Normal (4x4)",
  "icon": "💾",
  "synopsis": "Alarms blaze across the neon skyline of Sector 7. Four top-tier hackers breached four corporate data vaults simultaneously.",
  "description": "In Neo-Kyoto 2099, a high-value memory canister containing military cyberware blueprints was compromised. Cross-reference netrunner handles, corporate subnets, and black-market cybernetic decks.",
  "categories": {
    "categoryA": {
      "name": "Netrunners",
      "items": [
        {
          "id": "cipher",
          "name": "Cipher Jax"
        },
        {
          "id": "vector",
          "name": "Vector Nyx"
        },
        {
          "id": "ghost",
          "name": "Ghost Vane"
        },
        {
          "id": "byte",
          "name": "Byte Raven"
        }
      ]
    },
    "categoryB": {
      "name": "Megacorps",
      "items": [
        {
          "id": "arasaka",
          "name": "Arasaka Tech"
        },
        {
          "id": "neosheng",
          "name": "Neo-Sheng Bio"
        },
        {
          "id": "chimera",
          "name": "Chimera Cyber"
        },
        {
          "id": "orbital",
          "name": "Orbital Dynamics"
        }
      ]
    },
    "categoryC": {
      "name": "Cyberware",
      "items": [
        {
          "id": "neural",
          "name": "Neural Jack v4"
        },
        {
          "id": "camo",
          "name": "Optical Camo"
        },
        {
          "id": "armor",
          "name": "Subdermal Armor"
        },
        {
          "id": "overclock",
          "name": "Overclock Deck"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "The netrunner equipped with the Overclock Deck targeted Arasaka Tech.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "arasaka",
        "cat2": "categoryC",
        "item2": "overclock",
        "state": "CHECK",
        "reason": "Arasaka Tech matches Overclock Deck."
      }
    },
    {
      "id": "c2",
      "text": "Vector Nyx infiltrated Chimera Cyber using Optical Camo.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "vector",
        "cat2": "categoryB",
        "item2": "chimera",
        "state": "CHECK",
        "reason": "Vector Nyx hit Chimera Cyber."
      }
    },
    {
      "id": "c3",
      "text": "Cipher Jax did not breach Arasaka Tech nor did he have Subdermal Armor.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "cipher",
        "cat2": "categoryB",
        "item2": "arasaka",
        "state": "CROSS",
        "reason": "Cipher Jax did not attack Arasaka."
      }
    },
    {
      "id": "c4",
      "text": "Byte Raven breached Orbital Dynamics.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "byte",
        "cat2": "categoryB",
        "item2": "orbital",
        "state": "CHECK",
        "reason": "Byte Raven targeted Orbital Dynamics."
      }
    },
    {
      "id": "c5",
      "text": "The hacker at Neo-Sheng Bio possessed the Neural Jack v4.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "neosheng",
        "cat2": "categoryC",
        "item2": "neural",
        "state": "CHECK",
        "reason": "Neo-Sheng matches Neural Jack v4."
      }
    },
    {
      "id": "c6",
      "text": "Ghost Vane was not armed with Optical Camo.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "ghost",
        "cat2": "categoryC",
        "item2": "camo",
        "state": "CROSS",
        "reason": "Ghost Vane did not possess Optical Camo."
      }
    }
  ],
  "solution": {
    "vector": {
      "categoryB": "chimera",
      "categoryC": "camo"
    },
    "ghost": {
      "categoryB": "arasaka",
      "categoryC": "overclock"
    },
    "cipher": {
      "categoryB": "neosheng",
      "categoryC": "neural"
    },
    "byte": {
      "categoryB": "orbital",
      "categoryC": "armor"
    }
  }
};
