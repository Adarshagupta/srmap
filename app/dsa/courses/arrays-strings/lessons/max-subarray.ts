import { PracticeLesson } from '@/app/dsa/content';

export const MAX_SUBARRAY: PracticeLesson = {
  id: 'max-subarray',
  type: 'practice',
  title: 'Maximum Subarray',
  difficulty: 'Medium',
  acceptance: 49.7,
  description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
  examples: [
    {
      input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
      output: '6',
      explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
    },
    {
      input: 'nums = [1]',
      output: '1',
      explanation: 'The single element forms the subarray with the maximum sum.'
    },
    {
      input: 'nums = [5,4,-1,7,8]',
      output: '23',
      explanation: 'The entire array [5,4,-1,7,8] has the largest sum 23.'
    }
  ],
  hints: [
    'If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach.',
    'Think about how you would solve this problem if all numbers were positive.',
    'How would you handle negative numbers? Can you modify Kadane\'s algorithm?'
  ],
  solution: `The optimal solution uses Kadane's algorithm with O(n) time complexity:

1. Initialize two variables:
   - maxSoFar = nums[0] (to track the maximum sum found so far)
   - maxEndingHere = nums[0] (to track the maximum sum ending at current position)
2. Iterate through the array starting from index 1:
   - For each number, update maxEndingHere = max(nums[i], maxEndingHere + nums[i])
   - Update maxSoFar = max(maxSoFar, maxEndingHere)
3. Return maxSoFar

This approach works by maintaining the maximum sum of a subarray that ends at each position.
At each step, we either start a new subarray from the current element or extend the existing subarray.`,
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  companies: [
    { company: 'Amazon', frequency: 'High' },
    { company: 'Microsoft', frequency: 'High' },
    { company: 'Apple', frequency: 'Medium' },
    { company: 'Google', frequency: 'Medium' },
    { company: 'Meta', frequency: 'Medium' }
  ],
  topics: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
  starterCode: {
    python: `def maxSubArray(nums: List[int]) -> int:
    # Write your code here
    pass`,
    cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your code here
        return 0;
    }
};`,
    java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }
}`
  },
  testCases: [
    {
      input: ['[-2,1,-3,4,-1,2,1,-5,4]'],
      output: ['6']
    },
    {
      input: ['[1]'],
      output: ['1']
    },
    {
      input: ['[5,4,-1,7,8]'],
      output: ['23']
    },
    {
      input: ['[-1]'],
      output: ['-1']
    },
    {
      input: ['[-2,-1]'],
      output: ['-1']
    }
  ]
}; 