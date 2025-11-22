'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, Layers } from 'lucide-react';

interface ImpactSummaryCardProps {
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  urgency: 'P1' | 'P2' | 'P3' | 'P4';
  affectedModules: string[];
}

export function ImpactSummaryCard({
  impact,
  urgency,
  affectedModules,
}: ImpactSummaryCardProps) {
  const getImpactColor = () => {
    switch (impact) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'High':
        return 'text-orange-600 bg-orange-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getUrgencyColor = () => {
    switch (urgency) {
      case 'P1':
        return 'text-red-600 bg-red-50';
      case 'P2':
        return 'text-orange-600 bg-orange-50';
      case 'P3':
        return 'text-yellow-600 bg-yellow-50';
      case 'P4':
        return 'text-slate-600 bg-slate-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getUrgencyLabel = () => {
    switch (urgency) {
      case 'P1':
        return 'P1 - Critical';
      case 'P2':
        return 'P2 - High';
      case 'P3':
        return 'P3 - Medium';
      case 'P4':
        return 'P4 - Low';
      default:
        return urgency;
    }
  };

  return (
    <Card className="border-2 border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-900">
          Impact Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Impact */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200">
            <AlertTriangle className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium">Impact</p>
            <span className={`text-sm font-semibold px-2 py-0.5 rounded ${getImpactColor()}`}>
              {impact}
            </span>
          </div>
        </div>

        {/* Urgency */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200">
            <Clock className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium">Urgency</p>
            <span className={`text-sm font-semibold px-2 py-0.5 rounded ${getUrgencyColor()}`}>
              {getUrgencyLabel()}
            </span>
          </div>
        </div>

        {/* Affected Modules */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200">
            <Layers className="h-4 w-4 text-slate-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium mb-1">Modules Affected</p>
            <div className="flex flex-wrap gap-1">
              {affectedModules.map((module, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
