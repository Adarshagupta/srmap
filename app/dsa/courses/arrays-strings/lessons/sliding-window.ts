import { PracticeLesson } from '@/app/dsa/content';

export const SLIDING_WINDOW: PracticeLesson = {
  id: 'sliding-window-maximum',
  type: 'practice',
  title: 'Sliding Window Maximum',
  difficulty: 'Hard',
  acceptance: 45.8,
  description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.

Return the maximum element in each sliding window.`,
  examples: [
    {
      input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
      output: '[3,3,5,5,6,7]',
      explanation: `Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7    3
 1 [3  -1  -3] 5  3  6  7    3
 1  3 [-1  -3  5] 3  6  7    5
 1  3  -1 [-3  5  3] 6  7    5
 1  3  -1  -3 [5  3  6] 7    6
 1  3  -1  -3  5 [3  6  7]   7`
    },
    {
      input: 'nums = [1], k = 1',
      output: '[1]',
      explanation: 'There is only one element in the window.'
    },
    {
      input: 'nums = [1,-1], k = 1',
      output: '[1,-1]',
      explanation: 'Each element appears in exactly one window.'
    }
  ],
  hints: [
    'How about using a data structure that can efficiently find the maximum element in a range?',
    'A deque (double-ended queue) can be used to maintain candidates for maximum elements',
    'Think about what elements in the window can never be the maximum'
  ],
  solution: `The optimal solution uses a deque (double-ended queue) to maintain potential maximum elements:

1. Create a deque to store indices of potential maximum elements
2. Process first k elements:
   - Remove elements smaller than current element from back of deque
   - Add current index to back of deque
3. For each remaining element:
   - Add first element of deque to result (it's the max of previous window)
   - Remove elements outside current window from front of deque
   - Remove elements smaller than current element from back of deque
   - Add current index to back of deque
4. Add the maximum of last window to result

This approach maintains a monotonic decreasing deque, where elements are both chronologically ordered (by index) and ordered by value.
The front of the deque always contains the maximum element's index for the current window.`,
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(k)',
  companies: [
    { company: 'Amazon', frequency: 'High' },
    { company: 'Google', frequency: 'High' },
    { company: 'Microsoft', frequency: 'Medium' },
    { company: 'Meta', frequency: 'Medium' },
    { company: 'Apple', frequency: 'Medium' }
  ],
  topics: ['Array', 'Queue', 'Sliding Window', 'Heap', 'Monotonic Queue'],
  starterCode: {
    python: `def maxSlidingWindow(nums: List[int], k: int) -> List[int]:
    # Write your code here
    pass`,
    cpp: `class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        // Write your code here
        return {};
    }
};`,
    java: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // Write your code here
        return new int[]{};
    }
}`
  },
  testCases: [
    {
      input: ['[1,3,-1,-3,5,3,6,7]', '3'],
      output: ['[3,3,5,5,6,7]']
    },
    {
      input: ['[1]', '1'],
      output: ['[1]']
    },
    {
      input: ['[1,-1]', '1'],
      output: ['[1,-1]']
    },
    {
      input: ['[7,2,4]', '2'],
      output: ['[7,4]']
    },
    {
      input: ['[1,3,1,2,0,5]', '3'],
      output: ['[3,3,2,5]']
    }
  ]
}; 