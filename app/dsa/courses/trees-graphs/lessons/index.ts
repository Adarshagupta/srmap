import { ChapterContent } from '../../../content';

export const TREES_GRAPHS_LESSONS: Record<number, ChapterContent> = {
  0: { // Introduction to Trees
    0: { // Tree Basics
      type: 'concept',
      title: 'Tree Data Structure',
      duration: '25 min',
      content: `# Tree Data Structure

## What is a Tree?
A tree is a hierarchical data structure consisting of nodes connected by edges.

## Basic Terminology
1. Root - Top node of tree
2. Parent/Child - Relationship between connected nodes
3. Leaf - Node with no children
4. Height - Length of path from root to deepest leaf
5. Depth - Length of path from node to root

## Types of Trees
1. Binary Tree
2. Binary Search Tree (BST)
3. AVL Tree
4. Red-Black Tree
5. N-ary Tree

## Implementation
\`\`\`python
class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
            return
        
        queue = [self.root]
        while queue:
            node = queue.pop(0)
            if not node.left:
                node.left = TreeNode(val)
                return
            if not node.right:
                node.right = TreeNode(val)
                return
            queue.append(node.left)
            queue.append(node.right)
\`\`\`

## Tree Traversals
1. **Inorder (Left, Root, Right)**
\`\`\`python
def inorder(root):
    if root:
        inorder(root.left)
        print(root.val)
        inorder(root.right)
\`\`\`

2. **Preorder (Root, Left, Right)**
\`\`\`python
def preorder(root):
    if root:
        print(root.val)
        preorder(root.left)
        preorder(root.right)
\`\`\`

3. **Postorder (Left, Right, Root)**
\`\`\`python
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val)
\`\`\`

## Common Applications
1. File systems
2. Organization charts
3. DOM
4. Decision trees

## Video Resources
1. [Tree Data Structure](https://www.youtube.com/watch?v=oSWTXtMglKE)
2. [Tree Traversals](https://www.youtube.com/watch?v=9RHO6jU--GU)`,
      examples: [
        {
          input: 'Create tree with values [1, 2, 3]',
          output: '    1\n   / \\\n  2   3',
          explanation: 'Binary tree with root 1 and children 2, 3'
        }
      ]
    },
    1: { // Binary Search Tree
      type: 'practice',
      title: 'Implement Binary Search Tree',
      difficulty: 'Medium',
      description: 'Implement a Binary Search Tree with insert, search, and delete operations.',
      examples: [
        {
          input: 'Insert: 5, 3, 7\nSearch: 3',
          output: 'true',
          explanation: '3 is found in the BST'
        }
      ],
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        # Your code here
        pass
    
    def search(self, val):
        # Your code here
        pass
    
    def delete(self, val):
        # Your code here
        pass`,
        cpp: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

class BST {
private:
    TreeNode* root;
    
public:
    BST() : root(nullptr) {}
    
    void insert(int val) {
        // Your code here
    }
    
    bool search(int val) {
        // Your code here
        return false;
    }
    
    void remove(int val) {
        // Your code here
    }
};`,
        java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int val) {
        this.val = val;
    }
}

class BST {
    private TreeNode root;
    
    public BST() {
        root = null;
    }
    
    public void insert(int val) {
        // Your code here
    }
    
    public boolean search(int val) {
        // Your code here
        return false;
    }
    
    public void delete(int val) {
        // Your code here
    }
}`
      },
      testCases: [
        {
          input: ['insert(5)', 'insert(3)', 'search(3)'],
          output: [0, 0, true]
        },
        {
          input: ['insert(5)', 'delete(5)', 'search(5)'],
          output: [0, 0, false]
        }
      ],
      hints: [
        'Maintain BST property: left < root < right',
        'Handle all cases in delete operation',
        'Use recursion for traversal'
      ],
      solution: `def insert(self, val):
    def _insert(node, val):
        if not node:
            return TreeNode(val)
        if val < node.val:
            node.left = _insert(node.left, val)
        else:
            node.right = _insert(node.right, val)
        return node
    
    self.root = _insert(self.root, val)`,
      timeComplexity: 'O(h) where h is height of tree',
      spaceComplexity: 'O(1) for iterative, O(h) for recursive'
    }
  },
  1: { // Introduction to Graphs
    0: { // Graph Basics
      type: 'concept',
      title: 'Graph Data Structure',
      duration: '25 min',
      content: `# Graph Data Structure

## What is a Graph?
A graph is a non-linear data structure consisting of vertices and edges.

## Basic Terminology
1. Vertex/Node - Basic unit of a graph
2. Edge - Connection between vertices
3. Degree - Number of edges connected to a vertex
4. Path - Sequence of vertices connected by edges
5. Cycle - Path that starts and ends at same vertex

## Types of Graphs
1. Directed vs Undirected
2. Weighted vs Unweighted
3. Connected vs Disconnected
4. Cyclic vs Acyclic

## Representations
1. **Adjacency Matrix**
\`\`\`python
graph = [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0]
]
\`\`\`

2. **Adjacency List**
\`\`\`python
graph = {
    0: [1],
    1: [0, 2],
    2: [1]
}
\`\`\`

## Graph Traversals
1. **Breadth-First Search (BFS)**
\`\`\`python
def bfs(graph, start):
    visited = set()
    queue = [start]
    visited.add(start)
    
    while queue:
        vertex = queue.pop(0)
        print(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
\`\`\`

2. **Depth-First Search (DFS)**
\`\`\`python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
\`\`\`

## Common Applications
1. Social networks
2. Road networks
3. Computer networks
4. Recommendation systems

## Video Resources
1. [Graph Data Structure](https://www.youtube.com/watch?v=gXgEDyodOJU)
2. [Graph Traversals](https://www.youtube.com/watch?v=pcKY4hjDrxk)`,
      examples: [
        {
          input: 'Create graph: 0-1-2',
          output: '0 -- 1 -- 2',
          explanation: 'Undirected graph with 3 vertices'
        }
      ]
    }
  }
}; 