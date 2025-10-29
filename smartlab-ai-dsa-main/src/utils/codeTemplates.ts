export const codeTemplates: Record<string, Record<string, string>> = {
  // Array Problems
  'two-sum': {
    javascript: `// Two Sum - Find indices of two numbers that add up to target
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}

// Test
console.log(twoSum([2, 7, 11, 15], 9));`,
    
    python: `# Two Sum - Find indices of two numbers that add up to target
def two_sum(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    
    return []

# Test
print(two_sum([2, 7, 11, 15], 9))`,
    
    java: `// Two Sum - Find indices of two numbers that add up to target
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] {map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        
        return new int[] {};
    }
    
    public static void main(String[] args) {
        int[] result = twoSum(new int[] {2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(result));
    }
}`,
    
    cpp: `// Two Sum - Find indices of two numbers that add up to target
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> result = twoSum(nums, 9);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}`
  },

  'best-time-to-buy-sell-stock': {
    javascript: `// Best Time to Buy and Sell Stock
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (let price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  
  return maxProfit;
}

// Test
console.log(maxProfit([7, 1, 5, 3, 6, 4]));`,
    
    python: `# Best Time to Buy and Sell Stock
def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    
    return max_profit

# Test
print(max_profit([7, 1, 5, 3, 6, 4]))`,
  },

  'maximum-subarray': {
    javascript: `// Maximum Subarray - Kadane's Algorithm
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// Test
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`,
    
    python: `# Maximum Subarray - Kadane's Algorithm
def max_sub_array(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum

# Test
print(max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`,
  },
  
  // String Problems
  'reverse-string': {
    javascript: `// Reverse a string
function reverseString(s) {
  return s.split('').reverse().join('');
}

// Test
console.log(reverseString('hello'));`,
    
    python: `# Reverse a string
def reverse_string(s):
    return s[::-1]

# Test
print(reverse_string('hello'))`,
    
    java: `// Reverse a string
public class Main {
    public static String reverseString(String s) {
        return new StringBuilder(s).reverse().toString();
    }
    
    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`,
    
    cpp: `// Reverse a string
#include <iostream>
#include <algorithm>
using namespace std;

string reverseString(string s) {
    reverse(s.begin(), s.end());
    return s;
}

int main() {
    cout << reverseString("hello") << endl;
    return 0;
}`
  },
  
  'palindrome': {
    javascript: `// Check if string is palindrome
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return s === s.split('').reverse().join('');
}

// Test
console.log(isPalindrome('A man, a plan, a canal: Panama'));`,
    
    python: `# Check if string is palindrome
def is_palindrome(s):
    s = ''.join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]

# Test
print(is_palindrome('A man, a plan, a canal: Panama'))`,
    
    java: `// Check if string is palindrome
public class Main {
    public static boolean isPalindrome(String s) {
        s = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left++) != s.charAt(right--)) return false;
        }
        return true;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    }
}`,
    
    cpp: `// Check if string is palindrome
#include <iostream>
#include <algorithm>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    string cleaned = "";
    for (char c : s) {
        if (isalnum(c)) cleaned += tolower(c);
    }
    string reversed = cleaned;
    reverse(reversed.begin(), reversed.end());
    return cleaned == reversed;
}

int main() {
    cout << (isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false") << endl;
    return 0;
}`
  },

  'longest-substring': {
    javascript: `// Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  let maxLen = 0;
  let start = 0;
  const charMap = new Map();
  
  for (let end = 0; end < s.length; end++) {
    if (charMap.has(s[end])) {
      start = Math.max(start, charMap.get(s[end]) + 1);
    }
    charMap.set(s[end], end);
    maxLen = Math.max(maxLen, end - start + 1);
  }
  
  return maxLen;
}

// Test
console.log(lengthOfLongestSubstring("abcabcbb"));`,
    
    python: `# Longest Substring Without Repeating Characters
def length_of_longest_substring(s):
    max_len = 0
    start = 0
    char_map = {}
    
    for end in range(len(s)):
        if s[end] in char_map:
            start = max(start, char_map[s[end]] + 1)
        char_map[s[end]] = end
        max_len = max(max_len, end - start + 1)
    
    return max_len

# Test
print(length_of_longest_substring("abcabcbb"))`,
  },

  // Stack Problems
  'valid-parentheses': {
    javascript: `// Valid Parentheses
function isValid(s) {
  const stack = [];
  const pairs = { '(': ')', '{': '}', '[': ']' };
  
  for (let char of s) {
    if (char in pairs) {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (pairs[top] !== char) return false;
    }
  }
  
  return stack.length === 0;
}

// Test
console.log(isValid("()[]{}"));`,
    
    python: `# Valid Parentheses
def is_valid(s):
    stack = []
    pairs = {'(': ')', '{': '}', '[': ']'}
    
    for char in s:
        if char in pairs:
            stack.append(char)
        else:
            if not stack or pairs[stack.pop()] != char:
                return False
    
    return len(stack) == 0

# Test
print(is_valid("()[]{}"))`,
  },

  'min-stack': {
    javascript: `// Min Stack
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  
  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0 ? val : 
                Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min);
  }
  
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  
  top() {
    return this.stack[this.stack.length - 1];
  }
  
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// Test
const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin());`,
    
    python: `# Min Stack
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        min_val = val if not self.min_stack else min(val, self.min_stack[-1])
        self.min_stack.append(min_val)
    
    def pop(self):
        self.stack.pop()
        self.min_stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def get_min(self):
        return self.min_stack[-1]

# Test
min_stack = MinStack()
min_stack.push(-2)
min_stack.push(0)
min_stack.push(-3)
print(min_stack.get_min())`,
  },

  // Queue Problems
  'implement-queue-using-stacks': {
    javascript: `// Implement Queue using Stacks
class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  
  push(x) {
    this.inStack.push(x);
  }
  
  pop() {
    this._transfer();
    return this.outStack.pop();
  }
  
  peek() {
    this._transfer();
    return this.outStack[this.outStack.length - 1];
  }
  
  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
  
  _transfer() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
  }
}

// Test
const queue = new MyQueue();
queue.push(1);
queue.push(2);
console.log(queue.peek());`,
    
    python: `# Implement Queue using Stacks
class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []
    
    def push(self, x):
        self.in_stack.append(x)
    
    def pop(self):
        self._transfer()
        return self.out_stack.pop()
    
    def peek(self):
        self._transfer()
        return self.out_stack[-1]
    
    def empty(self):
        return len(self.in_stack) == 0 and len(self.out_stack) == 0
    
    def _transfer(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

# Test
queue = MyQueue()
queue.push(1)
queue.push(2)
print(queue.peek())`,
  },

  'circular-queue': {
    javascript: `// Design Circular Queue
class MyCircularQueue {
  constructor(k) {
    this.queue = new Array(k);
    this.size = k;
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }
  
  enQueue(value) {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.size;
    this.queue[this.rear] = value;
    this.count++;
    return true;
  }
  
  deQueue() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.size;
    this.count--;
    return true;
  }
  
  Front() {
    return this.isEmpty() ? -1 : this.queue[this.front];
  }
  
  Rear() {
    return this.isEmpty() ? -1 : this.queue[this.rear];
  }
  
  isEmpty() {
    return this.count === 0;
  }
  
  isFull() {
    return this.count === this.size;
  }
}

// Test
const cq = new MyCircularQueue(3);
console.log(cq.enQueue(1));
console.log(cq.enQueue(2));`,
    
    python: `# Design Circular Queue
class MyCircularQueue:
    def __init__(self, k):
        self.queue = [None] * k
        self.size = k
        self.front = 0
        self.rear = -1
        self.count = 0
    
    def enQueue(self, value):
        if self.isFull():
            return False
        self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = value
        self.count += 1
        return True
    
    def deQueue(self):
        if self.isEmpty():
            return False
        self.front = (self.front + 1) % self.size
        self.count -= 1
        return True
    
    def Front(self):
        return -1 if self.isEmpty() else self.queue[self.front]
    
    def Rear(self):
        return -1 if self.isEmpty() else self.queue[self.rear]
    
    def isEmpty(self):
        return self.count == 0
    
    def isFull(self):
        return self.count == self.size

# Test
cq = MyCircularQueue(3)
print(cq.enQueue(1))
print(cq.enQueue(2))`,
  },

  // Linked List Problems
  'reverse-linked-list': {
    javascript: `// Reverse Linked List
function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}

// Test (assumes ListNode class exists)
console.log("List reversed");`,
    
    python: `# Reverse Linked List
def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    return prev

# Test (assumes ListNode class exists)
print("List reversed")`,
  },

  'detect-cycle': {
    javascript: `// Linked List Cycle Detection
function hasCycle(head) {
  let slow = head;
  let fast = head;
  
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  
  return false;
}

// Test
console.log("Cycle detection implemented");`,
    
    python: `# Linked List Cycle Detection
def has_cycle(head):
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    
    return False

# Test
print("Cycle detection implemented")`,
  },

  // Tree Problems
  'invert-binary-tree': {
    javascript: `// Invert Binary Tree
function invertTree(root) {
  if (root === null) return null;
  
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  
  return root;
}

// Test
console.log("Tree inverted");`,
    
    python: `# Invert Binary Tree
def invert_tree(root):
    if not root:
        return None
    
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

# Test
print("Tree inverted")`,
  },

  'maximum-depth': {
    javascript: `// Maximum Depth of Binary Tree
function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Test
console.log("Max depth calculated");`,
    
    python: `# Maximum Depth of Binary Tree
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Test
print("Max depth calculated")`,
  },

  'validate-bst': {
    javascript: `// Validate Binary Search Tree
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (root === null) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && 
         isValidBST(root.right, root.val, max);
}

// Test
console.log("BST validation implemented");`,
    
    python: `# Validate Binary Search Tree
def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    if root.val <= min_val or root.val >= max_val:
        return False
    return (is_valid_bst(root.left, min_val, root.val) and 
            is_valid_bst(root.right, root.val, max_val))

# Test
print("BST validation implemented")`,
  },

  // Graph Problems
  'number-of-islands': {
    javascript: `// Number of Islands
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  
  let count = 0;
  
  function dfs(i, j) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') {
      return;
    }
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  }
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  
  return count;
}

// Test
console.log(numIslands([["1","1","0"],["1","1","0"],["0","0","1"]]));`,
    
    python: `# Number of Islands
def num_islands(grid):
    if not grid:
        return 0
    
    count = 0
    
    def dfs(i, j):
        if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] == '0':
            return
        grid[i][j] = '0'
        dfs(i + 1, j)
        dfs(i - 1, j)
        dfs(i, j + 1)
        dfs(i, j - 1)
    
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j)
    
    return count

# Test
print(num_islands([["1","1","0"],["1","1","0"],["0","0","1"]]))`,
  },

  'clone-graph': {
    javascript: `// Clone Graph
function cloneGraph(node) {
  if (!node) return null;
  
  const cloned = new Map();
  
  function dfs(node) {
    if (cloned.has(node)) return cloned.get(node);
    
    const copy = new Node(node.val);
    cloned.set(node, copy);
    
    for (let neighbor of node.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }
    
    return copy;
  }
  
  return dfs(node);
}

// Test
console.log("Graph cloned");`,
    
    python: `# Clone Graph
def clone_graph(node):
    if not node:
        return None
    
    cloned = {}
    
    def dfs(node):
        if node in cloned:
            return cloned[node]
        
        copy = Node(node.val)
        cloned[node] = copy
        
        for neighbor in node.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)

# Test
print("Graph cloned")`,
  },

  // Dynamic Programming Problems
  'climbing-stairs': {
    javascript: `// Climbing Stairs
function climbStairs(n) {
  if (n <= 2) return n;
  let prev1 = 2, prev2 = 1;
  
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}

// Test
console.log(climbStairs(5));`,
    
    python: `# Climbing Stairs
def climb_stairs(n):
    if n <= 2:
        return n
    prev1, prev2 = 2, 1
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1

# Test
print(climb_stairs(5))`,
  },

  'coin-change': {
    javascript: `// Coin Change
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Test
console.log(coinChange([1, 2, 5], 11));`,
    
    python: `# Coin Change
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

# Test
print(coin_change([1, 2, 5], 11))`,
  },
};

export const getDefaultTemplate = (language: string): string => {
  const templates: Record<string, string> = {
    javascript: `// Write your code here
function solution() {
  // Your implementation
}

// Test your code
console.log(solution());`,
    
    python: `# Write your code here
def solution():
    # Your implementation
    pass

# Test your code
print(solution())`,
    
    java: `// Write your code here
public class Main {
    public static void solution() {
        // Your implementation
    }
    
    public static void main(String[] args) {
        solution();
    }
}`,
    
    cpp: `// Write your code here
#include <iostream>
using namespace std;

void solution() {
    // Your implementation
}

int main() {
    solution();
    return 0;
}`
  };
  
  return templates[language] || templates.javascript;
};
