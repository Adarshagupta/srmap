import { ChapterContent } from '../../../content';

export const DYNAMIC_PROGRAMMING_LESSONS: Record<number, ChapterContent> = {
  0: { // Introduction to Dynamic Programming
    0: { // DP Basics
      type: 'concept',
      title: 'Dynamic Programming Basics',
      duration: '30 min',
      content: `# Dynamic Programming

## What is Dynamic Programming?
Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems.

## Key Concepts
1. **Optimal Substructure**
   - Problem can be solved using solutions to its subproblems
   - Example: Fibonacci numbers

2. **Overlapping Subproblems**
   - Same subproblems are encountered multiple times
   - Solutions can be stored and reused

## Approaches
1. **Top-Down (Memoization)**
\`\`\`python
def fibonacci(n, memo=None):
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]
\`\`\`

2. **Bottom-Up (Tabulation)**
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
\`\`\`

## Common Patterns
1. Linear Sequences
2. Grid Problems
3. String Problems
4. Decision Making

## Steps to Solve DP Problems
1. Define subproblems
2. Write recurrence relation
3. Identify base cases
4. Choose implementation approach
5. Optimize space if needed

## Common Problems
1. Fibonacci Numbers
2. Longest Common Subsequence
3. Knapsack Problem
4. Coin Change
5. Matrix Chain Multiplication

## Video Resources
1. [Dynamic Programming Introduction](https://www.youtube.com/watch?v=vYquumk4nWw)
2. [Memoization vs Tabulation](https://www.youtube.com/watch?v=dQw4w9WgXcQ)`,
      examples: [
        {
          input: 'fibonacci(5)',
          output: '5',
          explanation: 'fib(5) = fib(4) + fib(3) = 3 + 2 = 5'
        }
      ]
    },
    1: { // Fibonacci Numbers
      type: 'practice',
      id: 'fibonacci-numbers',
      title: 'Fibonacci Numbers',
      difficulty: 'Easy',
      description: 'Write a function to calculate the nth Fibonacci number using dynamic programming.',
      examples: [
        {
          input: 'n = 5',
          output: '5',
          explanation: 'fib(5) = fib(4) + fib(3) = 3 + 2 = 5'
        }
      ],
      starterCode: {
        python: `def fibonacci(n: int) -> int:
    """
    Calculate nth Fibonacci number
    
    Args:
        n: Position in Fibonacci sequence
    
    Returns:
        nth Fibonacci number
    """
    # Your code here
    pass`,
        cpp: `int fibonacci(int n) {
    // Your code here
    return 0;
}`,
        java: `public int fibonacci(int n) {
    // Your code here
    return 0;
}`
      },
      testCases: [
        {
          input: ['5'],
          output: ['5']
        },
        {
          input: ['10'],
          output: ['55']
        }
      ],
      hints: [
        'Use an array to store previous values',
        'Consider base cases n=0 and n=1',
        'Each number is sum of previous two'
      ],
      solution: `def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]`,
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)'
    }
  },
  1: { // Advanced DP Problems
    0: { // Longest Common Subsequence
      type: 'practice',
      id: 'longest-common-subsequence',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      description: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
      examples: [
        {
          input: 'text1 = "abcde", text2 = "ace"',
          output: '3',
          explanation: 'LCS is "ace"'
        }
      ],
      starterCode: {
        python: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    """
    Find length of longest common subsequence
    
    Args:
        text1: First string
        text2: Second string
    
    Returns:
        Length of LCS
    """
    # Your code here
    pass`,
        cpp: `int longestCommonSubsequence(string text1, string text2) {
    // Your code here
    return 0;
}`,
        java: `public int longestCommonSubsequence(String text1, String text2) {
    // Your code here
    return 0;
}`
      },
      testCases: [
        {
          input: ['"abcde"', '"ace"'],
          output: ['3']
        },
        {
          input: ['"abc"', '"abc"'],
          output: ['3']
        },
        {
          input: ['"abc"', '"def"'],
          output: ['0']
        }
      ],
      hints: [
        'Use 2D DP table',
        'Consider characters match/mismatch',
        'Fill table row by row'
      ],
      solution: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]`,
      timeComplexity: 'O(mn) where m, n are string lengths',
      spaceComplexity: 'O(mn) for DP table'
    }
  }
}; 