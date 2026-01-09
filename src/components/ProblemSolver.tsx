import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, CheckCircle, Clock, ChevronLeft, ChevronRight, Code2, FileText, BarChart3, MessageSquare } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  solved: boolean;
  starred: boolean;
  description?: string;
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  hints?: string[];
  starterCode?: { [key: string]: string };
  testCases?: { input: string; expected: string }[];
}

interface ProblemSolverProps {
  problem: Problem;
  onClose: () => void;
}

const defaultStarterCode = {
  javascript: `function solution(nums, target) {
    // Write your solution here
    
}`,
  python: `def solution(nums, target):
    # Write your solution here
    pass`,
  java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        return new int[0];
    }
}`,
  cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
};

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

const ProblemSolver = ({ problem, onClose }: ProblemSolverProps) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(problem.starterCode?.[language] || defaultStarterCode[language as keyof typeof defaultStarterCode]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [activeTab, setActiveTab] = useState("description");
  const [splitRatio, setSplitRatio] = useState(50);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(problem.starterCode?.[newLang] || defaultStarterCode[newLang as keyof typeof defaultStarterCode]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab("testcases");
    
    // Simulate running test cases
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setTestResults([
      { passed: true, message: "Test case 1 passed ✓" },
      { passed: true, message: "Test case 2 passed ✓" },
      { passed: false, message: "Test case 3 failed: Expected [0,1], got []" },
    ]);
    
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRunning(false);
    // Handle submission logic
  };

  const problemDescription = problem.description || `
# ${problem.title}

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

## Example 1:

**Input:** nums = [2,7,11,15], target = 9

**Output:** [0,1]

**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].

## Example 2:

**Input:** nums = [3,2,4], target = 6

**Output:** [1,2]

## Example 3:

**Input:** nums = [3,3], target = 6

**Output:** [0,1]

## Constraints:

- 2 <= nums.length <= 10⁴
- -10⁹ <= nums[i] <= 10⁹
- -10⁹ <= target <= 10⁹
- Only one valid answer exists.
  `.trim();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Header */}
        <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-foreground">{problem.title}</h2>
              <Badge className={`${difficultyColors[problem.difficulty as keyof typeof difficultyColors]} border`}>
                {problem.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {problem.topic}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunCode}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Run
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isRunning}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Submit
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-3.5rem)]">
          {/* Left Panel - Problem Description */}
          <motion.div
            style={{ width: `${splitRatio}%` }}
            className="border-r border-border/50 flex flex-col"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-muted/30 px-4">
                <TabsTrigger value="description" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="solutions" className="gap-2">
                  <Code2 className="w-4 h-4" />
                  Solutions
                </TabsTrigger>
                <TabsTrigger value="submissions" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Submissions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="flex-1 mt-0 p-0">
                <ScrollArea className="h-full">
                  <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: problemDescription.replace(/\n/g, '<br/>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>') }} />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="solutions" className="flex-1 mt-0">
                <ScrollArea className="h-full p-6">
                  <p className="text-muted-foreground text-sm">
                    Solutions will be available after you solve the problem.
                  </p>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="submissions" className="flex-1 mt-0">
                <ScrollArea className="h-full p-6">
                  <p className="text-muted-foreground text-sm">
                    No submissions yet. Submit your solution to see your submission history.
                  </p>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Resize Handle */}
          <div
            className="w-1 bg-border/50 hover:bg-primary/50 cursor-col-resize transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              const startX = e.clientX;
              const startRatio = splitRatio;

              const handleMouseMove = (e: MouseEvent) => {
                const delta = e.clientX - startX;
                const containerWidth = window.innerWidth;
                const newRatio = Math.max(30, Math.min(70, startRatio + (delta / containerWidth) * 100));
                setSplitRatio(newRatio);
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          />

          {/* Right Panel - Code Editor */}
          <div className="flex-1 flex flex-col">
            {/* Editor Header */}
            <div className="h-12 border-b border-border/50 flex items-center justify-between px-4 bg-muted/30">
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1.5 bg-muted border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>Auto-saved</span>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                }}
              />
            </div>

            {/* Test Cases / Output Panel */}
            <motion.div
              initial={{ height: 200 }}
              className="border-t border-border/50 bg-muted/30"
            >
              <Tabs defaultValue="testcases" className="h-full flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent px-4 h-10">
                  <TabsTrigger value="testcases" className="text-xs">
                    Test Cases
                  </TabsTrigger>
                  <TabsTrigger value="output" className="text-xs">
                    Output
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="testcases" className="flex-1 mt-0 p-4 overflow-auto">
                  {testResults.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Run your code to see test results
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            result.passed
                              ? "bg-green-500/10 border-green-500/20"
                              : "bg-red-500/10 border-red-500/20"
                          }`}
                        >
                          <p
                            className={`text-sm font-medium ${
                              result.passed ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {result.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {isRunning && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      <span>Running test cases...</span>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="output" className="flex-1 mt-0 p-4 overflow-auto">
                  <pre className="text-sm font-mono text-muted-foreground">
                    {isRunning ? "Running..." : "No output yet"}
                  </pre>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProblemSolver;
