window.CURRENT_LEVEL = {
  "id": 18,
  "title": "The Fog Over Whitechapel",
  "subtitle": "London, autumn 1888. Yellow sulfurous peasouper fog blankets the gaslit streets of East London. Matc...",
  "difficulty": "Normal (4x4)",
  "icon": "🪓",
  "synopsis": "Gas lanterns sputter in the damp London chill as distant footsteps echo across wet cobblestones.",
  "description": "London, autumn 1888. Yellow sulfurous peasouper fog blankets the gaslit streets of East London. Match the inspectors to their patrol sectors and forensic evidence.",
  "categories": {
    "categoryA": {
      "name": "Detectives",
      "items": [
        {
          "id": "reid",
          "name": "Inspector Reid"
        },
        {
          "id": "drake",
          "name": "Sergeant Drake"
        },
        {
          "id": "baxter",
          "name": "Coroner Baxter"
        },
        {
          "id": "abberline",
          "name": "Detective Abberline"
        }
      ]
    },
    "categoryB": {
      "name": "Cobblestone Alleys",
      "items": [
        {
          "id": "mews",
          "name": "Cobblestone Mews"
        },
        {
          "id": "court",
          "name": "Millers Court"
        },
        {
          "id": "tavern",
          "name": "Ten Bells Tavern"
        },
        {
          "id": "docks",
          "name": "Thames Docks"
        }
      ]
    },
    "categoryC": {
      "name": "Forensic Clues",
      "items": [
        {
          "id": "letter",
          "name": "Red Ink Letter"
        },
        {
          "id": "apron",
          "name": "Leather Apron"
        },
        {
          "id": "pocketwatch",
          "name": "Broken Pocket Watch"
        },
        {
          "id": "scalpel",
          "name": "Medical Scalpel"
        }
      ]
    }
  },
  "clues": [
    {
      "id": "c1",
      "text": "Inspector Reid discovered the Red Ink Letter inside Millers Court.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "reid",
        "cat2": "categoryB",
        "item2": "court",
        "state": "CHECK",
        "reason": "Inspector Reid was at Millers Court."
      }
    },
    {
      "id": "c2",
      "text": "The Medical Scalpel was found abandoned at the Thames Docks.",
      "hintTarget": {
        "cat1": "categoryB",
        "item1": "docks",
        "cat2": "categoryC",
        "item2": "scalpel",
        "state": "CHECK",
        "reason": "Thames Docks matches Medical Scalpel."
      }
    },
    {
      "id": "c3",
      "text": "Detective Abberline questioned informants at the Ten Bells Tavern.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "abberline",
        "cat2": "categoryB",
        "item2": "tavern",
        "state": "CHECK",
        "reason": "Abberline was at Ten Bells Tavern."
      }
    },
    {
      "id": "c4",
      "text": "Sergeant Drake patrolled the Cobblestone Mews where the Leather Apron was dropped.",
      "hintTarget": {
        "cat1": "categoryA",
        "item1": "drake",
        "cat2": "categoryB",
        "item2": "mews",
        "state": "CHECK",
        "reason": "Drake patrolled Cobblestone Mews."
      }
    }
  ],
  "solution": {
    "reid": {
      "categoryB": "court",
      "categoryC": "letter"
    },
    "drake": {
      "categoryB": "mews",
      "categoryC": "apron"
    },
    "abberline": {
      "categoryB": "tavern",
      "categoryC": "pocketwatch"
    },
    "baxter": {
      "categoryB": "docks",
      "categoryC": "scalpel"
    }
  }
};
