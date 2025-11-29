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

      const data = await response.json();

      if (!response.ok) {
        // Check if it's an access denial
        if (response.status === 403 && data.requiresUpgrade) {
          toast.error(data.message || 'Premium subscription required', {
            description: 'Upgrade to access interview prep mode',
            action: {
              label: 'Upgrade',
              onClick: () => router.push('/pricing'),
            },
          });
          return;
        }
        throw new Error(data.error || 'Failed to start interview');
      }

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
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Full-Stack Interview Simulator</h1>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
          Complete a 6-stage interview process designed to simulate real-world hiring.
          Get AI-powered evaluation and a professional interview report.
        </p>
      </div>

      {/* Interview Stages Overview */}
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
          <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          6-Stage Interview Process
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg">
            <Badge className="mb-2 text-xs">Stage 1</Badge>
            <p className="font-medium mb-1 text-sm sm:text-base">MCQ Assessment</p>
            <p className="text-xs sm:text-sm text-muted-foreground">10 questions • 15 minutes</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg">
            <Badge className="mb-2 text-xs">Stage 2</Badge>
            <p className="font-medium mb-1 text-sm sm:text-base">Behavioral Q&A</p>
            <p className="text-xs sm:text-sm text-muted-foreground">3 questions • Voice or text</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg">
            <Badge className="mb-2 text-xs">Stage 3</Badge>
            <p className="font-medium mb-1 text-sm sm:text-base">Live Coding</p>
            <p className="text-xs sm:text-sm text-muted-foreground">1 challenge • 30 minutes</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg">
            <Badge className="mb-2 text-xs">Stage 4</Badge>
            <p className="font-medium mb-1 text-sm sm:text-base">Technical Concepts</p>
            <p className="text-xs sm:text-sm text-muted-foreground">2 questions • Text or voice</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg">
            <Badge className="mb-2 text-xs">Stage 5</Badge>
            <p className="font-medium mb-1 text-sm sm:text-base">System Design</p>
            <p className="text-xs sm:text-sm text-muted-foreground">1 discussion • 15 minutes</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg">
            <Badge className="mb-2 text-xs">Stage 6</Badge>
            <p className="font-medium mb-1 text-sm sm:text-base">Results & Report</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Score + PDF download</p>
          </div>
        </div>
      </Card>

      {/* Experience Level Selection */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Select Your Experience Level</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {experienceLevels.map((item) => (
            <Card
              key={item.level}
              className={`p-4 sm:p-6 cursor-pointer transition-all hover:scale-105 ${
                selectedLevel === item.level
                  ? 'ring-2 ring-blue-600 bg-blue-50'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedLevel(item.level)}
            >
              <div className={`${item.color} text-white p-2 sm:p-3 rounded-lg w-fit mb-3 sm:mb-4`}>
                {item.icon}
              </div>

              <h3 className="font-bold text-lg sm:text-xl mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{item.description}</p>

              <div className="mb-3 sm:mb-4">
                <Badge variant="secondary" className="text-xs">{item.difficulty}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium">Topics Covered:</p>
                <ul className="text-xs sm:text-sm space-y-1">
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
        <Card className="p-4 sm:p-6 sticky bottom-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-base sm:text-lg mb-1">
                Ready to start your {experienceLevels.find(l => l.level === selectedLevel)?.title} interview?
              </p>
              <p className="text-xs sm:text-sm opacity-90 flex items-center justify-center sm:justify-start gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                Estimated time: ~90 minutes total
              </p>
            </div>
            <Button
              onClick={handleStartInterview}
              disabled={isStarting}
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto sm:min-w-[200px]"
            >
              {isStarting ? 'Starting...' : 'Start Interview'}
            </Button>
          </div>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">AI-Powered Evaluation</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Get detailed feedback on every answer from our advanced AI interviewer
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Professional Report</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Download a comprehensive PDF report with scores and recommendations
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">Real Interview Experience</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Practice with questions from top tech companies and real hiring scenarios
          </p>
        </Card>
      </div>
    </div>
  );
}
