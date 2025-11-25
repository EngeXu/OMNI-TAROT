import { CardData, SpreadDefinition, Suit } from "./types";

// --- Tarot Deck Generation ---
const majorArcanaNames = [
  "愚人 (The Fool)", "魔术师 (The Magician)", "女祭司 (The High Priestess)", "皇后 (The Empress)", "皇帝 (The Emperor)",
  "教皇 (The Hierophant)", "恋人 (The Lovers)", "战车 (The Chariot)", "力量 (Strength)", "隐士 (The Hermit)",
  "命运之轮 (Wheel of Fortune)", "正义 (Justice)", "倒吊人 (The Hanged Man)", "死神 (Death)", "节制 (Temperance)",
  "恶魔 (The Devil)", "高塔 (The Tower)", "星星 (The Star)", "月亮 (The Moon)", "太阳 (The Sun)", "审判 (Judgement)", "世界 (The World)"
];

const generateDeck = (): CardData[] => {
  const deck: CardData[] = [];

  // Add Major Arcana
  majorArcanaNames.forEach((name, index) => {
    deck.push({
      id: `major-${index}`,
      name,
      suit: Suit.MAJOR,
      number: index,
      keywords: ["大阿卡纳", "灵魂课题", "核心能量"]
    });
  });

  // Add Minor Arcana
  const suits = [
    { val: Suit.WANDS, name: "权杖", label: "Wands" }, 
    { val: Suit.CUPS, name: "圣杯", label: "Cups" }, 
    { val: Suit.SWORDS, name: "宝剑", label: "Swords" }, 
    { val: Suit.PENTACLES, name: "星币", label: "Pentacles" }
  ];

  suits.forEach(suitObj => {
    for (let i = 1; i <= 14; i++) {
      let name = `${suitObj.name} ${i}`;
      if (i === 1) name = `${suitObj.name}首牌 (Ace)`;
      if (i === 11) name = `${suitObj.name}侍从 (Page)`;
      if (i === 12) name = `${suitObj.name}骑士 (Knight)`;
      if (i === 13) name = `${suitObj.name}皇后 (Queen)`;
      if (i === 14) name = `${suitObj.name}国王 (King)`;

      deck.push({
        id: `${suitObj.label.toLowerCase()}-${i}`,
        name,
        suit: suitObj.val,
        number: i,
        keywords: ["小阿卡纳", "日常能量", "具体事件"]
      });
    }
  });

  return deck;
};

export const TAROT_DECK = generateDeck();

// --- Spreads (Reduced to Single Classic Spread) ---

export const SPREADS: SpreadDefinition[] = [
  {
    id: "time-flow",
    name: "圣三角占卜 (The Three Fates)",
    description: "经典的过去、现在、未来解读，最适合快速洞察。",
    difficulty: "Beginner",
    positions: [
      { name: "过去", description: "成因与根源", x: 2, y: 4 },
      { name: "现在", description: "现状与挑战", x: 6, y: 2 },
      { name: "未来", description: "趋势与结果", x: 10, y: 4 },
    ]
  }
];