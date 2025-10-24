'use client';

import { useCallback, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/constants/dashboard';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700' },
];

const CATEGORY_OPTIONS = [
  { value: 'office-fundamentals', label: CATEGORY_LABELS['office-fundamentals'] },
  { value: 'python', label: CATEGORY_LABELS.python },
  { value: 'javascript', label: CATEGORY_LABELS.javascript },
  { value: 'react', label: CATEGORY_LABELS.react },
  { value: 'nextjs', label: CATEGORY_LABELS.nextjs },
  { value: 'nodejs', label: CATEGORY_LABELS.nodejs },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Challenges' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'points', label: 'Points (High to Low)' },
  { value: 'difficulty', label: 'Difficulty' },
];

export function ChallengesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get current filter values from URL
  const currentSearch = searchParams.get('search') || '';
  const currentDifficulties =
    searchParams.get('difficulty')?.split(',').filter(Boolean) || [];
  const currentCategories =
    searchParams.get('category')?.split(',').filter(Boolean) || [];
  const currentStatus = searchParams.get('status') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';

  const [searchValue, setSearchValue] = useState(currentSearch);

  // Update URL params
  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      params.delete('page');

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  // Toggle difficulty filter
  const toggleDifficulty = (difficulty: string) => {
    const newDifficulties = currentDifficulties.includes(difficulty)
      ? currentDifficulties.filter((d) => d !== difficulty)
      : [...currentDifficulties, difficulty];

    updateFilters({
      difficulty: newDifficulties.length > 0 ? newDifficulties.join(',') : null,
    });
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];

    updateFilters({
      category: newCategories.length > 0 ? newCategories.join(',') : null,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchValue('');
    startTransition(() => {
      router.push(window.location.pathname);
    });
  };

  // Handle search with debounce
  const handleSearch = useCallback(
    (value: string) => {
      updateFilters({ search: value || null });
    },
    [updateFilters]
  );

  const hasActiveFilters =
    currentSearch ||
    currentDifficulties.length > 0 ||
    currentCategories.length > 0 ||
    currentStatus !== 'all' ||
    currentSort !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search challenges..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            // Debounce search
            const timer = setTimeout(() => {
              handleSearch(e.target.value);
            }, 300);
            return () => clearTimeout(timer);
          }}
          className="pl-9"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Difficulty Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Difficulty
          </Label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((option) => (
              <Badge
                key={option.value}
                variant={
                  currentDifficulties.includes(option.value)
                    ? 'default'
                    : 'outline'
                }
                className={`cursor-pointer transition-all ${
                  currentDifficulties.includes(option.value)
                    ? option.color
                    : 'hover:' + option.color
                }`}
                onClick={() => toggleDifficulty(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Category
          </Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.slice(0, 3).map((option) => (
              <Badge
                key={option.value}
                variant={
                  currentCategories.includes(option.value)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer transition-all hover:bg-blue-50"
                onClick={() => toggleCategory(option.value)}
              >
                {option.label}
              </Badge>
            ))}
            {CATEGORY_OPTIONS.slice(3).map((option) => (
              <Badge
                key={option.value}
                variant={
                  currentCategories.includes(option.value)
                    ? 'default'
                    : 'outline'
                }
                className="cursor-pointer transition-all hover:bg-blue-50 hidden sm:inline-flex"
                onClick={() => toggleCategory(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Status</Label>
          <Select
            value={currentStatus}
            onValueChange={(value) => updateFilters({ status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Challenges" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Sort By</Label>
          <Select
            value={currentSort}
            onValueChange={(value) => updateFilters({ sort: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-slate-600">
            {currentDifficulties.length + currentCategories.length > 0 && (
              <span>
                {currentDifficulties.length + currentCategories.length} filter
                {currentDifficulties.length + currentCategories.length !== 1
                  ? 's'
                  : ''}{' '}
                active
              </span>
            )}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
