import { ConceptLesson } from '../../../content';

export const ARRAY_BASICS: ConceptLesson = {
  type: 'concept',
  title: 'Array Basics',
  duration: '10 min',
  content: `<div class="space-y-6">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold text-slate-900">Introduction to Arrays</h1>
      <p class="text-lg text-slate-700">Arrays are one of the most fundamental data structures in computer science. They are used to store collections of elements in a contiguous block of memory.</p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">What is an Array?</h2>
      <p class="text-slate-700">An array is a collection of similar data elements stored at contiguous memory locations. It is the simplest data structure where each data element can be accessed directly using its index number.</p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Key Characteristics</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-white rounded-lg border border-slate-200">
          <div class="font-medium text-slate-900">Fixed Size</div>
          <div class="text-sm text-slate-600">Arrays have a fixed size in most languages</div>
        </div>
        <div class="p-4 bg-white rounded-lg border border-slate-200">
          <div class="font-medium text-slate-900">Constant-time Access</div>
          <div class="text-sm text-slate-600">O(1) access to any element</div>
        </div>
        <div class="p-4 bg-white rounded-lg border border-slate-200">
          <div class="font-medium text-slate-900">Contiguous Memory</div>
          <div class="text-sm text-slate-600">Elements stored in consecutive memory locations</div>
        </div>
        <div class="p-4 bg-white rounded-lg border border-slate-200">
          <div class="font-medium text-slate-900">Zero-based Indexing</div>
          <div class="text-sm text-slate-600">First element at index 0</div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Array Declaration</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-xl font-medium text-slate-900 mb-2">Python</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code># Array of numbers
numbers = [1, 2, 3, 4, 5]

# Empty array
empty_array = []

# Array of size 5 with all zeros
sized_array = [0] * 5</code></pre>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-medium text-slate-900 mb-2">Java</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>// Array of numbers
int[] numbers = {1, 2, 3, 4, 5};

// Empty array
int[] emptyArray = new int[0];

// Array of size 5 with all zeros
int[] sizedArray = new int[5];</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Accessing Elements</h2>
      <p class="text-slate-700">Arrays use zero-based indexing, meaning the first element is at index 0:</p>
      <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
        <pre class="text-slate-50"><code>numbers = [1, 2, 3, 4, 5]

# Access first element (index 0)
first = numbers[0]    # 1

# Access third element (index 2)
third = numbers[2]    # 3

# Access last element
last = numbers[-1]    # 5 (Python specific)</code></pre>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Common Operations</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-slate-900">Access Element - O(1)</h3>
          <div class="bg-slate-900 rounded-lg p-3 font-mono text-sm">
            <pre class="text-slate-50"><code>element = array[index]</code></pre>
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-slate-900">Modify Element - O(1)</h3>
          <div class="bg-slate-900 rounded-lg p-3 font-mono text-sm">
            <pre class="text-slate-50"><code>array[index] = new_value</code></pre>
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-slate-900">Get Length - O(1)</h3>
          <div class="bg-slate-900 rounded-lg p-3 font-mono text-sm">
            <pre class="text-slate-50"><code>length = len(array)</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Best Practices</h2>
        <ul class="space-y-2 list-disc pl-5 text-slate-700">
          <li>Use arrays for fixed-size collections</li>
          <li>Use arrays when you need constant-time access</li>
          <li>Use arrays when memory locality is important</li>
          <li>Use dynamic arrays (Python lists) when size varies</li>
          <li>Always check array bounds before access</li>
        </ul>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Common Pitfalls</h2>
        <ul class="space-y-2 list-disc pl-5 text-slate-700">
          <li>Accessing index out of bounds</li>
          <li>Forgetting zero-based indexing</li>
          <li>Not considering operation time complexity</li>
          <li>Using arrays when another structure is better</li>
        </ul>
      </div>
    </div>
  </div>`,
  examples: [
    {
      input: 'numbers = [1, 2, 3, 4, 5]\nnumbers[2]',
      output: '3',
      explanation: 'Accessing element at index 2 (third element)'
    },
    {
      input: 'numbers = [1, 2, 3]\nnumbers.append(4)',
      output: '[1, 2, 3, 4]',
      explanation: 'Adding element to end of array'
    },
    {
      input: 'numbers = [1, 2, 3, 4, 5]\nlen(numbers)',
      output: '5',
      explanation: 'Getting length of array'
    }
  ]
}; 