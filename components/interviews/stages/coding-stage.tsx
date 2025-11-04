'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  Clock,
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  starter_code: string;
  language: 'javascript' | 'typescript' | 'react';
  test_cases: Array<{
    input: any;
    expected_output: any;
    is_hidden: boolean;
  }>;
  time_limit_minutes: number;
}

interface CodingStageProps {
  sessionId: string;
  experienceLevel: 'fresher' | 'junior' | 'senior';
  onComplete: () => void;
}

interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
  isHidden: boolean;
}

export default function CodingStage({ sessionId, experienceLevel, onComplete }: CodingStageProps) {
  const [challenge, setChallenge] = useState<CodingChallenge | null>(null);
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'typescript' | 'react'>('javascript');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  // Fetch coding challenge
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch('/api/interview/stages/coding/challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, experienceLevel, language: selectedLanguage }),
        });

        if (!response.ok) throw new Error('Failed to fetch challenge');

        const data = await response.json();
        setChallenge(data.challenge);
        setCode(data.challenge.starter_code);
        setTimeLeft(data.challenge.time_limit_minutes * 60);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching challenge:', error);
        toast.error('Failed to load coding challenge');
      }
    };

    fetchChallenge();
  }, [sessionId, experienceLevel, selectedLanguage]);

  // Timer
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0 || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, timeLeft, isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRunTests = async () => {
    if (!challenge) return;

    setIsRunning(true);
    setTestResults([]);
    setConsoleOutput([]);

    try {
      const response = await fetch('/api/interview/stages/coding/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          challengeId: challenge.id,
          code,
          language: challenge.language,
        }),
      });

      if (!response.ok) throw new Error('Failed to run tests');

      const data = await response.json();
      setTestResults(data.results);
      setConsoleOutput(data.consoleOutput || []);

      const passedCount = data.results.filter((r: TestResult) => r.passed).length;
      const visibleTests = data.results.filter((r: TestResult) => !r.isHidden);
      const visiblePassed = visibleTests.filter((r: TestResult) => r.passed).length;

      toast.success(`${visiblePassed}/${visibleTests.length} visible tests passed`);
    } catch (error) {
      console.error('Error running tests:', error);
      toast.error('Failed to run tests');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting code...', {
        sessionId,
        challengeId: challenge?.id,
        codeLength: code.length,
        language: challenge?.language,
      });

      const response = await fetch('/api/interview/stages/coding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          challengeId: challenge?.id,
          code,
          language: challenge?.language,
          timeTaken: (challenge?.time_limit_minutes || 30) * 60 - timeLeft,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Submit error response:', errorData);
        throw new Error(errorData.error || 'Failed to submit code');
      }

      const data = await response.json();
      console.log('Submit success:', data);
      toast.success('Stage 3 completed successfully!');

      // Reset submitting state before calling onComplete
      setIsSubmitting(false);
      onComplete();
    } catch (error: any) {
      console.error('Error submitting code:', error);
      toast.error(error.message || 'Failed to submit code');
      setIsSubmitting(false);
    }
  };

  if (isLoading || !challenge) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Loading coding challenge...</p>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <Card className="p-8 max-w-3xl mx-auto">
        <div className="text-center space-y-6">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Code2 className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Stage 3: Live Coding Challenge</h2>
            <p className="text-muted-foreground">
              Solve a real-world coding problem with test cases
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg space-y-3 text-left">
            <h3 className="font-semibold text-lg mb-4">Challenge: {challenge.title}</h3>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Time Limit</p>
                <p className="text-sm text-muted-foreground">
                  {challenge.time_limit_minutes} minutes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Code2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground capitalize">{challenge.language}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium">Test Cases</p>
                <p className="text-sm text-muted-foreground">
                  Some test cases are hidden until submission
                </p>
              </div>
            </div>
          </div>

          <Button onClick={() => setHasStarted(true)} size="lg" className="w-full max-w-xs">
            Start Coding Challenge
          </Button>
        </div>
      </Card>
    );
  }

  const passedTests = testResults.filter(r => r.passed && !r.isHidden).length;
  const visibleTests = testResults.filter(r => !r.isHidden).length;

  return (
    <div className="space-y-4">
      {/* Header with Timer */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{challenge.title}</h2>
            <Badge variant="secondary" className="capitalize mt-1">
              {challenge.language}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            {testResults.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tests Passed</p>
                <p className="text-lg font-bold">
                  {passedTests}/{visibleTests}
                </p>
              </div>
            )}
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span
                  className={`text-2xl font-bold ${
                    timeLeft < 300 ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Time Remaining</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content - Split View */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Problem Description */}
        <Card className="p-6">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="tests">Test Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: challenge.description.replace(/\n/g, '<br/>') }} />
              </div>
            </TabsContent>
            <TabsContent value="tests" className="space-y-3">
              {challenge.test_cases
                .filter(tc => !tc.is_hidden)
                .map((testCase, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg text-sm">
                    <p className="font-medium mb-1">Test Case {idx + 1}</p>
                    <p className="text-muted-foreground">
                      <strong>Input:</strong> {JSON.stringify(testCase.input)}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Expected:</strong> {JSON.stringify(testCase.expected_output)}
                    </p>
                  </div>
                ))}
              <p className="text-xs text-muted-foreground">
                {challenge.test_cases.filter(tc => tc.is_hidden).length} hidden test cases
              </p>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Right: Code Editor + Results */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Your Solution</p>
              <div className="flex gap-2">
                <Button
                  onClick={handleRunTests}
                  disabled={isRunning || isSubmitting}
                  size="sm"
                  variant="outline"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Tests
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isRunning}
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div
              className="border rounded-lg overflow-hidden"
              onCopy={(e) => {
                e.preventDefault();
                toast.error('Copying is disabled during the interview');
              }}
              onCut={(e) => {
                e.preventDefault();
                toast.error('Cutting is disabled during the interview');
              }}
              onPaste={(e) => {
                e.preventDefault();
                toast.error('Pasting is disabled during the interview');
              }}
            >
              <CodeMirror
                value={code}
                height="400px"
                theme={oneDark}
                extensions={[javascript({ jsx: true, typescript: challenge.language === 'typescript' })]}
                onChange={(value) => setCode(value)}
              />
            </div>
          </Card>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Test Results</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {testResults
                  .filter(r => !r.isHidden)
                  .map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-sm ${
                        result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">Test {idx + 1}</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Input: {JSON.stringify(result.input)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Expected: {JSON.stringify(result.expected)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Got: {JSON.stringify(result.actual)}
                      </p>
                      {result.error && (
                        <p className="text-red-600 text-xs mt-1">{result.error}</p>
                      )}
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Console Output */}
          {consoleOutput.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Console Output</h3>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-xs max-h-[150px] overflow-y-auto">
                {consoleOutput.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Full-page Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" style={{ marginTop: "auto" }}>
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-green-600" />
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">Submitting Your Code...</p>
              <p className="text-sm text-muted-foreground">Please wait while we run all test cases</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
