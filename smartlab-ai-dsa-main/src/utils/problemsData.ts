export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  testCases: { input: string; expected: string; description: string }[];
  hints: string[];
  topics: string[];
}

export const stackProblems: Problem[] = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    examples: [
      { input: 's = "()"', output: "true", explanation: "The string has matching parentheses." },
      { input: 's = "()[]{}"', output: "true", explanation: "All brackets are properly matched and nested." },
      { input: 's = "(]"', output: "false", explanation: "Mismatched bracket types." },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
    testCases: [
      { input: "()", expected: "true", description: "Single pair" },
      { input: "()[]{}", expected: "true", description: "Multiple pairs" },
      { input: "(]", expected: "false", description: "Mismatched" },
    ],
    hints: ["Use a stack to keep track of opening brackets", "When you encounter a closing bracket, check if it matches the top of the stack"],
    topics: ["Stack", "String"],
  },
  {
    id: "min-stack",
    title: "Min Stack",
    difficulty: "Medium",
    description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with methods: push(val), pop(), top(), and getMin().",
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]', output: "[null,null,null,null,-3,null,0,-2]", explanation: "Operations maintain minimum tracking." },
    ],
    constraints: ["-2^31 <= val <= 2^31 - 1", "Methods pop, top and getMin will always be called on non-empty stacks"],
    testCases: [
      { input: "push(-2), push(0), push(-3), getMin()", expected: "-3", description: "Get min after pushes" },
      { input: "pop(), top(), getMin()", expected: "0, -2", description: "After popping min" },
    ],
    hints: ["Keep track of the minimum value at each level", "Use an auxiliary stack or store pairs"],
    topics: ["Stack", "Design"],
  },
];

export const queueProblems: Problem[] = [
  {
    id: "implement-queue-using-stacks",
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).",
    examples: [
      { input: '["MyQueue", "push", "push", "peek", "pop", "empty"]', output: "[null, null, null, 1, 1, false]", explanation: "Queue operations using two stacks." },
    ],
    constraints: ["1 <= x <= 9", "At most 100 calls will be made to push, pop, peek, and empty"],
    testCases: [
      { input: "push(1), push(2), peek()", expected: "1", description: "Peek front" },
      { input: "pop(), empty()", expected: "1, false", description: "Pop and check empty" },
    ],
    hints: ["Use one stack for enqueue and another for dequeue", "Transfer elements when needed"],
    topics: ["Queue", "Stack", "Design"],
  },
  {
    id: "circular-queue",
    title: "Design Circular Queue",
    difficulty: "Medium",
    description: "Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO principle and the last position is connected back to the first position to make a circle.",
    examples: [
      { input: '["MyCircularQueue","enQueue","enQueue","enQueue","enQueue","Rear","isFull"]', output: "[null,true,true,true,false,2,true]", explanation: "Circular queue with size 3." },
    ],
    constraints: ["1 <= k <= 1000", "0 <= value <= 1000"],
    testCases: [
      { input: "MyCircularQueue(3), enQueue(1), enQueue(2), enQueue(3)", expected: "true, true, true", description: "Fill queue" },
      { input: "enQueue(4), Rear(), isFull()", expected: "false, 3, true", description: "Queue full" },
    ],
    hints: ["Use an array with front and rear pointers", "Handle wrap-around using modulo operation"],
    topics: ["Queue", "Array", "Design"],
  },
];

export const linkedListProblems: Problem[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "The list is reversed." },
      { input: "head = [1,2]", output: "[2,1]", explanation: "Two node list reversed." },
    ],
    constraints: ["The number of nodes in the list is the range [0, 5000]", "-5000 <= Node.val <= 5000"],
    testCases: [
      { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]", description: "Standard reversal" },
      { input: "[1,2]", expected: "[2,1]", description: "Two nodes" },
      { input: "[]", expected: "[]", description: "Empty list" },
    ],
    hints: ["Use three pointers: previous, current, and next", "Iterate and change the direction of pointers"],
    topics: ["Linked List", "Recursion"],
  },
  {
    id: "detect-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle, otherwise return false.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle where the tail connects to the 1st node." },
      { input: "head = [1], pos = -1", output: "false", explanation: "There is no cycle in the linked list." },
    ],
    constraints: ["The number of the nodes in the list is in the range [0, 10^4]", "-10^5 <= Node.val <= 10^5"],
    testCases: [
      { input: "[3,2,0,-4], pos=1", expected: "true", description: "Cycle exists" },
      { input: "[1], pos=-1", expected: "false", description: "No cycle" },
    ],
    hints: ["Use Floyd's cycle detection algorithm (tortoise and hare)", "Two pointers with different speeds"],
    topics: ["Linked List", "Two Pointers"],
  },
];

export const arrayProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
    ],
    constraints: ["2 <= nums.length <= 10^4"],
    testCases: [
      { input: "nums=[2,7,11,15], target=9", expected: "[0, 1]", description: "Basic case" },
    ],
    hints: ["Use a hash map"],
    topics: ["Array", "Hash Table"],
  },
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
    ],
    constraints: ["1 <= prices.length <= 10^5"],
    testCases: [
      { input: "[7,1,5,3,6,4]", expected: "5", description: "Buy low, sell high" },
    ],
    hints: ["Track minimum price seen so far"],
    topics: ["Array", "Dynamic Programming"],
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
    ],
    constraints: ["1 <= nums.length <= 10^5"],
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6", description: "Mixed positive negative" },
    ],
    hints: ["Use Kadane's algorithm"],
    topics: ["Array", "Dynamic Programming"],
  },
];

export const stringProblems: Problem[] = [
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    examples: [
      { input: 's = "hello"', output: '"olleh"', explanation: "The string is reversed in place." },
    ],
    constraints: ["1 <= s.length <= 10^5"],
    testCases: [
      { input: "hello", expected: "olleh", description: "Basic string" },
    ],
    hints: ["Use two pointers approach"],
    topics: ["Two Pointers", "String"],
  },
  {
    id: "palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    description: "A phrase is a palindrome if it reads the same forward and backward after converting all uppercase letters into lowercase and removing all non-alphanumeric characters.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: 'After cleaning: "amanaplanacanalpanama"' },
    ],
    constraints: ["1 <= s.length <= 2 * 10^5"],
    testCases: [
      { input: "A man, a plan, a canal: Panama", expected: "true", description: "Classic palindrome" },
    ],
    hints: ["Clean the string first"],
    topics: ["Two Pointers", "String"],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    testCases: [
      { input: "abcabcbb", expected: "3", description: "Sliding window" },
    ],
    hints: ["Use sliding window with hash set"],
    topics: ["String", "Sliding Window", "Hash Table"],
  },
];

export const treeProblems: Problem[] = [
  {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, invert the tree, and return its root.",
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "The tree is inverted." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100]"],
    testCases: [
      { input: "[4,2,7,1,3,6,9]", expected: "[4,7,2,9,6,3,1]", description: "Swap all children" },
    ],
    hints: ["Recursively swap left and right children"],
    topics: ["Tree", "Binary Tree", "Recursion"],
  },
  {
    id: "maximum-depth",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    description: "Given the root of a binary tree, return its maximum depth. Maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "The maximum depth is 3." },
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 10^4]"],
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expected: "3", description: "Count levels" },
    ],
    hints: ["Use recursion: 1 + max(left depth, right depth)"],
    topics: ["Tree", "Binary Tree", "DFS"],
  },
  {
    id: "validate-bst",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree contains only nodes with keys greater than the node's key.",
    examples: [
      { input: "root = [2,1,3]", output: "true", explanation: "Valid BST." },
      { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "The root node's value is 5 but its right child's value is 4." },
    ],
    constraints: ["The number of nodes in the tree is in the range [1, 10^4]"],
    testCases: [
      { input: "[2,1,3]", expected: "true", description: "Valid BST" },
      { input: "[5,1,4,null,null,3,6]", expected: "false", description: "Invalid BST" },
    ],
    hints: ["Keep track of valid range for each node", "Use in-order traversal"],
    topics: ["Tree", "Binary Search Tree", "DFS"],
  },
];

export const graphProblems: Problem[] = [
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: "2", explanation: "Two islands detected." },
    ],
    constraints: ["m == grid.length", "n == grid[i].length"],
    testCases: [
      { input: '[["1","1","0"],["1","1","0"],["0","0","1"]]', expected: "2", description: "Two islands" },
    ],
    hints: ["Use DFS or BFS to mark visited islands"],
    topics: ["Graph", "DFS", "BFS", "Matrix"],
  },
  {
    id: "clone-graph",
    title: "Clone Graph",
    difficulty: "Medium",
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    examples: [
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]", explanation: "Graph cloned." },
    ],
    constraints: ["The number of nodes in the graph is in the range [0, 100]"],
    testCases: [
      { input: "[[2,4],[1,3],[2,4],[1,3]]", expected: "[[2,4],[1,3],[2,4],[1,3]]", description: "Clone all nodes" },
    ],
    hints: ["Use a hash map to store original to clone mapping", "DFS or BFS traversal"],
    topics: ["Graph", "DFS", "BFS", "Hash Table"],
  },
];

export const dpProblems: Problem[] = [
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step, 2. 2 steps" },
      { input: "n = 3", output: "3", explanation: "1. 1+1+1, 2. 1+2, 3. 2+1" },
    ],
    constraints: ["1 <= n <= 45"],
    testCases: [
      { input: "2", expected: "2", description: "Two ways" },
      { input: "3", expected: "3", description: "Three ways" },
    ],
    hints: ["This is a Fibonacci sequence problem", "Use dynamic programming"],
    topics: ["Dynamic Programming", "Math"],
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount cannot be made up, return -1.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1"],
    testCases: [
      { input: "coins=[1,2,5], amount=11", expected: "3", description: "Minimum coins" },
    ],
    hints: ["Use DP array where dp[i] = minimum coins for amount i"],
    topics: ["Dynamic Programming", "Array"],
  },
];

export const allProblems: Problem[] = [
  ...arrayProblems,
  ...stringProblems,
  ...stackProblems,
  ...queueProblems,
  ...linkedListProblems,
  ...treeProblems,
  ...graphProblems,
  ...dpProblems,
];
