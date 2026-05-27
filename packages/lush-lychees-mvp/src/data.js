export const products = [
  {
    id: "one-kg",
    name: "1kg premium box",
    description: "Picked ripe for weekday delivery and farm-gate collection.",
    price: 18,
    weight: "1kg"
  },
  {
    id: "three-kg",
    name: "3kg family box",
    description: "A seasonal box for families, office tables, and summer weekends.",
    price: 48,
    weight: "3kg"
  },
  {
    id: "five-kg",
    name: "5kg share box",
    description: "Best for neighbours, cafes, preserving, or a big festive table.",
    price: 76,
    weight: "5kg"
  },
  {
    id: "gift",
    name: "Lychee gift box",
    description: "A premium presentation box with a handwritten farm note.",
    price: 32,
    weight: "1.5kg"
  }
];

export const deliveryRuns = [
  {
    id: "rockhampton-north",
    name: "Rockhampton North",
    date: "Thursday 12 December",
    cutOff: "Tuesday 6:00pm",
    fee: 8,
    capacity: 140,
    reserved: 82,
    orders: 37,
    suburbs: ["rockhampton", "park avenue", "berserker", "frenchville", "norman gardens", "4701"],
    packingTotals: {
      "1kg premium box": 28,
      "3kg family box": 31,
      "5kg share box": 14,
      "Lychee gift box": 9
    }
  },
  {
    id: "capricorn-coast",
    name: "Capricorn Coast",
    date: "Saturday 14 December",
    cutOff: "Thursday 6:00pm",
    fee: 12,
    capacity: 110,
    reserved: 69,
    orders: 29,
    suburbs: ["yeppoon", "emu park", "tanby", "zilzie", "lammermoor", "4703"],
    packingTotals: {
      "1kg premium box": 20,
      "3kg family box": 25,
      "5kg share box": 16,
      "Lychee gift box": 8
    }
  },
  {
    id: "gladstone-corridor",
    name: "Gladstone Corridor",
    date: "Wednesday 18 December",
    cutOff: "Monday 6:00pm",
    fee: 16,
    capacity: 90,
    reserved: 41,
    orders: 18,
    suburbs: ["gladstone", "calliope", "tannum sands", "benaraby", "boyne island", "4680"],
    packingTotals: {
      "1kg premium box": 12,
      "3kg family box": 17,
      "5kg share box": 8,
      "Lychee gift box": 4
    }
  }
];

export const orchardBlocks = [
  {
    id: "river-a",
    label: "River Block A",
    variety: "Kwai Mai Pink",
    rows: "Rows 1-12",
    ready: 72,
    note: "Colour is building evenly. Check the northern edge after the next warm day."
  },
  {
    id: "ridge-c",
    label: "Ridge Block C",
    variety: "Bengal",
    rows: "Rows 18-31",
    ready: 84,
    note: "Strong blush and clean skin. Suitable for a short pick before the Coast run."
  },
  {
    id: "house-e",
    label: "House Block E",
    variety: "Tai So",
    rows: "Rows 3-9",
    ready: 61,
    note: "Hold for size and sweetness. Recheck in two days."
  }
];

export const socialCampaigns = [
  {
    id: "delivery-launch",
    name: "Delivery run launch",
    channelFit: "Facebook feed + Instagram post",
    hook: "Open the next local delivery run and invite early orders.",
    callToAction: "Check your suburb and reserve a box before the cut-off."
  },
  {
    id: "harvest-update",
    name: "Harvest update",
    channelFit: "Instagram reel + Facebook story",
    hook: "Show what is ripening now and why boxes are released in batches.",
    callToAction: "Follow the season and watch for the next box release."
  },
  {
    id: "farm-gate-weekend",
    name: "Farm-gate weekend",
    channelFit: "Facebook event + Instagram story",
    hook: "Remind locals that farm-gate collection is seasonal and limited.",
    callToAction: "Bring the family, check availability, and come early."
  },
  {
    id: "last-cutoff",
    name: "Last-chance cut-off",
    channelFit: "Facebook post + Instagram story",
    hook: "Create urgency before a delivery run closes.",
    callToAction: "Order before the cut-off so the farm can pick to demand."
  },
  {
    id: "storage-recipe",
    name: "Storage and recipe tip",
    channelFit: "Instagram carousel + Facebook post",
    hook: "Teach customers how to store and enjoy lychees after delivery.",
    callToAction: "Save the tip and tag Lush Lychees in your summer bowl."
  }
];
