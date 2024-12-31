import { ConceptLesson } from '../../../content';

export const TWO_POINTERS: ConceptLesson = {
  type: 'concept',
  title: 'Two Pointers Technique',
  duration: '20 min',
  content: `<div class="space-y-6">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold text-slate-900">Two Pointers Technique</h1>
      <p class="text-lg text-slate-700">A technique that uses two pointers to solve array problems efficiently, often reducing time complexity from O(n²) to O(n).</p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Common Patterns</h2>
      
      <div class="grid grid-cols-1 gap-6">
        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">1. Opposite Ends</h3>
          <p class="text-slate-700">Pointers start from both ends and move towards center.</p>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return [left, right]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">2. Fast and Slow</h3>
          <p class="text-slate-700">One pointer moves faster than the other.</p>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>def find_middle(arr):
    slow = fast = 0
    while fast < len(arr) and fast + 1 < len(arr):
        slow += 1
        fast += 2
    return slow</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">3. Same Direction</h3>
          <p class="text-slate-700">Both pointers move in same direction.</p>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>def remove_duplicates(arr):
    if not arr:
        return 0
    write = 1
    for read in range(1, len(arr)):
        if arr[read] != arr[read-1]:
            arr[write] = arr[read]
            write += 1
    return write</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Common Problems</h2>
        <div class="grid grid-cols-1 gap-3">
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Two Sum (sorted array)</div>
            <div class="text-sm text-blue-700">Find pair of numbers that sum to target</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Container With Most Water</div>
            <div class="text-sm text-blue-700">Find two lines to form largest container</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Remove Duplicates</div>
            <div class="text-sm text-blue-700">Remove duplicate elements in-place</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Three Sum</div>
            <div class="text-sm text-blue-700">Find triplets that sum to target</div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Best Practices</h2>
        <ul class="space-y-2 list-disc pl-5 text-slate-700">
          <li>Initialize pointers carefully</li>
          <li>Handle edge cases (empty array, single element)</li>
          <li>Check boundary conditions</li>
          <li>Consider direction of movement</li>
        </ul>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">When to Use</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="font-medium text-green-900">Sorted Arrays</div>
          <div class="text-sm text-green-700">When input is sorted</div>
        </div>
        <div class="p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="font-medium text-green-900">Pair Finding</div>
          <div class="text-sm text-green-700">Finding element pairs</div>
        </div>
        <div class="p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="font-medium text-green-900">In-place Operations</div>
          <div class="text-sm text-green-700">Modifying array in-place</div>
        </div>
        <div class="p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="font-medium text-green-900">Palindromes</div>
          <div class="text-sm text-green-700">String palindrome checks</div>
        </div>
      </div>
    </div>
  </div>`,
  examples: [
    {
      input: 'arr = [2, 7, 11, 15], target = 9\ntwo_sum_sorted(arr, target)',
      output: '[0, 1]',
      explanation: 'Using two pointers from opposite ends to find numbers that sum to target'
    },
    {
      input: 'arr = [1, 1, 2, 2, 3]\nremove_duplicates(arr)',
      output: '3',
      explanation: 'Using two pointers in same direction to remove duplicates'
    }
  ]
}; 