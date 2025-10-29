'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Target, Clock, ArrowRight } from 'lucide-react';

interface QuizIntroProps {
  onStart: () => void;
  onSkip: () => void;
}

export function QuizIntro({ onStart, onSkip }: QuizIntroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <Badge className="mb-3">2 Minutes</Badge>
            <CardTitle className="text-3xl">Welcome to QodeBench!</CardTitle>
            <CardDescription className="text-base mt-2">
              Let's understand your current skill level to personalize your learning journey
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Why Take This Assessment */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Why take this assessment?</h3>
            <p className="text-muted-foreground mb-4">
              This quick 10-question assessment helps us recommend the right challenges and learning paths tailored to your expertise level.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2 mt-0.5">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Personalized Path</h4>
                <p className="text-sm text-muted-foreground">Get challenge recommendations matched to your level</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-100 p-2 mt-0.5">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Track Progress</h4>
                <p className="text-sm text-muted-foreground">See how much you've improved over time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-100 p-2 mt-0.5">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Quick & Easy</h4>
                <p className="text-sm text-muted-foreground">Only 10 questions, takes about 2 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-orange-100 p-2 mt-0.5">
                <Brain className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">No Pressure</h4>
                <p className="text-sm text-muted-foreground">There are no wrong answers, just learning opportunities</p>
              </div>
            </div>
          </div>

          {/* What's Covered */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">What we'll cover:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• HTML & CSS fundamentals</li>
              <li>• JavaScript concepts</li>
              <li>• React & Next.js knowledge</li>
              <li>• Backend & API basics</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" onClick={onStart} className="gap-2 flex-1">
            Start Assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="ghost" onClick={onSkip} className="flex-1">
            Skip for Now
          </Button>
        </CardFooter>

        <div className="px-6 pb-6">
          <p className="text-xs text-center text-muted-foreground">
            Don't worry, you can always retake this assessment later from your dashboard
          </p>
        </div>
      </Card>
    </div>
  );
}
