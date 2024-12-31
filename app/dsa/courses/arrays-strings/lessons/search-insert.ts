import { Lesson } from '../../../content';

export const SEARCH_INSERT: Lesson = {
  type: 'practice',
  title: 'Search Insert Position',
  difficulty: 'Easy',
  description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with O(log n) runtime complexity.`,
  examples: [
    {
      input: 'nums = [1, 3, 5, 6], target = 5',
      output: '2',
      explanation: 'Target 5 is found at index 2'
    },
    {
      input: 'nums = [1, 3, 5, 6], target = 2',
      output: '1',
      explanation: '2 would be inserted at index 1'
    },
    {
      input: 'nums = [1, 3, 5, 6], target = 7',
      output: '4',
      explanation: '7 would be inserted at index 4'
    }
  ],
  starterCode: {
    python: `def search_insert(nums: list, target: int) -> int:
    """
    Find index where target is or should be inserted
    
    Args:
        nums: Sorted list of distinct integers
        target: Number to find/insert
    
    Returns:
        Index where target is found or should be inserted
    """
    # Your code here
    pass`,
    cpp: `int searchInsert(vector<int>& nums, int target) {
    // Your code here
}`,
    java: `public int searchInsert(int[] nums, int target) {
    // Your code here
}`
  },
  testCases: [
    {
      input: ['[1, 3, 5, 6]', '5'],
      output: [2]
    },
    {
      input: ['[1, 3, 5, 6]', '2'],
      output: [1]
    },
    {
      input: ['[1, 3, 5, 6]', '7'],
      output: [4]
    },
    {
      input: ['[1, 3, 5, 6]', '0'],
      output: [0]
    }
  ],
  hints: [
    'Use binary search to achieve O(log n)',
    'When target not found, left pointer indicates insertion position',
    'Handle edge cases: target smaller than first or larger than last element'
  ],
  solution: `def search_insert(nums: list, target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return left  # left pointer gives insertion position`,
  timeComplexity: 'O(log n) where n is length of array',
  spaceComplexity: 'O(1) as we only use a few variables'
}; 