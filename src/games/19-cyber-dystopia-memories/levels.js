window.CURRENT_LEVEL = {
  "id": 19,
  "title": "Cyber Dystopia: Stolen Memories",
  "subtitle": "In an electric rain-swept metropolis, personal memories are downloaded and traded as commodities. De...",
  "difficulty": "Normal (4x4)",
  "icon": "🧠",
  "synopsis": "Holographic advertisements flicker over dark alleys where cyber-surgeons splice neural cables.",
  "description": "In an electric rain-swept metropolis, personal memories are downloaded and traded as commodities. Deduce which hacker hoards which illegal encrypted memory shard.",
  "categories": {
    "categoryA": {
      "name": "Net Hackers",
      "items": [
        {
          "id": "razor",
          "name": "Razor Zero"
        },
        {
          "id": "syn",
          "name": "Neon Syn"
        },
        {
          "id": "chrome",
          "name": "Chrome Echo"
        },
        {
          "id": "valkyrie",
          "name": "Pulse Valkyrie"
        }
      ]
    },
    "categoryB": {
      "name": "Safehouses",
      "items": [
        {
          "id": "darknet",
          "name": "Darknet Alley"
        },
        {
          "id": "motel",
          "name": "Neon Motel 07"
        },
        {
          "id": "penthouse",
          "name": "Skyline Penthouse"
        },
        {
          "id": "drainage",
          "name": "Sub-Grid Drainage"
        }
      ]
    },
    "categoryC": {
      "name": "Memory Shards",
      "items": [
        {
          "id": "blackmail",
          "name": "Corporate Blackmail"
        },
        {
          "id": "military_ai",
          "name": "Military AI Shard"
        },
        {
          "id": "identity",
          "name": "Lost Identity Memory"
        },
        {
          "id": "crypto",
          "name": "Syndicate Crypto Keys"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Razor Zero took refuge in Darknet Alley with the Military AI Shard.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "razor",
        "cat2": "categoryB",
        "item2": "darknet",
        "state": "CHECK",
        "reason": "Razor Zero was in Darknet Alley."
      }
    },
    {
      "id": "c2",
      "text": "The hacker in the Skyline Penthouse possessed the Corporate Blackmail memory.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "penthouse",
        "cat2": "categoryC",
        "item2": "blackmail",
        "state": "CHECK",
        "reason": "Skyline Penthouse holds Corporate Blackmail."
      }
    },
    {
      "id": "c3",
      "text": "Neon Syn was tracked to Neon Motel 07, but did not have the Syndicate Crypto Keys.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "syn",
        "cat2": "categoryB",
        "item2": "motel",
        "state": "CHECK",
        "reason": "Neon Syn was at Neon Motel 07."
      }
    },
    {
      "id": "c4",
      "text": "Pulse Valkyrie stayed in the Skyline Penthouse.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "valkyrie",
        "cat2": "categoryB",
        "item2": "penthouse",
        "state": "CHECK",
        "reason": "Pulse Valkyrie was in Skyline Penthouse."
      }
    },
    {
      "id": "c5",
      "text": "The Syndicate Crypto Keys were hidden deep in the Sub-Grid Drainage.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "drainage",
        "cat2": "categoryC",
        "item2": "crypto",
        "state": "CHECK",
        "reason": "Sub-Grid Drainage matches Crypto Keys."
      }
    }
  ],
  "solution": {
    "razor": {
      "categoryB": "darknet",
      "categoryC": "military_ai"
    },
    "valkyrie": {
      "categoryB": "penthouse",
      "categoryC": "blackmail"
    },
    "syn": {
      "categoryB": "motel",
      "categoryC": "identity"
    },
    "chrome": {
      "categoryB": "drainage",
      "categoryC": "crypto"
    }
  }
};
