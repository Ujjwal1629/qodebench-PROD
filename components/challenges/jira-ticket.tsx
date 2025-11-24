'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, AlertCircle, FileText, Code, Layers } from 'lucide-react';
import { ChallengeMarkdownRenderer } from '@/components/challenges/challenge-markdown-renderer';
import type { AdvancedChallengeMetadata } from '@/types/challenges';

interface JiraTicketProps {
  ticketId: string;
  title: string;
  description: string | null;
  metadata: AdvancedChallengeMetadata;
}

export function JiraTicket({
  ticketId,
  title,
  description,
  metadata,
}: JiraTicketProps) {
  const getPriorityColor = () => {
    switch (metadata.urgency) {
      case 'P1':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'P2':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'P3':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'P4':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 pb-6">
        {/* Ticket Header */}
        <Card className="border-2 border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono text-xs bg-purple-50 text-purple-700 border-purple-200">
                  {ticketId}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getPriorityColor()}`}>
                  {metadata.urgency}
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Bug
                </Badge>
              </div>
            </div>
            <CardTitle className="text-lg font-semibold text-slate-900 mt-3">
              {title}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Description */}
        {description && (
          <Card className="border border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Description
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ChallengeMarkdownRenderer content={description} />
            </CardContent>
          </Card>
        )}

        {/* Steps to Reproduce */}
        {metadata.stepsToReproduce && metadata.stepsToReproduce.length > 0 && (
          <Card className="border border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Steps to Reproduce
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                {metadata.stepsToReproduce.map((step, index) => (
                  <li key={index} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Expected vs Actual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border border-green-200 bg-green-50/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm font-semibold text-green-800">
                  Expected Behavior
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 leading-relaxed">
                {metadata.expectedBehavior}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-red-200 bg-red-50/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <CardTitle className="text-sm font-semibold text-red-800">
                  Actual Behavior
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 leading-relaxed">
                {metadata.actualBehavior}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Acceptance Criteria */}
        {metadata.acceptanceCriteria && metadata.acceptanceCriteria.length > 0 && (
          <Card className="border border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Acceptance Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {metadata.acceptanceCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-slate-400">{index + 1}</span>
                    </div>
                    <span className="leading-relaxed">{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Affected Modules */}
        {metadata.affectedModules && metadata.affectedModules.length > 0 && (
          <Card className="border border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Affected Modules
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {metadata.affectedModules.map((module, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                  >
                    {module}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sample Request/Response */}
        {(metadata.sampleRequest || metadata.sampleResponse) && (
          <Card className="border border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Sample Request / Response
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {metadata.sampleRequest && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Request:</p>
                  <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                    {metadata.sampleRequest}
                  </pre>
                </div>
              )}
              {metadata.sampleResponse && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Response:</p>
                  <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                    {metadata.sampleResponse}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Architecture Notes */}
        {metadata.architectureNotes && (
          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">
                Architecture Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-purple-800">
                <ChallengeMarkdownRenderer content={metadata.architectureNotes} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}
