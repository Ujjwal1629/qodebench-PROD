'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Briefcase, Trophy, Sparkles, Clock, Code2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface InterviewHubProps {
  userId: string;
}

const experienceLevels = [
  {
    level: 'fresher' as const,
    title: 'Fresher',
    description: 'Entry-level candidates with 0-1 years of experience',
    icon: <GraduationCap className="h-8 w-8" />,
    color: 'bg-green-500',
    features: [
      'HTML/CSS, JavaScript basics',
      'React fundamentals',
      'Basic Node.js & APIs',
      'Git version control',
    ],
    difficulty: 'Beginner Friendly',
  },
  {
    level: 'junior' as const,
    title: 'Junior Developer',
    description: '1-3 years of professional development experience',
    icon: <Briefcase className="h-8 w-8" />,
    color: 'bg-blue-500',
    features: [
      'ES6+, Advanced JavaScript',
      'React Hooks & State Management',
      'REST APIs & Express.js',
      'SQL & NoSQL databases',
    ],
    difficulty: 'Intermediate',
  },
  {
    level: 'senior' as const,
    title: 'Senior Developer',
    description: '3+ years with architectural & leadership experience',
    icon: <Trophy className="h-8 w-8" />,
    color: 'bg-purple-500',
    features: [
      'System Design & Architecture',
      'Performance Optimization',
      'Security Best Practices',
      'Team Leadership & Mentoring',
    ],
    difficulty: 'Advanced',
  },
];

export default function InterviewHubNew({ userId }: InterviewHubProps) {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<'fresher' | 'junior' | 'senior' | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = async () => {
    if (!selectedLevel) {
      toast.error('Please select an experience level');
      return;
    }

    setIsStarting(true);

    try {
      const response = await fetch('/api/interview/start-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experienceLevel: selectedLevel }),
      });

      if (!response.ok) {
        throw new Error('Failed to start interview');
      }

      const data = await response.json();
      toast.success('Interview started! Good luck!');

      // Navigate to the interview orchestrator
      router.push(`/dashboard/interviews/${data.sessionId}/stages`);
    } catch (error) {
      console.error('Error starting interview:', error);
      toast.error('Failed to start interview. Please try again.');
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold">Full-Stack Interview Simulator</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete a 6-stage interview process designed to simulate real-world hiring.
          Get AI-powered evaluation and a professional interview report.
        </p>
      </div>

      {/* Interview Stages Overview */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Code2 className="h-5 w-5 text-blue-600" />
          6-Stage Interview Process
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <Badge className="mb-2">Stage 1</Badge>
            <p className="font-medium mb-1">MCQ Assessment</p>
            <p className="text-sm text-muted-foreground">10 questions • 15 minutes</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <Badge className="mb-2">Stage 2</Badge>
            <p className="font-medium mb-1">Behavioral Q&A</p>
            <p className="text-sm text-muted-foreground">3 questions • Voice or text</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <Badge className="mb-2">Stage 3</Badge>
            <p className="font-medium mb-1">Live Coding</p>
            <p className="text-sm text-muted-foreground">1 challenge • 30 minutes</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <Badge className="mb-2">Stage 4</Badge>
            <p className="font-medium mb-1">Technical Concepts</p>
            <p className="text-sm text-muted-foreground">2 questions • Text or voice</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <Badge className="mb-2">Stage 5</Badge>
            <p className="font-medium mb-1">System Design</p>
            <p className="text-sm text-muted-foreground">1 discussion • 15 minutes</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <Badge className="mb-2">Stage 6</Badge>
            <p className="font-medium mb-1">Results & Report</p>
            <p className="text-sm text-muted-foreground">Score + PDF download</p>
          </div>
        </div>
      </Card>

      {/* Experience Level Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-semibold">Select Your Experience Level</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {experienceLevels.map((item) => (
            <Card
              key={item.level}
              className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedLevel === item.level
                  ? 'ring-2 ring-blue-600 bg-blue-50'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedLevel(item.level)}
            >
              <div className={`${item.color} text-white p-3 rounded-lg w-fit mb-4`}>
                {item.icon}
              </div>

              <h3 className="font-bold text-xl mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

              <div className="mb-4">
                <Badge variant="secondary">{item.difficulty}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Topics Covered:</p>
                <ul className="text-sm space-y-1">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Start Button */}
      {selectedLevel && (
        <Card className="p-6 sticky bottom-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg mb-1">
                Ready to start your {experienceLevels.find(l => l.level === selectedLevel)?.title} interview?
              </p>
              <p className="text-sm opacity-90 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Estimated time: ~90 minutes total
              </p>
            </div>
            <Button
              onClick={handleStartInterview}
              disabled={isStarting}
              size="lg"
              variant="secondary"
              className="min-w-[200px]"
            >
              {isStarting ? 'Starting...' : 'Start Interview'}
            </Button>
          </div>
        </Card>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">AI-Powered Evaluation</h3>
          <p className="text-sm text-muted-foreground">
            Get detailed feedback on every answer from our advanced AI interviewer
          </p>
        </Card>

        <Card className="p-6">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Trophy className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Professional Report</h3>
          <p className="text-sm text-muted-foreground">
            Download a comprehensive PDF report with scores and recommendations
          </p>
        </Card>

        <Card className="p-6">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Code2 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Real Interview Experience</h3>
          <p className="text-sm text-muted-foreground">
            Practice with questions from top tech companies and real hiring scenarios
          </p>
        </Card>
      </div>
    </div>
  );
}
