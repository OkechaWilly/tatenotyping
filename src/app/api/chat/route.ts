import { NextResponse } from "next/server";

// A very simplistic "Siri-like" friendly companion mockup
// In a full production environment this could call a customized lightweight LLM or dialog engine.

const checkKeywords = (text: string, arr: string[]) => {
  const lower = text.toLowerCase();
  return arr.some((word) => lower.includes(word));
};

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // The messages array looks like [{role: 'user', content: 'hello'}, {role: 'assistant', content: 'hi!'}]
    // We analyze the last message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json({ reply: "I'm here!" });
    }

    const text = lastMessage.content;
    let reply = "";

    // Simulate thinking delay between 1s and 2s
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    if (checkKeywords(text, ["hi", "hello", "hey", "sup", "what's up", "howdy"])) {
      reply = getRandom([
        "Hey! How are you doing today?",
        "Hi there! Ready to do some typing practice?",
        "Hello! It's great to see you. How are things?",
        "Hey! What's on your mind today?",
        "Good to see you! Are your fingers warmed up?"
      ]);
    } else if (checkKeywords(text, ["struggling", "hard", "difficult", "mistake", "error", "slow", "terrible", "bad at this"])) {
      reply = getRandom([
        "Don't worry, typing is all about muscle memory. It takes time!",
        "It's totally normal to make mistakes. Just breathe and try to keep a steady rhythm.",
        "Take it easy! Accuracy is way more important than speed right now. You're doing great.",
        "I get that. Sometimes my circuits feel overloaded too. Just take a short break if you need it!",
        "Everyone starts somewhere. Focus on hitting the right keys, not how fast you can hit them."
      ]);
    } else if (checkKeywords(text, ["type", "typing", "wpm", "speed", "accuracy", "fast", "keyboard", "fingers"])) {
      reply = getRandom([
        "I'm actually tracking your keystrokes right now behind the scenes! Focus on your accuracy.",
        "Your WPM is looking solid. Remember to keep your fingers resting on the home row!",
        "Are you using your pinkies enough? That's the secret to true speed.",
        "I noticed you're typing pretty confidently! Keep that momentum going.",
        "A good mechanical keyboard helps, but technique is everything. Keep your wrists hovering!"
      ]);
    } else if (checkKeywords(text, ["feel", "good", "great", "awesome", "amazing", "happy"])) {
      reply = getRandom([
        "I'm glad to hear that! Keep enjoying the journey.",
        "That's the spirit! A positive mindset makes learning so much faster.",
        "Love that energy. Let's channel it into some fast typing!",
        "Awesome! You're crushing it today."
      ]);
    } else if (checkKeywords(text, ["tired", "sad", "exhausted", "bored", "sleepy"])) {
      reply = getRandom([
        "I completely understand. Drink some water, relax your shoulders, and let's just chat.",
        "That's so valid. I'm just a chat companion, but I'm here if you want to type it out!",
        "Maybe take a 5-minute break? Rest your eyes and stretch your hands.",
        "It's okay to feel that way. Pushing yourself too hard leads to typos anyway!"
      ]);
    } else if (checkKeywords(text, ["thanks", "thank you", "appreciate"])) {
      reply = getRandom([
        "You're very welcome!",
        "Anytime! I'm here to help.",
        "No problem at all. You're doing the hard work!",
        "Happy to be your typing buddy."
      ]);
    } else if (text.split(" ").length > 10) {
      // Long thoughtful response
      reply = getRandom([
        "Wow, you typed all that out quickly! I'm impressed.",
        "That makes a lot of sense. Thanks for sharing that with me. Keep going!",
        "You're really getting into the flow of typing now, aren't you? It feels so natural.",
        "I'm reading you loud and clear. Your typing rhythm seems very steady on those longer sentences.",
        "I love the detail! And the fact that you're getting typing practice while writing it is a bonus."
      ]);
    } else {
      // Generic catch-all
      reply = getRandom([
        "Haha, yeah exactly!",
        "Oh really? Tell me more.",
        "That's interesting. What else?",
        "I absolutely agree.",
        "Mmm-hmm. And how is your typing feeling while you say that?",
        "Got it!",
        "Makes sense to me.",
        "Fascinating. Keep going."
      ]);
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "I didn't quite catch that! (Network error)" }, { status: 500 });
  }
}
