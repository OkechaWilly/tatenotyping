export interface Lesson {
  id: string;
  title: string;
  category: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  text: string;
  keys: string[];
}

export const LESSONS: Lesson[] = [
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
  }
];
