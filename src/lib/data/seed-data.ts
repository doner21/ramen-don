import type {
  VenueDetails,
  OpeningHour,
  MenuCategory,
  MenuItem,
  GalleryImage,
  HomepageSection,
  SignatureBowl,
} from "./types";

export const VENUE_DETAILS: VenueDetails = {
  name: "Ramen Don",
  address_line1: "Unit 1A Regency Wharf",
  city: "Birmingham",
  county: "West Midlands",
  postcode: "B1 2DS",
  phone: "0121 714 5565",
  instagram_url: "https://www.instagram.com/ramen_don_/",
  opentable_url: "https://www.opentable.co.uk/r/ramen-don-birmingham",
  tagline: "Handcrafted broths. Bold flavours.",
};

export const OPENING_HOURS: OpeningHour[] = [
  {
    day_of_week: 0,
    day_name: "Monday",
    is_closed: true,
  },
  {
    day_of_week: 1,
    day_name: "Tuesday",
    is_closed: false,
    lunch_open: "12:00",
    lunch_close: "15:00",
    dinner_open: "17:00",
    dinner_close: "22:00",
  },
  {
    day_of_week: 2,
    day_name: "Wednesday",
    is_closed: true,
  },
  {
    day_of_week: 3,
    day_name: "Thursday",
    is_closed: false,
    lunch_open: "12:00",
    lunch_close: "15:00",
    dinner_open: "17:00",
    dinner_close: "22:00",
  },
  {
    day_of_week: 4,
    day_name: "Friday",
    is_closed: false,
    lunch_open: "12:00",
    lunch_close: "15:00",
    dinner_open: "17:00",
    dinner_close: "22:00",
  },
  {
    day_of_week: 5,
    day_name: "Saturday",
    is_closed: false,
    lunch_open: "12:00",
    lunch_close: "15:00",
    dinner_open: "17:00",
    dinner_close: "23:00",
  },
  {
    day_of_week: 6,
    day_name: "Sunday",
    is_closed: false,
    lunch_open: "12:00",
    lunch_close: "20:00",
    note: "All day until 20:00",
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  { slug: "plates", name: "Plates", sort_order: 1 },
  { slug: "bowls", name: "Bowls", sort_order: 2 },
  { slug: "soft-drinks", name: "Soft Drinks", sort_order: 3 },
  { slug: "beers", name: "Beers", sort_order: 4 },
  { slug: "cocktails", name: "Cocktails", sort_order: 5 },
  { slug: "sake", name: "Saké", sort_order: 6 },
  { slug: "wine", name: "Wine", sort_order: 7 },
];

export const MENU_ITEMS: MenuItem[] = [
  // PLATES
  {
    category_slug: "plates",
    name: "Charred Edamame",
    description: "Shichimi togarashi, Sesame soy",
    price: 6.0,
    tags: ["vg"],
    sort_order: 1,
  },
  {
    category_slug: "plates",
    name: "Karaage (5)",
    description: "Crispy fried chicken thigh, Spicy kewpie mayo, Fresh lemon",
    price: 8.5,
    sort_order: 2,
  },
  {
    category_slug: "plates",
    name: "Gyoza (5)",
    description: "Chicken & Vegetable / Pork / Tofu & Vegetable",
    price: 8.0,
    sort_order: 3,
  },
  {
    category_slug: "plates",
    name: "Katsu Bomb (4)",
    description: "Fried rice balls, Curry filling",
    price: 7.0,
    tags: ["v"],
    sort_order: 4,
  },
  // BOWLS
  {
    category_slug: "bowls",
    name: "Kotteri Pork",
    description:
      "Pork bone broth, Chashu pork belly, House menma, Hanjuku egg, Spring onions, Beni Shoga, Nori",
    price: 16.0,
    sort_order: 1,
  },
  {
    category_slug: "bowls",
    name: "Chicken Paitan",
    description:
      "Chicken with vegetable broth, Sweet soy chicken thigh, Hanjuku egg, Spring onion, House menma, Beni Shoga, Nori",
    price: 16.0,
    sort_order: 2,
  },
  {
    category_slug: "bowls",
    name: "Miso",
    description:
      "Pork Bone broth or Chicken with vegetable broth, Chashu pork belly or Sweet soy chicken, Sweetcorn, Miso cabbage, Spring onion",
    price: 16.0,
    sort_order: 3,
  },
  {
    category_slug: "bowls",
    name: "Kara Miso",
    description:
      "Pork Bone broth or Chicken with vegetable broth, Chashu pork belly or Sweet soy chicken, Spicy miso & toasted sesame tare, Kimchi, Sweetcorn, Spring onion, Shichimi togarashi",
    price: 16.0,
    tags: ["spicy"],
    sort_order: 4,
  },
  {
    category_slug: "bowls",
    name: "Chicken Katsu Curry",
    description:
      "Panko chicken, Potatoes, Carrot, Rich curry sauce, Sticky Japanese rice, Spring onion, Beni Shoga",
    price: 13.5,
    sort_order: 5,
  },
  {
    category_slug: "bowls",
    name: "Veg Curry",
    description:
      "Sweet potato croquette, Tofu, Butternut Squash, Potatoes, Carrot, Rich curry sauce, Sticky Japanese rice, Spring onion, Beni Shoga",
    price: 12.5,
    tags: ["vg"],
    sort_order: 6,
  },
  {
    category_slug: "bowls",
    name: "Kotteri Veg",
    description:
      "Shio tare, Chilli oil, Soy milk, Kikurage, Sautéed cabbage, Menma, Spring onion, Sweetcorn, Beni shoga, Shichimi togarashi, Tofu, Hanjuku egg optional",
    price: 15.0,
    tags: ["vg"],
    sort_order: 7,
  },
  {
    category_slug: "bowls",
    name: "Veg Kara Miso",
    description:
      "Soy sesame tare, Chilli oil, Soy milk, Kikurage, Sautéed cabbage, Menma, Spring onion, Sweetcorn, Beni shoga, Shichimi togarashi, Tofu, Hanjuku egg optional",
    price: 15.0,
    tags: ["vg", "spicy"],
    sort_order: 8,
  },
  {
    category_slug: "bowls",
    name: "Shoyu Ramen",
    description:
      "Chicken with vegetable broth, Sweet soy chicken thigh, Hanjuku egg, Spring onion, Beni Shoga, Nori",
    price: 16.0,
    sort_order: 9,
  },
  {
    category_slug: "bowls",
    name: "Kishu Ramen",
    description:
      "Chicken with vegetable broth, Pink duck, House menma, Hanjuku egg, Spring onion, Nori",
    price: 18.95,
    sort_order: 10,
  },
  // SOFT DRINKS
  {
    category_slug: "soft-drinks",
    name: "Orange / Apple / Cranberry / Ginger Beer / Lemonade",
    price: 2.5,
    sort_order: 1,
  },
  {
    category_slug: "soft-drinks",
    name: "Coca-Cola / Diet Coke",
    price: 3.5,
    sort_order: 2,
  },
  {
    category_slug: "soft-drinks",
    name: "Still / Sparkling Water",
    price: 3.0,
    sort_order: 3,
  },
  // BEERS
  {
    category_slug: "beers",
    name: "Asahi 330ml Bottle",
    description: "Abv 5.2%",
    price: 4.5,
    sort_order: 1,
  },
  {
    category_slug: "beers",
    name: "Sapporo Pint Draft",
    description: "4.7%",
    price: 6.5,
    sort_order: 2,
  },
  // COCKTAILS
  {
    category_slug: "cocktails",
    name: "Moscow Mule",
    description: "Vodka, Ginger beer, Lime",
    price: 9.5,
    sort_order: 1,
  },
  {
    category_slug: "cocktails",
    name: "Izuku Midoriya Sour",
    description: "Midori, Vodka, Yuzu, Gomme syrup",
    price: 11.5,
    sort_order: 2,
  },
  {
    category_slug: "cocktails",
    name: "Smokey Bob",
    description: "Rum bar overproof rum, Passion fruit, Coconut syrup, Yuzu, Ginger beer",
    price: 12.5,
    sort_order: 3,
  },
  // SAKE
  {
    category_slug: "sake",
    name: "Yuzu Shu",
    description: "Yuzu, Citrus notes, Crisp",
    price_variants: [
      { label: "30ml", price: 3.5 },
      { label: "360ml", price: 21.5 },
      { label: "720ml", price: 48.0 },
    ],
    tags: ["Vol 15%"],
    sort_order: 1,
  },
  {
    category_slug: "sake",
    name: "Ume Shu",
    description: "Plum, Sweet, Ripe",
    price_variants: [
      { label: "30ml", price: 3.5 },
      { label: "360ml", price: 18.5 },
      { label: "720ml", price: 40.5 },
    ],
    tags: ["Vol 15%"],
    sort_order: 2,
  },
  {
    category_slug: "sake",
    name: "Kawatsuru Junmai Muroka",
    description: "Grape, Dark Plum, Creamy, Warm or Chilled",
    price_variants: [
      { label: "60ml", price: 4.0 },
      { label: "360ml", price: 18.5 },
      { label: "1.8L", price: 98.0 },
    ],
    tags: ["Vol 16%"],
    sort_order: 3,
  },
  {
    category_slug: "sake",
    name: "Katsujama Ken",
    description: "Dry, Melon, White peach, Crisp",
    price_variants: [
      { label: "60ml", price: 6.0 },
      { label: "360ml", price: 35.0 },
      { label: "1.8L", price: 75.0 },
    ],
    tags: ["Vol 15%"],
    sort_order: 4,
  },
  // WINE
  {
    category_slug: "wine",
    name: "Montanes Malbec",
    description: "Red, Argentina",
    price_variants: [
      { label: "175ml", price: 5.0 },
      { label: "250ml", price: 6.6 },
    ],
    sort_order: 1,
  },
  {
    category_slug: "wine",
    name: "Pinot Grigio Rosato",
    description: "Rosé, Italy",
    price_variants: [
      { label: "175ml", price: 5.3 },
      { label: "250ml", price: 6.9 },
    ],
    sort_order: 2,
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    filename: "hero_ramen.png",
    alt_text: "Atmospheric counter bar with warm amber lighting",
    local_path: "/images/brand/hero_ramen.png",
    is_hero: true,
    sort_order: 1,
  },
  {
    filename: "chef_craft.png",
    alt_text: "Chef hands crafting ramen in a dark kitchen with steam",
    local_path: "/images/brand/chef_craft.png",
    sort_order: 2,
  },
  {
    filename: "signature_bowl.png",
    alt_text: "Overhead view of tonkotsu ramen in dark ceramic bowl",
    local_path: "/images/brand/signature_bowl.png",
    sort_order: 3,
  },
  {
    filename: "spicy_fire.png",
    alt_text: "Spicy miso ramen with dramatic presentation",
    local_path: "/images/brand/spicy_fire.png",
    sort_order: 4,
  },
  {
    filename: "shoyu_essence.png",
    alt_text: "Overhead view of shoyu ramen with dark tones",
    local_path: "/images/brand/shoyu_essence.png",
    sort_order: 5,
  },
  {
    filename: "truffle_shio.png",
    alt_text: "Premium truffle shio ramen in white ceramic bowl",
    local_path: "/images/brand/truffle_shio.png",
    sort_order: 6,
  },
  {
    filename: "hero_Hawksmoor_ramen.png",
    alt_text: "Candlelit atmospheric ramen restaurant interior",
    local_path: "/images/brand/hero_Hawksmoor_ramen.png",
    sort_order: 7,
  },
];

export const SIGNATURE_BOWLS: SignatureBowl[] = [
  {
    name: "Kotteri Pork",
    description: "Pork bone broth, Chashu pork belly, House menma, Hanjuku egg",
    price: "£16",
    badge_label: null,
    image_local_path: "/images/brand/signature_bowl.png",
    alt_text: "Kotteri pork ramen in dark ceramic bowl",
    sort_order: 1,
    is_visible: true,
  },
  {
    name: "Kara Miso",
    description: "Spicy miso tare, Kimchi, Sweetcorn, Shichimi togarashi",
    price: "£16",
    badge_label: "🌶 Spicy",
    image_local_path: "/images/brand/spicy_fire.png",
    alt_text: "Spicy kara miso ramen",
    sort_order: 2,
    is_visible: true,
  },
  {
    name: "Shoyu Ramen",
    description: "Sweet soy chicken, Hanjuku egg, Spring onion, Nori",
    price: "£16",
    badge_label: null,
    image_local_path: "/images/brand/shoyu_essence.png",
    alt_text: "Shoyu ramen overhead",
    sort_order: 3,
    is_visible: true,
  },
  {
    name: "Kishu Ramen",
    description: "Pink duck, House menma, Hanjuku egg, Spring onion",
    price: "£18.95",
    badge_label: "Chef's Pick",
    image_local_path: "/images/brand/truffle_shio.png",
    alt_text: "Premium Kishu ramen",
    sort_order: 4,
    is_visible: true,
  },
];

export const HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    slug: "hero",
    heading: "RAMEN DON",
    subheading: "Handcrafted broths. Bold flavours.",
    cta_text: "Book a Table",
    cta_url: "https://www.opentable.co.uk/r/ramen-don-birmingham",
    image_key: "hero_ramen.png",
    is_visible: true,
    sort_order: 1,
  },
  {
    slug: "story",
    heading: "The Craft of Ramen",
    body: "Every bowl at Ramen Don begins with a broth simmered for hours — rich, deep, and layered with umami. Our chefs blend traditional Japanese techniques with bold Birmingham spirit, creating ramen that warms the soul and awakens the senses.",
    image_key: "chef_craft.png",
    is_visible: true,
    sort_order: 2,
  },
  {
    slug: "signature-dishes",
    heading: "Signature Bowls",
    subheading: "From our kitchen to your table",
    is_visible: true,
    sort_order: 3,
  },
  {
    slug: "visit-cta",
    heading: "Find Us in Birmingham",
    subheading: "Unit 1A Regency Wharf, Birmingham B1 2DS",
    cta_text: "Reserve Your Table",
    cta_url: "https://www.opentable.co.uk/r/ramen-don-birmingham",
    is_visible: true,
    sort_order: 4,
  },
];
