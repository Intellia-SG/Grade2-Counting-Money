// ──────────────────────────────────────────────────
// Narration Scripts — Money Quest Adventure (Lost Treasure Market)
// ──────────────────────────────────────────────────

import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// ─── INTRO SCREEN ────────────────────────────────
export function introNarration() {
  return [
    cheer("Welcome to Counting Money!"),
    say("Let's help Emma and her friends restore the Lost Treasure Market of Numeralia by mastering the magic of money."),
    ask("Are you ready to join the quest and become a Master Treasurer?"),
    cheer("Let's get started on our learning journey!"),
  ];
}

// ─── WONDER PHASE ────────────────────────────────
export function wonderNarration(questionText, subtext) {
  return [
    ask(questionText),
    say(subtext),
  ];
}

export function wonderDiscoverNarration() {
  return [
    cheer("Wow! That is a wonderful discovery!"),
    say("Every coin and note has a special value that helps us trade and buy things in the market."),
  ];
}

// ─── STORY PHASE ─────────────────────────────────
export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say("Emma discovers the broken marketplace in Numeralia."),
        say("A mysterious spell has scattered all the coins and notes, and the shopkeepers cannot buy or sell anything."),
        ask("Can Emma help them restore the market? Let's find out!"),
      ];
    case 1:
      return [
        say("Emma enters the Coin Forest, where the Coin Creatures have lost their values!"),
        say("Priya and Liam help Emma identify the sizes, colors, and values of Pennies, Nickels, Dimes, and Quarters."),
        emphasize("Knowing our coins is the first step to unlocking the forest!"),
      ];
    case 2:
      return [
        say("Emma hears a splash! It's the Counting Stream, where coins float in mathematical patterns."),
        say("We skip-count by fives, tens, and twenty-fives to find the total value in our treasure bag."),
        emphasize("Counting coins quickly helps us shop faster!"),
      ];
    case 3:
      return [
        say("Emma climbs the Note Mountains, where giant banknotes flutter from the castle towers."),
        say("Sarah the Treasurer shows Emma how to identify paper money: ones, fives, tens, and twenties."),
        emphasize("Notes are used for larger values, so we don't have to carry heavy bags of coins!"),
      ];
    case 4:
      return [
        say("Emma reaches the Mixing Valley, where ancient gates are sealed with coin and note locks."),
        say("We must combine coins and notes together to make the exact target amounts."),
        emphasize("There are many different ways to make the same value!"),
      ];
    case 5:
      return [
        say("Emma stands before the Comparison Bridge. Two paths lie ahead, but only one is safe to cross."),
        say("We must compare the money in the wallets and cross the bridge with the greater value."),
        emphasize("Always look closely at values before making a decision!"),
      ];
    case 6:
      return [
        say("The Shopping Festival returns! The marketplace is alive with colorful stalls and shops."),
        say("Mike the Market Master guides Emma to select items, add up their prices, and pay the exact amount."),
        emphasize("Paying the exact price is what makes a great shopper!"),
      ];
    case 7:
      return [
        say("Finally, Emma reaches the Word Problem Castle, operating the magical cash register."),
        say("We solve real-world shopping riddles and calculate the correct change to give back to the shoppers."),
        celebrate("With the register working, the Treasure Market spell is broken! Emma and her friends celebrate!"),
      ];
    default:
      return [];
  }
}

// ─── SIMULATE PHASE ──────────────────────────────
export function simulateStation1Intro() {
  return [
    instruct("Welcome to the Coin Workshop! Inspect pennies, nickels, dimes, and quarters."),
    say("Tap to flip the coins, see their front and back, and drop them on the scale to see their values!"),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("Welcome to the Banknote Castle! Inspect paper banknotes."),
    say("Tap the glowing hotspots to discover portraits, security seals, and details of each note!"),
  ];
}

export function simulateStation3Intro() {
  return [
    instruct("Welcome to the Counting Stream! Catch coins as they float by."),
    say("Put them in the treasure bag to skip-count and feed the Enchanted Piggy Bank!"),
  ];
}

export function simulateAllComplete() {
  return [
    celebrate("Fantastic job! You've completed all the simulations! Now let's play the game!"),
  ];
}

// ─── PLAY PHASE ──────────────────────────────────
export function playWorldIntro(worldName) {
  return [
    celebrate(`Welcome to ${worldName}!`),
    say("Read the question, look at the coins or notes, and choose the correct answer."),
  ];
}

export function playReadQuestion(questionText) {
  return [
    say(questionText),
  ];
}

export function playCorrectNarration(streak = 0) {
  if (streak > 0 && streak % 3 === 0) {
    return [cheer(`${streak} in a row! You are on fire!`)];
  }
  return [];
}

export function playWrongNarration() {
  return [
    think("That's okay! Take a close look and try again. You can do it!"),
  ];
}

export function playWorldComplete(worldName, score, total) {
  return [
    celebrate(`Great job! You finished the ${worldName}!`),
    say(`You scored ${score} out of ${total}.`),
  ];
}

// ─── REFLECT PHASE ───────────────────────────────
export function reflectIntroNarration() {
  return [
    ask("You have restored the Treasure Market! What is the most important thing you learned about money?"),
  ];
}

export function reflectCorrectNarration() {
  return [
    cheer("Excellent reflection! That is a very useful money skill."),
  ];
}

export function reflectWrongNarration() {
  return [];
}

export function reflectConfidenceNarration() {
  return [
    ask("How confident do you feel now about counting money and making change?"),
  ];
}

export function reflectCertificateNarration(pct) {
  return [
    celebrate("Congratulations! You are officially a Master Treasurer of Numeralia!"),
    say(`You scored ${Math.round(pct)}% on your quest. Keep up the amazing work!`),
  ];
}