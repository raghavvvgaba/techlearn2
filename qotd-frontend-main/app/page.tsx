"use client";

import { useState } from "react";
import { Header } from "@/components/qotd/header";
import { QuestionSection } from "@/components/qotd/question-section";
import { CodeEditor } from "@/components/qotd/code-editor";
import { OutputSection } from "@/components/qotd/output-section";
import { StatsCards } from "@/components/qotd/stats-cards";
import { Leaderboard } from "@/components/qotd/leaderboard";
import { HintSection } from "@/components/qotd/hint-section";
import { SubscribeSection } from "@/components/qotd/subscribe-section";

export default function QOTDPage() {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your solution here
  
}`);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState<{
    type: "idle" | "success" | "error" | "running";
    message: string;
  }>({ type: "idle", message: "" });

  const handleRunCode = () => {
    setOutput({ type: "running", message: "Running tests..." });
    setTimeout(() => {
      setOutput({
        type: "error",
        message: `Test Case 1: Failed
Input: nums = [2,7,11,15], target = 9
Expected: [0,1]
Output: undefined

Test Case 2: Failed
Input: nums = [3,2,4], target = 6
Expected: [1,2]
Output: undefined`,
      });
    }, 1500);
  };

  const handleSubmit = () => {
    setOutput({ type: "running", message: "Submitting solution..." });
    setTimeout(() => {
      setOutput({
        type: "success",
        message: `✓ All test cases passed!

Runtime: 56ms (Beats 89.24%)
Memory: 42.1MB (Beats 76.33%)

Congratulations! Your solution has been accepted.`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header streak={7} />
      
      <main className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Question */}
          <div className="space-y-6">
            <QuestionSection />
            <div className="lg:hidden">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                onRun={handleRunCode}
                onSubmit={handleSubmit}
              />
              <div className="mt-6">
                <OutputSection output={output} />
              </div>
            </div>
            <HintSection />
          </div>

          {/* Right Column - Code Editor & Output */}
          <div className="hidden lg:block space-y-6">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onRun={handleRunCode}
              onSubmit={handleSubmit}
            />
            <OutputSection output={output} />
          </div>
        </div>

        {/* Secondary Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCards />
          <Leaderboard />
          <SubscribeSection />
        </div>
      </main>
    </div>
  );
}
