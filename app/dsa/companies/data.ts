import { Problem } from '../problems/types';

export interface Company {
  id: string;
  name: string;
  logo: string;
  problems: Problem[];
}

export const COMPANIES: Company[] = [
  {
    id: 'google',
    name: 'Google',
    logo: '/companies/google.svg',
    problems: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        acceptance: '48.1%',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          }
        ],
        constraints: [
          '2 <= nums.length <= 104',
          '-109 <= nums[i] <= 109',
          '-109 <= target <= 109',
          'Only one valid answer exists.'
        ],
        starterCode: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
};`,
        testCases: [
          {
            input: [[2,7,11,15], 9],
            output: [0,1]
          },
          {
            input: [[3,2,4], 6],
            output: [1,2]
          },
          {
            input: [[3,3], 6],
            output: [0,1]
          }
        ]
      }
    ]
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: '/companies/meta.svg',
    problems: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        acceptance: '40.1%',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        examples: [
          {
            input: 's = "()"',
            output: 'true',
            explanation: 'The brackets match.'
          }
        ],
        constraints: [
          '1 <= s.length <= 104',
          's consists of parentheses only \'()[]{}\''
        ],
        starterCode: `function isValid(s: string): boolean {
    // Write your code here
};`,
        testCases: [
          {
            input: ["()"],
            output: true
          },
          {
            input: ["()[]{}"],
            output: true
          },
          {
            input: ["(]"],
            output: false
          }
        ]
      }
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '/companies/microsoft.svg',
    problems: [
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        acceptance: '70.2%',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        examples: [
          {
            input: 'head = [1,2,3,4,5]',
            output: '[5,4,3,2,1]',
            explanation: 'The linked list is reversed.'
          }
        ],
        constraints: [
          'The number of nodes in the list is the range [0, 5000]',
          '-5000 <= Node.val <= 5000'
        ],
        starterCode: `function reverseList(head: ListNode | null): ListNode | null {
    // Write your code here
};`,
        testCases: [
          {
            input: [[1,2,3,4,5]],
            output: [5,4,3,2,1]
          },
          {
            input: [[1,2]],
            output: [2,1]
          },
          {
            input: [[]],
            output: []
          }
        ]
      }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '/companies/amazon.svg',
    problems: [
      {
        id: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        acceptance: '60.3%',
        description: 'Merge two sorted linked lists and return it as a sorted list.',
        examples: [
          {
            input: 'l1 = [1,2,4], l2 = [1,3,4]',
            output: '[1,1,2,3,4,4]',
            explanation: 'The lists are merged in sorted order.'
          }
        ],
        constraints: [
          'The number of nodes in both lists is in the range [0, 50]',
          '-100 <= Node.val <= 100',
          'Both l1 and l2 are sorted in non-decreasing order'
        ],
        starterCode: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // Write your code here
};`,
        testCases: [
          {
            input: [[1,2,4], [1,3,4]],
            output: [1,1,2,3,4,4]
          },
          {
            input: [[], []],
            output: []
          },
          {
            input: [[], [0]],
            output: [0]
          }
        ]
      }
    ]
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: '/companies/apple.svg',
    problems: [
      {
        id: 'maximum-subarray',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        acceptance: '49.5%',
        description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
        examples: [
          {
            input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
            output: '6',
            explanation: '[4,-1,2,1] has the largest sum = 6.'
          }
        ],
        constraints: [
          '1 <= nums.length <= 105',
          '-104 <= nums[i] <= 104'
        ],
        starterCode: `function maxSubArray(nums: number[]): number {
    // Write your code here
};`,
        testCases: [
          {
            input: [[-2,1,-3,4,-1,2,1,-5,4]],
            output: 6
          },
          {
            input: [[1]],
            output: 1
          },
          {
            input: [[5,4,-1,7,8]],
            output: 23
          }
        ]
      }
    ]
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: '/companies/netflix.svg',
    problems: [
      {
        id: 'best-time-to-buy-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        acceptance: '54.2%',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
        examples: [
          {
            input: 'prices = [7,1,5,3,6,4]',
            output: '5',
            explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
          }
        ],
        constraints: [
          '1 <= prices.length <= 105',
          '0 <= prices[i] <= 104'
        ],
        starterCode: `function maxProfit(prices: number[]): number {
    // Write your code here
};`,
        testCases: [
          {
            input: [[7,1,5,3,6,4]],
            output: 5
          },
          {
            input: [[7,6,4,3,1]],
            output: 0
          }
        ]
      }
    ]
  }
]; 