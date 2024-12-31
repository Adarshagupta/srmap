import { PracticeLesson } from '../../../content';

export const ARRAY_OPERATIONS: PracticeLesson = {
  id: 'array-operations',
  type: 'practice',
  title: 'Array Operations',
  difficulty: 'Easy',
  description: 'Implement three array operations: insert, delete, and search.',
  acceptance: 67.8,
  submissions: 1234567,
  topics: ['Array', 'Two Pointers'],
  companies: [
    {
      company: 'Google',
      frequency: 'High',
      lastAsked: '1 week ago'
    },
    {
      company: 'Amazon',
      frequency: 'Medium',
      lastAsked: '2 weeks ago'
    },
    {
      company: 'Microsoft',
      frequency: 'Low',
      lastAsked: '1 month ago'
    }
  ],
  similarProblems: [
    'Two Sum',
    'Remove Element',
    'Search Insert Position'
  ],
  content: `<div class="space-y-6">
    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">Problem Statement</h2>
        <p class="text-slate-700">Given an array of integers, implement three functions:</p>
        <ul class="list-disc pl-5 space-y-2 mt-2 text-slate-700">
          <li><code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded">insert(arr, element, index)</code>: Insert element at the given index, shifting existing elements right</li>
          <li><code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded">delete(arr, index)</code>: Delete element at the given index, shifting remaining elements left</li>
          <li><code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded">search(arr, element)</code>: Return the index of element in array, or -1 if not found</li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">Examples</h2>
        <div class="space-y-4">
          <div class="bg-slate-50 p-4 rounded-lg">
            <p class="font-medium text-sm text-slate-700 mb-2">Example 1: Insert</p>
            <pre class="text-sm bg-slate-100 p-3 rounded"><code>Input: arr = [1, 2, 3], element = 4, index = 1
Output: [1, 4, 2, 3]
Explanation: 4 is inserted at index 1, shifting [2, 3] right</code></pre>
          </div>
          
          <div class="bg-slate-50 p-4 rounded-lg">
            <p class="font-medium text-sm text-slate-700 mb-2">Example 2: Delete</p>
            <pre class="text-sm bg-slate-100 p-3 rounded"><code>Input: arr = [1, 2, 3, 4], index = 1
Output: [1, 3, 4]
Explanation: Element at index 1 is removed, shifting [3, 4] left</code></pre>
          </div>

          <div class="bg-slate-50 p-4 rounded-lg">
            <p class="font-medium text-sm text-slate-700 mb-2">Example 3: Search</p>
            <pre class="text-sm bg-slate-100 p-3 rounded"><code>Input: arr = [1, 2, 3, 4], element = 3
Output: 2
Explanation: Element 3 is found at index 2</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">Constraints</h2>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li>1 ≤ arr.length ≤ 10⁴</li>
          <li>0 ≤ index < arr.length</li>
          <li>-10⁹ ≤ arr[i], element ≤ 10⁹</li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">Follow-up</h2>
        <ul class="list-disc pl-5 space-y-1 text-slate-700">
          <li>Can you implement these operations without using built-in functions?</li>
          <li>What if the array is very large? How would you optimize the operations?</li>
        </ul>
      </div>
    </div>

    <div class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold mb-4">Companies</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 relative">
                <img src="/companies/google.svg" alt="Google" className="object-contain" />
              </div>
              <span className="font-medium">Google</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">High</span>
              <span className="text-sm text-slate-500">1 week ago</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 relative">
                <img src="/companies/amazon.svg" alt="Amazon" className="object-contain" />
              </div>
              <span className="font-medium">Amazon</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm bg-slate-100 text-slate-800 px-2 py-1 rounded">Medium</span>
              <span className="text-sm text-slate-500">2 weeks ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  examples: [
    {
      input: 'arr = [1, 2, 3], k = 4, pos = 1',
      output: '[1, 4, 2, 3]',
      explanation: 'Element 4 is inserted at position 1, shifting [2, 3] right'
    },
    {
      input: 'arr = [1, 2, 3, 4], index = 1',
      output: '[1, 2, 3, 4]',
      explanation: 'Element at index 1 is removed, shifting [3, 4] left'
    }
  ],
  starterCode: {
    python: `def insert(arr: list, element: int, index: int) -> list:
    """
    Insert element at given index in array
    Shift existing elements right
    Return modified array
    """
    # Write your code here
    pass

def delete(arr: list, index: int) -> list:
    """
    Delete element at given index from array
    Shift remaining elements left
    Return modified array
    """
    # Write your code here
    pass

def search(arr: list, element: int) -> int:
    """
    Search for element in array
    Return index if found, -1 if not found
    """
    # Write your code here
    pass`,
    cpp: `class Solution {
public:
    vector<int> insert(vector<int>& arr, int element, int index) {
        // Write your code here
        return arr;
    }
    
    vector<int> delete(vector<int>& arr, int index) {
        // Write your code here
        return arr;
    }
    
    int search(vector<int>& arr, int element) {
        // Write your code here
        return -1;
    }
};`,
    java: `class Solution {
    public int[] insert(int[] arr, int element, int index) {
        // Write your code here
        return arr;
    }
    
    public int[] delete(int[] arr, int index) {
        // Write your code here
        return arr;
    }
    
    public int search(int[] arr, int element) {
        // Write your code here
        return -1;
    }
}`
  },
  testCases: [
    {
      input: ['[1, 2, 3]', '4', '1'],
      output: ['[1, 4, 2, 3]']
    },
    {
      input: ['[1, 2, 3, 4]', '1'],
      output: ['[1, 2, 3, 4]']
    },
    {
      input: ['[1]', '2'],
      output: ['[2]']
    }
  ],
  hints: [
    'For insertion, create a new array with size + 1 and copy elements with the shift',
    'For deletion, create a new array with size - 1 and skip the deleted element',
    'For search, use a simple linear scan through the array'
  ],
  solution: `def insert(arr: list, element: int, index: int) -> list:
    # Create new array with size + 1
    result = [0] * (len(arr) + 1)
    
    # Copy elements before index
    for i in range(index):
        result[i] = arr[i]
    
    # Insert new element
    result[index] = element
    
    # Copy remaining elements
    for i in range(index, len(arr)):
        result[i + 1] = arr[i]
    
    return result

def delete(arr: list, index: int) -> list:
    # Create new array with size - 1
    result = [0] * (len(arr) - 1)
    
    # Copy elements before index
    for i in range(index):
        result[i] = arr[i]
    
    # Copy remaining elements
    for i in range(index + 1, len(arr)):
        result[i - 1] = arr[i]
    
    return result

def search(arr: list, element: int) -> int:
    # Linear search
    for i in range(len(arr)):
        if arr[i] == element:
            return i
    return -1`,
  timeComplexity: 'Insert/Delete: O(n) where n is array length, Search: O(n)',
  spaceComplexity: 'Insert/Delete: O(n) for new array, Search: O(1)'
}; 