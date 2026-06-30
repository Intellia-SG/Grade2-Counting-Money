// ──────────────────────────────────────────────────
// Question Bank — Money Quest Adventure
// ──────────────────────────────────────────────────

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateDistractors(correct, step = 5, count = 3) {
  const distractors = new Set();
  const offsets = [-2 * step, -step, step, 2 * step, -1, 1];
  
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d > 0 && d !== correct && distractors.size < count) {
      distractors.add(d);
    }
  });

  // Fallback distractors
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1) * step;
    if (d !== correct) distractors.add(d);
  }

  return shuffleArray([correct, ...distractors]);
}

// 5 Worlds for Grade 2 Money Quest
const QUESTIONS_DATA = [
  // WORLD 0: COIN FOREST (Coin Recognition)
  [
    {
      id: 'w0_q1',
      world: 0,
      type: 'coin_id',
      questionText: 'Identify this coin. What is its name and value?',
      visual: 'coin',
      coinType: 'quarter',
      hint1: 'This is the largest standard coin with George Washington on the front.',
      hint2: 'A quarter is worth 25 cents.',
      explanation: 'This is a Quarter. It is worth 25 cents.',
      options: ['Penny (1¢)', 'Nickel (5¢)', 'Dime (10¢)', 'Quarter (25¢)'],
      correctAnswer: 'Quarter (25¢)'
    },
    {
      id: 'w0_q2',
      world: 0,
      type: 'coin_id',
      questionText: 'Which coin is worth exactly 10 cents?',
      visual: 'coin_text',
      hint1: 'It is the smallest coin in size, and features Franklin D. Roosevelt.',
      hint2: 'A dime equals 10 cents.',
      explanation: 'A Dime is the smallest coin, worth exactly 10 cents.',
      options: ['Penny', 'Nickel', 'Dime', 'Quarter'],
      correctAnswer: 'Dime'
    },
    {
      id: 'w0_q3',
      world: 0,
      type: 'coin_id',
      questionText: 'Identify this coppery-brown coin. What is its value?',
      visual: 'coin',
      coinType: 'penny',
      hint1: 'It has Abraham Lincoln on the front and is the only bronze-colored coin.',
      hint2: 'A penny is worth 1 cent.',
      explanation: 'This is a Penny. It has a bronze color and is worth 1 cent.',
      options: ['1 cent', '5 cents', '10 cents', '25 cents'],
      correctAnswer: '1 cent'
    },
    {
      id: 'w0_q4',
      world: 0,
      type: 'coin_id',
      questionText: 'Identify this coin. It is larger than a dime but worth less than it!',
      visual: 'coin',
      coinType: 'nickel',
      hint1: 'It features Thomas Jefferson and is worth 5 cents.',
      hint2: 'Even though it is larger than a dime, it is only worth 5 cents.',
      explanation: 'This is a Nickel. It is worth 5 cents.',
      options: ['Penny (1¢)', 'Nickel (5¢)', 'Dime (10¢)', 'Quarter (25¢)'],
      correctAnswer: 'Nickel (5¢)'
    },
    {
      id: 'w0_q5',
      world: 0,
      type: 'coin_match',
      questionText: 'Match: If Priya has 1 Quarter, how many cents does she have?',
      visual: 'coin_match',
      hint1: 'Think about the value of 1 quarter.',
      hint2: '1 quarter equals 25 cents.',
      explanation: 'One quarter is worth 25 cents.',
      options: ['5 cents', '10 cents', '25 cents', '50 cents'],
      correctAnswer: '25 cents'
    },
    {
      id: 'w0_q6',
      world: 0,
      type: 'coin_size',
      questionText: 'True or False: A Dime is smaller in size than a Nickel, but it has a larger value.',
      visual: 'coin_size_compare',
      hint1: 'A dime is worth 10 cents, and a nickel is worth 5 cents.',
      hint2: 'Yes, the dime is physically smaller, but worth more.',
      explanation: 'True! A Dime (10¢) is smaller than a Nickel (5¢) but has twice its value.',
      options: ['True', 'False'],
      correctAnswer: 'True'
    }
  ],

  // WORLD 1: COUNTING STREAM (Skip Counting & Counting Coins)
  [
    {
      id: 'w1_q1',
      world: 1,
      type: 'skip_count',
      questionText: 'Count by 5s. How many cents do these 4 Nickels make altogether?',
      visual: 'coins_collection',
      coins: { nickel: 4 },
      hint1: 'Skip-count: 5, 10, 15, 20...',
      hint2: 'Each nickel is worth 5¢. 4 times 5 is 20.',
      explanation: '4 Nickels make: 5¢, 10¢, 15¢, 20¢. Total is 20 cents.',
      options: ['10 cents', '15 cents', '20 cents', '25 cents'],
      correctAnswer: '20 cents'
    },
    {
      id: 'w1_q2',
      world: 1,
      type: 'skip_count',
      questionText: 'Count by 10s. What is the value of these 3 Dimes?',
      visual: 'coins_collection',
      coins: { dime: 3 },
      hint1: 'Skip-count: 10, 20, 30...',
      hint2: 'Each dime is 10¢. 3 times 10 is 30.',
      explanation: '3 Dimes make: 10¢, 20¢, 30¢. Total is 30 cents.',
      options: ['20 cents', '30 cents', '40 cents', '50 cents'],
      correctAnswer: '30 cents'
    },
    {
      id: 'w1_q3',
      world: 1,
      type: 'count_mixed_coins',
      questionText: 'Count the total value of these coins: 1 Quarter and 2 Dimes.',
      visual: 'coins_collection',
      coins: { quarter: 1, dime: 2 },
      hint1: 'Start with the largest coin: 25¢. Then add the dimes: 25 + 10 = 35, then + 10 = 45.',
      hint2: '25 cents + 20 cents = 45 cents.',
      explanation: 'One Quarter (25¢) plus two Dimes (20¢) equals 45 cents.',
      options: ['35 cents', '40 cents', '45 cents', '55 cents'],
      correctAnswer: '45 cents'
    },
    {
      id: 'w1_q4',
      world: 1,
      type: 'count_mixed_coins',
      questionText: 'What is the total value of 2 Quarters, 1 Nickel, and 3 Pennies?',
      visual: 'coins_collection',
      coins: { quarter: 2, nickel: 1, penny: 3 },
      hint1: 'First count quarters: 25 + 25 = 50¢. Add nickel: 50 + 5 = 55¢. Add pennies: 55 + 3 = 58¢.',
      hint2: '50¢ + 5¢ + 3¢ = 58¢.',
      explanation: '2 Quarters (50¢) + 1 Nickel (5¢) + 3 Pennies (3¢) = 58 cents.',
      options: ['53 cents', '58 cents', '63 cents', '68 cents'],
      correctAnswer: '58 cents'
    },
    {
      id: 'w1_q5',
      world: 1,
      type: 'skip_count',
      questionText: 'Count by 25s. How many cents do 4 Quarters make?',
      visual: 'coins_collection',
      coins: { quarter: 4 },
      hint1: 'Skip-count: 25, 50, 75, 100...',
      hint2: '4 quarters make 100 cents, which is equal to 1 dollar.',
      explanation: '4 Quarters equal: 25¢, 50¢, 75¢, 100¢. That is 100 cents (or $1.00).',
      options: ['50 cents', '75 cents', '100 cents', '125 cents'],
      correctAnswer: '100 cents'
    },
    {
      id: 'w1_q6',
      world: 1,
      type: 'count_mixed_coins',
      questionText: 'Priya has 3 Dimes, 2 Nickels, and 4 Pennies. How much money does she have?',
      visual: 'coins_collection',
      coins: { dime: 3, nickel: 2, penny: 4 },
      hint1: 'Dimes: 30¢. Nickels: 10¢. Pennies: 4¢. Add them together.',
      hint2: '30 + 10 + 4 = 44 cents.',
      explanation: '3 Dimes (30¢) + 2 Nickels (10¢) + 4 Pennies (4¢) = 44 cents.',
      options: ['34 cents', '40 cents', '44 cents', '48 cents'],
      correctAnswer: '44 cents'
    }
  ],

  // WORLD 2: NOTE MOUNTAINS (Note Recognition & Counting)
  [
    {
      id: 'w2_q1',
      world: 2,
      type: 'note_id',
      questionText: 'Identify this green banknote. What is its value?',
      visual: 'note',
      noteType: 10,
      hint1: 'It features Alexander Hamilton and the number 10 in all four corners.',
      hint2: 'It is a 10 dollar bill.',
      explanation: 'This is a $10 bill. It features Alexander Hamilton.',
      options: ['$1 Bill', '$5 Bill', '$10 Bill', '$20 Bill'],
      correctAnswer: '$10 Bill'
    },
    {
      id: 'w2_q2',
      world: 2,
      type: 'note_id',
      questionText: 'Which banknote features Abraham Lincoln and is worth 5 dollars?',
      visual: 'note_text',
      hint1: 'It has the number 5 on it.',
      hint2: 'Abraham Lincoln is on the $5 note.',
      explanation: 'The $5 Bill features Abraham Lincoln.',
      options: ['$1 Bill', '$5 Bill', '$10 Bill', '$20 Bill'],
      correctAnswer: '$5 Bill'
    },
    {
      id: 'w2_q3',
      world: 2,
      type: 'count_notes',
      questionText: 'Emma has three $5 bills. How much money does she have in total?',
      visual: 'notes_collection',
      notes: { 5: 3 },
      hint1: 'Count by fives three times: 5, 10, 15.',
      hint2: '3 times 5 dollars is 15 dollars.',
      explanation: 'Three $5 bills equal: 5 + 5 + 5 = 15 dollars.',
      options: ['$10', '$15', '$20', '$25'],
      correctAnswer: '$15'
    },
    {
      id: 'w2_q4',
      world: 2,
      type: 'count_notes',
      questionText: 'What is the total value of one $20 bill, two $10 bills, and three $1 bills?',
      visual: 'notes_collection',
      notes: { 20: 1, 10: 2, 1: 3 },
      hint1: 'Start with 20. Add two tens: 20 + 10 + 10 = 40. Then add three ones: 40 + 3 = 43.',
      hint2: '$20 + $20 + $3 = $43.',
      explanation: 'One $20 bill + two $10 bills ($20) + three $1 bills ($3) = 43 dollars.',
      options: ['$33', '$38', '$43', '$48'],
      correctAnswer: '$43'
    },
    {
      id: 'w2_q5',
      world: 2,
      type: 'count_notes',
      questionText: 'Liam wants to trade one $20 bill for $5 bills. How many $5 bills should he get?',
      visual: 'note_exchange',
      hint1: 'Count by fives until you reach twenty: 5, 10, 15, 20.',
      hint2: 'Four $5 bills make 20 dollars.',
      explanation: 'Since 4 × 5 = 20, Liam should get four $5 bills for one $20 bill.',
      options: ['2 bills', '3 bills', '4 bills', '5 bills'],
      correctAnswer: '4 bills'
    },
    {
      id: 'w2_q6',
      world: 2,
      type: 'count_notes',
      questionText: 'What is the total value of these notes: one $10 bill and four $5 bills?',
      visual: 'notes_collection',
      notes: { 10: 1, 5: 4 },
      hint1: 'Four $5 bills make $20. Add the $10 bill: 20 + 10 = 30.',
      hint2: '$10 + $20 = $30.',
      explanation: 'One $10 bill + four $5 bills ($20) = 30 dollars.',
      options: ['$20', '$25', '$30', '$40'],
      correctAnswer: '$30'
    }
  ],

  // WORLD 3: SHOPPING FESTIVAL (Mixed Money & Pay Exact Amount)
  [
    {
      id: 'w3_q1',
      world: 3,
      type: 'mixed_money',
      questionText: 'Emma has one $5 bill, two Quarters, and three Dimes. What is her total money?',
      visual: 'mixed_collection',
      notes: { 5: 1 },
      coins: { quarter: 2, dime: 3 },
      hint1: 'The bill is $5.00. The coins are: 2 Quarters = 50¢, 3 Dimes = 30¢. Total coins = 80¢.',
      hint2: '$5.00 + 80 cents = $5.80.',
      explanation: 'One $5 bill + two Quarters (50¢) + three Dimes (30¢) = $5.80.',
      options: ['$5.50', '$5.60', '$5.80', '$6.00'],
      correctAnswer: '$5.80'
    },
    {
      id: 'w3_q2',
      world: 3,
      type: 'compare_wallets',
      questionText: 'Wallet A has one $10 bill. Wallet B has two $5 bills and four Quarters. Which wallet has MORE money?',
      visual: 'compare_wallets',
      walletA: { notes: { 10: 1 }, coins: {} },
      walletB: { notes: { 5: 2 }, coins: { quarter: 4 } },
      hint1: 'Wallet A: $10.00. Wallet B: two $5 bills ($10) + four Quarters ($1) = $11.00.',
      hint2: 'Compare $10.00 and $11.00.',
      explanation: 'Wallet A has $10. Wallet B has $11 (since 4 Quarters make $1). So Wallet B has more.',
      options: ['Wallet A', 'Wallet B', 'They are equal'],
      correctAnswer: 'Wallet B'
    },
    {
      id: 'w3_q3',
      world: 3,
      type: 'exact_amount',
      questionText: 'Sophia wants to buy a toy sword that costs $6.25. Which set of money is EXACTLY correct?',
      visual: 'toy_shop',
      hint1: 'Look for $6 (a $5 bill and a $1 bill) and 25 cents (a quarter).',
      hint2: '$5 + $1 + 25¢ = $6.25.',
      explanation: 'A $5 bill, a $1 bill, and 1 Quarter equal exactly $6.25.',
      options: [
        'One $5 note, one Quarter',
        'One $5 note, one $1 note, one Quarter',
        'One $10 note, one Quarter',
        'One $5 note, one $1 note, one Dime'
      ],
      correctAnswer: 'One $5 note, one $1 note, one Quarter'
    },
    {
      id: 'w3_q4',
      world: 3,
      type: 'exact_amount',
      questionText: 'Which of the following makes exactly 50 cents in coins?',
      visual: 'coin_exchange',
      hint1: 'Dimes are 10¢, Quarters are 25¢, Nickels are 5¢.',
      hint2: '5 Dimes = 50¢, or 2 Quarters = 50¢.',
      explanation: 'Two Quarters equal 50 cents (25¢ + 25¢ = 50¢).',
      options: ['3 Dimes', '2 Quarters', '4 Nickels', '1 Quarter and 1 Dime'],
      correctAnswer: '2 Quarters'
    },
    {
      id: 'w3_q5',
      world: 3,
      type: 'compare_wallets',
      questionText: 'True or False: 10 Dimes has the EXACT same value as 1 Dollar Bill.',
      visual: 'compare_dimes_dollar',
      hint1: '10 Dimes: skip-count by 10s ten times = 100 cents.',
      hint2: '100 cents is equal to 1 Dollar.',
      explanation: 'True! 10 Dimes = 100 cents, which is equal to 1 Dollar ($1.00).',
      options: ['True', 'False'],
      correctAnswer: 'True'
    },
    {
      id: 'w3_q6',
      world: 3,
      type: 'exact_amount',
      questionText: 'Mike wants to pay $12.50 for a shield. Which combination uses the FEWEST notes and coins?',
      visual: 'toy_shop',
      hint1: 'Use the largest possible denominations: a $10 bill, a $2 bill (or two $1 bills) or a $10, a $5... wait, for $12.50, we can use a $10 note, two $1 notes, and a Quarter... wait, or a $10 note, two $1 notes, and two Dimes and a Nickel?',
      hint2: 'A $10 note, two $1 notes, and 2 Quarters is the fewest pieces of money (5 items total).',
      explanation: 'A $10 bill, two $1 bills, and 2 Quarters (which equal 50¢) is the fewest pieces of money to make $12.50.',
      options: [
        'Twelve $1 bills and two Quarters',
        'One $10 bill, two $1 bills, and two Quarters',
        'One $10 bill, five Dimes',
        'Two $5 bills, two $1 bills, and five Nickels'
      ],
      correctAnswer: 'One $10 bill, two $1 bills, and two Quarters'
    }
  ],

  // WORLD 4: TREASURE CHECKOUT (Making Change & Word Problems)
  [
    {
      id: 'w4_q1',
      world: 4,
      type: 'change_making',
      questionText: 'Liam buys a book for $7. He pays with a $10 bill. How much change should he get back?',
      visual: 'word_problem',
      hint1: 'Subtract the cost from the paid amount: $10 - $7.',
      hint2: 'Count up from $7 to $10: 8, 9, 10. That is $3.',
      explanation: '$10 paid minus $7 cost leaves $3 in change.',
      options: ['$2', '$3', '$4', '$5'],
      correctAnswer: '$3'
    },
    {
      id: 'w4_q2',
      world: 4,
      type: 'word_problem_change',
      questionText: 'Sophia buys a magic wand for $15. She hands the shopkeeper a $20 bill. What change does she receive?',
      visual: 'word_problem',
      hint1: 'Subtract the price from the payment: $20 - $15.',
      hint2: '20 minus 15 is 5.',
      explanation: 'Sophia paid $20 for a $15 item. $20 - $15 = $5 change.',
      options: ['$2', '$3', '$5', '$10'],
      correctAnswer: '$5'
    },
    {
      id: 'w4_q3',
      world: 4,
      type: 'change_making',
      questionText: 'A toy shield costs 60 cents. Mike pays with 3 Quarters (75¢). How much change does he get back?',
      visual: 'word_problem',
      hint1: '3 Quarters = 75 cents. Subtract 60 cents: 75 - 60.',
      hint2: '75 minus 60 is 15 cents.',
      explanation: 'Mike paid 75¢ for a 60¢ shield. 75¢ - 60¢ = 15¢ change (which can be a dime and a nickel).',
      options: ['5 cents', '10 cents', '15 cents', '25 cents'],
      correctAnswer: '15 cents'
    },
    {
      id: 'w4_q4',
      world: 4,
      type: 'two_step_problem',
      questionText: 'Emma buys an apple for $2 and a sandwich for $5. She pays with a $10 bill. How much change does she get?',
      visual: 'word_problem',
      hint1: 'Step 1: Find the total cost. $2 + $5 = $7. Step 2: Subtract total from payment. $10 - $7.',
      hint2: 'Total cost is $7. Change is $10 - $7 = $3.',
      explanation: 'First add the items: $2 + $5 = $7 total. Then subtract from payment: $10 - $7 = $3 change.',
      options: ['$2', '$3', '$4', '$5'],
      correctAnswer: '$3'
    },
    {
      id: 'w4_q5',
      world: 4,
      type: 'two_step_problem',
      questionText: 'Priya has $15. She buys two toy cars that cost $4 each. How much money does she have left?',
      visual: 'word_problem',
      hint1: 'Step 1: Calculate cost of 2 cars: $4 + $4 = $8. Step 2: Subtract from Priya\'s money: $15 - $8.',
      hint2: '$15 minus $8 is $7.',
      explanation: 'Two cars cost: 2 × $4 = $8. Priya has left: $15 - $8 = $7.',
      options: ['$5', '$7', '$8', '$9'],
      correctAnswer: '$7'
    },
    {
      id: 'w4_q6',
      world: 4,
      type: 'change_making',
      questionText: 'Raju buys a juice box for 85 cents. He pays with a $1 bill (100¢). How much change does he get?',
      visual: 'word_problem',
      hint1: 'Subtract 85 from 100 cents: 100 - 85.',
      hint2: '100 - 85 equals 15 cents.',
      explanation: 'Raju paid 100¢ (1 Dollar) for a 85¢ juice. 100¢ - 85¢ = 15¢ change.',
      options: ['5 cents', '10 cents', '15 cents', '25 cents'],
      correctAnswer: '15 cents'
    }
  ]
];

export function generateSessionQuestions() {
  const bank = [];
  QUESTIONS_DATA.forEach(worldQList => {
    worldQList.forEach(q => {
      bank.push({ ...q });
    });
  });
  return bank;
}