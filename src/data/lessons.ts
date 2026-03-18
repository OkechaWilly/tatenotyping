export interface Lesson {
  id: string;
  title: string;
  category: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  text: string;
  keys: string[];
}

export const LESSONS: Lesson[] = [
  // BEGINNER
  {
    id: "home-row-left",
    title: "Home Row - Left Hand",
    category: "Beginner",
    description: "Focus on your left hand fingers: A S D F.",
    text: "aaaa ssss dddd ffff asdf fdsa asdf fdsa",
    keys: ["a", "s", "d", "f"]
  },
  {
    id: "home-row-right",
    title: "Home Row - Right Hand",
    category: "Beginner",
    description: "Focus on your right hand fingers: J K L ;.",
    text: "jjjj kkkk llll ;;;; jkl; ;lkj jkl; ;lkj",
    keys: ["j", "k", "l", ";"]
  },
  {
    id: "home-row-both",
    title: "Home Row - Both Hands",
    category: "Beginner",
    description: "Combining both hands on the home row.",
    text: "fff jjj ddd kkk sss lll aaa ;;; fj dk sl a;",
    keys: ["a", "s", "d", "f", "j", "k", "l", ";"]
  },
  {
    id: "home-row-words",
    title: "Home Row Words",
    category: "Beginner",
    description: "Easy words using only home row keys.",
    text: "sad fad lad dad alas flask falls salad glass",
    keys: ["a", "s", "d", "f", "j", "k", "l", ";"]
  },
  {
    id: "top-row-q-p",
    title: "Top Row - Q and P",
    category: "Beginner",
    description: "Reaching for the edges: Q and P.",
    text: "qqqq pppp aqaq ;p;p quip quip pipe pipe",
    keys: ["q", "p", "a", ";", "u", "i"]
  },
  {
    id: "bottom-row-z-x",
    title: "Bottom Row - Z and X",
    category: "Beginner",
    description: "Introducing Z and X.",
    text: "zzzz xxxx azaz sxsx zone zone taxi taxi",
    keys: ["z", "x", "a", "s"]
  },
  {
    id: "bottom-row-c-n",
    title: "Bottom Row - C and N",
    category: "Beginner",
    description: "Introducing C and N.",
    text: "cccc nnnn dcdc jnjn cake cake none none",
    keys: ["c", "n", "d", "j"]
  },
  {
    id: "top-row-e-i",
    title: "Top Row - E and I",
    category: "Beginner",
    description: "Introducing the top row with E and I.",
    text: "eeee iiii eded ikik deed diid side kids",
    keys: ["e", "i", "a", "s", "d", "f", "j", "k", "l", ";"]
  },
  {
    id: "top-row-r-u",
    title: "Top Row - R and U",
    category: "Beginner",
    description: "Introducing R and U.",
    text: "rrrr uuuu frfr juju rude sure user lure",
    keys: ["r", "u", "e", "i", "a", "s", "d", "f", "j", "k", "l", ";"]
  },
  {
    id: "bottom-row-v-m",
    title: "Bottom Row - V and M",
    category: "Beginner",
    description: "Moving down to V and M.",
    text: "vvvv mmmm fvfv jmjm move view move view",
    keys: ["v", "m", "r", "u", "e", "i", "a", "s", "d", "f", "j", "k", "l", ";"]
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
