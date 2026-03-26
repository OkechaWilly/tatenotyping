export interface Lesson {
  id: string;
  title: string;
  category: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  text: string;
  keys: string[];
  displayMode?: "linear" | "wordgrid";
}

export const LESSONS: Lesson[] = [
  // BEGINNER
  {
    id: "lesson-1",
    title: "Home Row Basics",
    category: "Beginner",
    description: "The foundation of touch typing: A S D F and J K L ;.",
    text: "asdf jkl; asdf jkl; fdsa ;lkj asdf jkl; ads jks",
    keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
    displayMode: "linear"
  },
  {
    id: "lesson-2",
    title: "E and I - Top Row Reach",
    category: "Beginner",
    description: "Master your first vertical reach with your middle fingers.",
    text: "ded ded did did eke eke fie fie deal idle fell like eel isle deli elk",
    keys: ["e", "i"],
    displayMode: "wordgrid"
  },
  {
    id: "lesson-3",
    title: "H and G - Center Reach",
    category: "Beginner",
    description: "Reaching to the center with your index fingers.",
    text: "jjh jjh fgf fgf had had gag gag shall gash flag has glad half shelf",
    keys: ["h", "g"],
    displayMode: "wordgrid"
  },
  {
    id: "lesson-4",
    title: "Full Top Row",
    category: "Beginner",
    description: "Navigating the entire top row from Q to P.",
    text: "qua war err try you our put top row quit wrap rout pour tower",
    keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    displayMode: "wordgrid"
  },
  {
    id: "lesson-5",
    title: "Full Bottom Row",
    category: "Beginner",
    description: "Navigating the entire bottom row from Z to M.",
    text: "zap axe can van ban man cab nab zinc vex mix box vim zone calm",
    keys: ["z", "x", "c", "v", "b", "n", "m"],
    displayMode: "wordgrid"
  },
  {
    id: "lesson-6",
    title: "Number Row",
    category: "Beginner",
    description: "Learning the numeric row for data entry.",
    text: "11 22 33 44 55 66 77 88 99 00 123 456 789 2024 1984 360 100",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    displayMode: "wordgrid"
  },
  {
    id: "lesson-7",
    title: "Punctuation and Shift",
    category: "Intermediate",
    description: "Mastering capitalization and basic punctuation marks.",
    text: "dog, cat. run! did you? yes, I did. it's fine. she's here. well, okay.",
    keys: [".", ",", "!", "?", "'", "shift"],
    displayMode: "wordgrid"
  },
  {
    id: "lesson-8",
    title: "Speed Drill: Full Keyboard",
    category: "Intermediate",
    description: "A 60-second timed challenge across all keys to test your mastery.",
    text: "The quick brown fox jumps over a lazy dog. Practice makes perfect. Keep pushing your speed while maintaining accuracy. Every keystroke counts toward your progress.",
    keys: [], // Full keyboard
    displayMode: "linear"
  },

  // INTERMEDIATE
  {
    id: "common-bigrams-1",
    title: "Common Bigrams - TH and HE",
    category: "Intermediate",
    description: "Mastering the most common pairs: 'th' and 'he'.",
    text: "th th th he he he the the then then they",
    keys: ["t", "h", "e", "y", "n"]
  },
  {
    id: "common-bigrams-2",
    title: "Common Bigrams - IN and ER",
    category: "Intermediate",
    description: "Focusing on 'in' and 'er' transitions.",
    text: "in in in er er er inner enter finer dinner",
    keys: ["i", "n", "e", "r", "f", "d"]
  },
  {
    id: "common-words-1",
    title: "Top 20 Words - Set A",
    category: "Intermediate",
    description: "High-frequency words to build muscle memory.",
    text: "the and for are but not you all any can",
    keys: ["t", "h", "e", "a", "n", "d", "f", "o", "r", "u", "b", "y", "c", "l"]
  },
  {
    id: "common-words-2",
    title: "Top 20 Words - Set B",
    category: "Intermediate",
    description: "Continuing with high-frequency words.",
    text: "had her was one our out day get has him",
    keys: ["h", "a", "d", "e", "r", "w", "s", "o", "n", "u", "t", "y", "g", "i", "m"]
  },
  {
    id: "punctuation-1",
    title: "Basic Punctuation",
    category: "Intermediate",
    description: "Mastering the comma and period.",
    text: "a. s. d. f. j, k, l, ;. a, b. c, d. e, f.",
    keys: [".", ",", "a", "s", "d", "f", "j", "k", "l", ";"]
  },
  {
    id: "shift-keys",
    title: "Shift and Capitals",
    category: "Intermediate",
    description: "Learning to use the Shift key for capital letters.",
    text: "Aa Ss Dd Ff Jj Kk Ll ;; Alpha Sierra Delta Foxtrot",
    keys: ["shift", "a", "s", "d", "f", "j", "k", "l", ";"]
  },
  {
    id: "punctuation-2",
    title: "Advanced Punctuation",
    category: "Intermediate",
    description: "Mastering quotes, colons, and hyphens.",
    text: "\"Hello:\" she said- \"How's life?\" 1-2-3: ready.",
    keys: ["\"", ":", "-", "?", "'", "1", "2", "3"]
  },

  // ADVANCED
  {
    id: "code-basics-html",
    title: "Code Basics - HTML Tags",
    category: "Advanced",
    description: "Practice the syntax of HTML elements.",
    text: "<div> <span> <p> </p> </span> </div> <ul> <li>",
    keys: ["<", ">", "/", "d", "i", "v", "s", "p", "a", "n", "u", "l"]
  },
  {
    id: "code-js-loops",
    title: "Code - JavaScript Loops",
    category: "Advanced",
    description: "Common syntax for loops and logic.",
    text: "for (let i = 0; i < 10; i++) { console.log(i); }",
    keys: ["(", ")", "{", "}", ";", "=", "<", "+", ".", "l", "o", "g"]
  },
  {
    id: "code-css-props",
    title: "Code - CSS Properties",
    category: "Advanced",
    description: "Practice curly braces and colons in CSS.",
    text: ".card { display: flex; gap: 1rem; color: #fff; }",
    keys: [".", "{", "}", ":", ";", "#", "f", "l", "e", "x", "g", "a", "p"]
  },
  {
    id: "prose-short-1",
    title: "Prose - Minimalist Living",
    category: "Advanced",
    description: "A short paragraph focusing on flow.",
    text: "Simplicity is not the absence of things. It is the presence of focus.",
    keys: ["s", "i", "m", "p", "l", "c", "t", "y", "o", "u", "e", "a", "h", "f"]
  }
];
