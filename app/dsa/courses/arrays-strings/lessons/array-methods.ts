import { ConceptLesson } from '../../../content';

export const ARRAY_METHODS: ConceptLesson = {
  type: 'concept',
  title: 'Array Methods',
  duration: '15 min',
  content: `<div class="space-y-6">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold text-slate-900">Array Methods and Built-in Functions</h1>
      <p class="text-lg text-slate-700">Learn about common array methods and built-in functions that make array manipulation easier.</p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Key Methods</h2>
      
      <div class="grid grid-cols-1 gap-6">
        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">1. Adding Elements</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>numbers = [1, 2, 3]

# Append to end
numbers.append(4)      # [1, 2, 3, 4]

# Insert at position
numbers.insert(1, 5)   # [1, 5, 2, 3, 4]

# Extend with another list
numbers.extend([6, 7]) # [1, 5, 2, 3, 4, 6, 7]</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">2. Removing Elements</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code># Remove by value
numbers.remove(5)      # [1, 2, 3, 4, 6, 7]

# Remove by index
numbers.pop()         # Removes and returns last element
numbers.pop(2)        # Removes element at index 2

# Clear all elements
numbers.clear()       # []</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">3. Finding Elements</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>numbers = [1, 2, 3, 2, 4]

# Find index
index = numbers.index(2)    # Returns 1 (first occurrence)

# Count occurrences
count = numbers.count(2)    # Returns 2

# Check existence
exists = 3 in numbers      # Returns True</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">4. Sorting and Ordering</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Sort in place
numbers.sort()              # [1, 1, 2, 3, 4, 5, 6, 9]

# Sort in reverse
numbers.sort(reverse=True)  # [9, 6, 5, 4, 3, 2, 1, 1]

# Reverse order
numbers.reverse()           # Reverses current order</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Best Practices</h2>
        <ul class="space-y-2 list-disc pl-5 text-slate-700">
          <li>Choose appropriate methods for your needs</li>
          <li>Consider time complexity</li>
          <li>Be aware of in-place vs. return new array</li>
          <li>Handle edge cases (empty arrays, not found)</li>
        </ul>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Common Use Cases</h2>
        <div class="grid grid-cols-1 gap-3">
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Data Processing</div>
            <div class="text-sm text-blue-700">Sorting, filtering, and transforming data</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Collection Management</div>
            <div class="text-sm text-blue-700">Adding, removing, and organizing elements</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Search Operations</div>
            <div class="text-sm text-blue-700">Finding elements and their positions</div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  examples: [
    {
      input: 'numbers = [1, 2, 3]\nnumbers.append(4)',
      output: '[1, 2, 3, 4]',
      explanation: 'Append adds element to end of list'
    },
    {
      input: 'numbers = [1, 2, 3, 2]\nnumbers.count(2)',
      output: '2',
      explanation: 'Count returns number of occurrences'
    }
  ]
}; 