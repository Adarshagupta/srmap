import { PracticeLesson } from '@/app/dsa/content';

export const TWO_SUM: PracticeLesson = {
  id: 'two-sum',
  type: 'practice',
  title: 'Two Sum',
  difficulty: 'Easy',
  acceptance: 48.2,
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers in the array such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
    },
    {
      input: 'nums = [3,3], target = 6',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].'
    }
  ],
  hints: [
    'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
    'Try to use the fact that the complement of the current number must exist in the array.',
    'Could you use extra space to help optimize the search time?'
  ],
  solution: `The optimal solution uses a hash map to store the complement of each number we've seen so far:

1. Create an empty hash map to store numbers and their indices
2. Iterate through the array:
   - For each number, calculate its complement (target - current number)
   - If the complement exists in the hash map, we've found our pair
   - Otherwise, add the current number and its index to the hash map
3. Return the indices of the two numbers that sum to target

This approach has a time complexity of O(n) as we only need to traverse the array once, and a space complexity of O(n) to store at most n elements in the hash map.`,
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  companies: [
    { company: 'Amazon', frequency: 'High' },
    { company: 'Google', frequency: 'High' },
    { company: 'Apple', frequency: 'Medium' },
    { company: 'Microsoft', frequency: 'Medium' }
  ],
  topics: ['Array', 'Hash Table'],
  starterCode: {
    python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    pass`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`
  },
  testCases: [
    {
      input: ['[2,7,11,15]', '9'],
      output: ['[0,1]']
    },
    {
      input: ['[3,2,4]', '6'],
      output: ['[1,2]']
    },
    {
      input: ['[3,3]', '6'],
      output: ['[0,1]']
    },
    {
      input: ['[-1,-2,-3,-4,-5]', '-8'],
      output: ['[2,4]']
    }
  ]
}; 