export const INITIAL_PLAYLIST = [
  {
    day: 'Monday',
    dayCode: 'Mon',
    dateStr: 'Nov 3',
    slot: '1:00 PM – 1:15 PM',
    location: 'office',
    status: 'scheduled',
    currentIdx: 0,
    options: [
      {
        id: 'm1',
        name: 'Paneer Tikka Quinoa Bowl',
        kitchen: "Rajshree's Kitchen",
        rating: 4.8,
        reviews: 342,
        price: 190,
        kcal: 460,
        protein: 24,
        isVeg: true,
        tag: 'High Protein',
        image: '🥗',
        desc: 'Charred tandoori paneer cubes, organic tri-color quinoa, bell peppers & mint Greek yogurt dip.'
      },
      {
        id: 'm2',
        name: 'Soya Chaap Tikka & Millet Pulao',
        kitchen: 'Punjabi Rasoi',
        rating: 4.7,
        reviews: 218,
        price: 195,
        kcal: 480,
        protein: 26,
        isVeg: true,
        tag: 'Chef Special',
        image: '🍲',
        desc: 'Clay-oven spiced soya chunks on aromatic barnyard millet with pomegranate mint raita.'
      },
      {
        id: 'm3',
        name: 'Smoked Tofu Veggie Protein Rice',
        kitchen: 'Green Leaf Bistro',
        rating: 4.6,
        reviews: 189,
        price: 210,
        kcal: 440,
        protein: 23,
        isVeg: true,
        tag: 'Clean Fuel',
        image: '🍱',
        desc: 'Marinated high-fiber smoked tofu, broccoli, edamame and brown basmati rice bowl.'
      }
    ]
  },
  {
    day: 'Tuesday',
    dayCode: 'Tue',
    dateStr: 'Nov 4',
    slot: '1:00 PM – 1:15 PM',
    location: 'office',
    status: 'scheduled',
    currentIdx: 0,
    options: [
      {
        id: 't1',
        name: 'Dal Makhani & 3 Multigrain Rotis',
        kitchen: 'Amritsari Tadka',
        rating: 4.6,
        reviews: 412,
        price: 180,
        kcal: 490,
        protein: 21,
        isVeg: true,
        tag: 'Homestyle',
        image: '🥘',
        desc: 'Slow-simmered whole urad lentils with cold-pressed ghee, fresh radish cucumber salad.'
      },
      {
        id: 't2',
        name: 'Methi Paneer Bhurji & Paratha',
        kitchen: 'Shree Ganesh Thali',
        rating: 4.7,
        reviews: 176,
        price: 195,
        kcal: 470,
        protein: 23,
        isVeg: true,
        tag: 'Fibre Rich',
        image: '🫓',
        desc: 'Fresh fenugreek leaves scrambled with malai paneer, 2 whole wheat layered parathas.'
      },
      {
        id: 't3',
        name: 'Chana Masala with Jeera Brown Rice',
        kitchen: 'Desi Khana Hub',
        rating: 4.5,
        reviews: 298,
        price: 175,
        kcal: 450,
        protein: 20,
        isVeg: true,
        tag: 'Comfort Food',
        image: '🍛',
        desc: 'Pindi style chickpeas cooked in dry spices, cumin roasted brown rice and sirka onions.'
      }
    ]
  },
  {
    day: 'Wednesday',
    dayCode: 'Wed',
    dateStr: 'Nov 5',
    slot: '1:30 PM – 1:45 PM',
    location: 'home',
    status: 'scheduled',
    currentIdx: 0,
    options: [
      {
        id: 'w1',
        name: 'Mediterranean Chickpea & Falafel Bowl',
        kitchen: 'Mezze Garden',
        rating: 4.9,
        reviews: 512,
        price: 220,
        kcal: 430,
        protein: 22,
        isVeg: true,
        tag: 'Antioxidant',
        image: '🥙',
        desc: 'Baked herbed falafel patties, roasted garlic chickpea salad, kalamata olives & lemon tahini.'
      },
      {
        id: 'w2',
        name: 'Greek Cottage Cheese Herb Bowl',
        kitchen: 'Olive & Basil',
        rating: 4.7,
        reviews: 203,
        price: 230,
        kcal: 410,
        protein: 25,
        isVeg: true,
        tag: 'Low Carb',
        image: '🥗',
        desc: 'Diced paneer with zaatar herbs, cucumber ribbons, cherry tomatoes and walnut vinaigrette.'
      },
      {
        id: 'w3',
        name: 'Lebanese Hummus & Warm Pita Platter',
        kitchen: 'Cedar Kitchen',
        rating: 4.8,
        reviews: 320,
        price: 215,
        kcal: 460,
        protein: 21,
        isVeg: true,
        tag: 'Gourmet',
        image: '🧆',
        desc: 'Creamy cold-pressed olive oil hummus, whole wheat pita, pickled turnip and grilled peppers.'
      }
    ]
  },
  {
    day: 'Thursday',
    dayCode: 'Thu',
    dateStr: 'Nov 6',
    slot: '1:00 PM – 1:15 PM',
    location: 'office',
    status: 'scheduled',
    currentIdx: 0,
    options: [
      {
        id: 'th1',
        name: 'Palak Paneer & Bajra Roti Meal',
        kitchen: 'Satvik Sattva',
        rating: 4.8,
        reviews: 384,
        price: 185,
        kcal: 440,
        protein: 23,
        isVeg: true,
        tag: 'Iron Rich',
        image: '🥬',
        desc: 'Hand-ground blanched spinach puree, farm cottage cheese and 2 gluten-free pearl millet rotis.'
      },
      {
        id: 'th2',
        name: 'Paneer Bhurji with Flax Multigrain Roti',
        kitchen: 'Fit Bowls Co.',
        rating: 4.6,
        reviews: 210,
        price: 190,
        kcal: 455,
        protein: 25,
        isVeg: true,
        tag: 'High Protein',
        image: '🥣',
        desc: 'Spiced crushed paneer tossed with bell peppers and roasted flaxseeds, 2 multi-seed rotis.'
      },
      {
        id: 'th3',
        name: 'Stir-Fried Sprouted Moong & Paneer Bowl',
        kitchen: 'Healthy Treat',
        rating: 4.7,
        reviews: 145,
        price: 170,
        kcal: 390,
        protein: 22,
        isVeg: true,
        tag: 'Low GI',
        image: '🌱',
        desc: 'Crunchy sprouted green gram tossed with grilled cottage cheese, ginger juliennes and lemon.'
      }
    ]
  },
  {
    day: 'Friday',
    dayCode: 'Fri',
    dateStr: 'Nov 7',
    slot: '1:30 PM – 1:45 PM',
    location: 'home',
    status: 'scheduled',
    currentIdx: 0,
    options: [
      {
        id: 'f1',
        name: 'Edamame Soba Noodles & Teriyaki Tofu',
        kitchen: 'Zen Asian Bowls',
        rating: 4.7,
        reviews: 440,
        price: 235,
        kcal: 475,
        protein: 25,
        isVeg: true,
        tag: 'TGIF Treat',
        image: '🍜',
        desc: 'Buckwheat Japanese soba noodles, grilled sesame teriyaki tofu cubes, tender edamame pods.'
      },
      {
        id: 'f2',
        name: 'Kadhi Pakoda & Brown Rice Thali',
        kitchen: 'Ghar Ka Swad',
        rating: 4.6,
        reviews: 310,
        price: 165,
        kcal: 480,
        protein: 18,
        isVeg: true,
        tag: 'Friday Comfort',
        image: '🍲',
        desc: 'Traditional sour curd and besan kadhi with fenugreek pakodas, steamed brown rice and papad.'
      },
      {
        id: 'f3',
        name: 'Avocado Mexican Burrito Bowl',
        kitchen: 'Fiesta Fresh',
        rating: 4.8,
        reviews: 520,
        price: 245,
        kcal: 460,
        protein: 22,
        isVeg: true,
        tag: 'Nutrient Dense',
        image: '🥑',
        desc: 'Hass avocado mash, spicy black beans, sweet corn, brown rice and homemade fire-roasted salsa.'
      }
    ]
  }
];

export const CUTOFF_ALTERNATIVES = [
  {
    id: 'alt1',
    name: 'Dal Khichdi & Aloo Jeera Bowl',
    kitchen: "Homestyle Bowls",
    rating: 4.7,
    price: 190,
    kcal: 440,
    protein: 19,
    tag: 'Digestive Comfort',
    image: '🍲',
    desc: 'Light yellow moong dal khichdi, tempered cumin baby potatoes & probiotic dahi.'
  },
  {
    id: 'alt2',
    name: 'Tofu Masala & Multigrain Roti',
    kitchen: "Fit Kitchen",
    rating: 4.8,
    price: 190,
    kcal: 430,
    protein: 25,
    tag: 'Vegan Protein',
    image: '🫓',
    desc: 'Spicy onion-tomato gravy with pan-seared organic tofu & 3 fibre rotis.'
  },
  {
    id: 'alt3',
    name: 'Mediterranean Chickpea Salad',
    kitchen: "Greens & Grains",
    rating: 4.9,
    price: 190,
    kcal: 410,
    protein: 21,
    tag: 'Low Carb Crisp',
    image: '🥗',
    desc: 'Steamed kabuli chana, English cucumber, kalamata olives, feta & lemon vinaigrette.'
  }
];

export const SAVED_LOCATIONS = {
  office: {
    id: 'office',
    label: '🏢 Office',
    name: 'Cyber Park Tower B',
    address: '4th Floor, Tech Hub, Sector 62',
    defaultSlot: '1:00 PM – 1:15 PM',
    type: 'Workplace'
  },
  home: {
    id: 'home',
    label: '🏠 Home',
    name: 'Green Valley Apt',
    address: 'Flat 402, Tower 4, Park Lane',
    defaultSlot: '1:30 PM – 1:45 PM',
    type: 'Residence'
  }
};
