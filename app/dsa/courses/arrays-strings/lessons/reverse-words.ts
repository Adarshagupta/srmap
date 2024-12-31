import { Lesson } from '../../../content';

export const REVERSE_WORDS: Lesson = {
  type: 'practice',
  title: 'Reverse Words in a String',
  difficulty: 'Easy',
  description: `Given a string s, reverse the order of words.

A word is defined as a sequence of non-space characters. The words in s will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space.

Note that s may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.`,
  examples: [
    {
      input: 's = "the sky is blue"',
      output: '"blue is sky the"',
      explanation: 'Reverse the order of words'
    },
    {
      input: 's = "  hello world  "',
      output: '"world hello"',
      explanation: 'Remove leading/trailing spaces and reverse words'
    },
    {
      input: 's = "a good   example"',
      output: '"example good a"',
      explanation: 'Reduce multiple spaces to single space and reverse'
    }
  ],
  starterCode: {
    python: `def reverse_words(s: str) -> str:
    """
    Reverse the order of words in string
    
    Args:
        s: String containing words separated by spaces
    
    Returns:
        String with words in reverse order
    """
    # Your code here
    pass`,
    cpp: `string reverseWords(string s) {
    // Your code here
}`,
    java: `public String reverseWords(String s) {
    // Your code here
}`
  },
  testCases: [
    {
      input: ['"the sky is blue"'],
      output: ['blue is sky the']
    },
    {
      input: ['"  hello world  "'],
      output: ['world hello']
    },
    {
      input: ['"a good   example"'],
      output: ['example good a']
    },
    {
      input: ['"  Bob    Loves  Alice   "'],
      output: ['Alice Loves Bob']
    }
  ],
  hints: [
    'Split the string into words',
    'Remove empty strings after splitting',
    'Reverse the array of words',
    'Join words with single space'
  ],
  solution: `def reverse_words(s: str) -> str:
    # Split string and filter out empty strings
    words = [word for word in s.split() if word]
    
    # Reverse words and join with single space
    return ' '.join(words[::-1])`,
  timeComplexity: 'O(n) where n is length of string',
  spaceComplexity: 'O(n) to store the words array'
}; 