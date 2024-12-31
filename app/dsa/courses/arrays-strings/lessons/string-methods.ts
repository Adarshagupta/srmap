import { ConceptLesson } from '../../../content';

export const STRING_METHODS: ConceptLesson = {
  type: 'concept',
  title: 'String Methods',
  duration: '20 min',
  content: `<div class="space-y-6">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold text-slate-900">String Methods and Operations</h1>
      <p class="text-lg text-slate-700">Learn about common string methods and operations for efficient text manipulation.</p>
    </div>

    <div class="space-y-4">
      <h2 class="text-2xl font-semibold text-slate-900">Common String Operations</h2>
      
      <div class="grid grid-cols-1 gap-6">
        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">1. String Creation and Conversion</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code># String literals
text = "Hello, World!"
text = 'Hello, World!'

# String conversion
number_str = str(42)        # "42"
char_list = list("Hello")   # ['H', 'e', 'l', 'l', 'o']</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">2. String Access and Slicing</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>text = "Hello, World!"

# Character access
first = text[0]      # 'H'
last = text[-1]      # '!'

# Slicing
substring = text[0:5]   # "Hello"
reverse = text[::-1]    # "!dlroW ,olleH"</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">3. String Modification</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>text = "Hello, World!"

# Case modification
upper = text.upper()      # "HELLO, WORLD!"
lower = text.lower()      # "hello, world!"
title = text.title()      # "Hello, World!"

# Whitespace handling
stripped = "  hello  ".strip()    # "hello"
left_strip = "  hello".lstrip()   # "hello"
right_strip = "hello  ".rstrip()  # "hello"

# Replacement
new_text = text.replace("World", "Python")  # "Hello, Python!"</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">4. String Searching</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code>text = "Hello, World!"

# Finding substrings
index = text.find("World")     # 7
index = text.find("Python")    # -1 if not found

# Checking content
starts = text.startswith("Hello")   # True
ends = text.endswith("!")           # True
contains = "World" in text          # True</code></pre>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-medium text-slate-900">5. String Splitting and Joining</h3>
          <div class="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <pre class="text-slate-50"><code># Splitting
text = "apple,banana,orange"
fruits = text.split(",")    # ["apple", "banana", "orange"]

# Joining
fruits = ["apple", "banana", "orange"]
text = ", ".join(fruits)    # "apple, banana, orange"</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Best Practices</h2>
        <ul class="space-y-2 list-disc pl-5 text-slate-700">
          <li>Use appropriate string methods for the task</li>
          <li>Consider string immutability</li>
          <li>Use f-strings for formatting in Python 3.6+</li>
          <li>Handle edge cases (empty strings, not found)</li>
        </ul>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-slate-900">Common Use Cases</h2>
        <div class="grid grid-cols-1 gap-3">
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Text Processing</div>
            <div class="text-sm text-blue-700">Parsing and manipulating text data</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Data Cleaning</div>
            <div class="text-sm text-blue-700">Standardizing text format</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">Input Validation</div>
            <div class="text-sm text-blue-700">Checking text patterns</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="font-medium text-blue-900">URL Manipulation</div>
            <div class="text-sm text-blue-700">Processing web addresses</div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  examples: [
    {
      input: 'text = "Hello, World!"\ntext.upper()',
      output: '"HELLO, WORLD!"',
      explanation: 'Converts all characters to uppercase'
    },
    {
      input: '"  hello  ".strip()',
      output: '"hello"',
      explanation: 'Removes leading and trailing whitespace'
    },
    {
      input: '"apple,banana,orange".split(",")',
      output: '["apple", "banana", "orange"]',
      explanation: 'Splits string into list at comma delimiter'
    }
  ]
}; 