'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ToolLayout } from '../tool-layout';

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
}

function generatePosts(start: number, count: number): Post[] {
  const authors = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona'];
  const topics = ['Testing', 'Playwright', 'Automation', 'CI/CD', 'Debugging', 'Performance', 'Locators', 'Assertions', 'Fixtures', 'Page Objects'];
  return Array.from({ length: count }, (_, i) => {
    const id = start + i;
    return {
      id,
      title: `${topics[id % topics.length]} Best Practices - Part ${id}`,
      author: authors[id % authors.length],
      date: `2024-${String((id % 12) + 1).padStart(2, '0')}-${String((id % 28) + 1).padStart(2, '0')}`,
      excerpt: `Learn about ${topics[id % topics.length].toLowerCase()} techniques and how to apply them effectively in your QA automation workflow. This is post #${id}.`,
    };
  });
}

const BATCH = 10;
const MAX_POSTS = 50;

export default function InfiniteScrollTool() {
  const [posts, setPosts] = useState<Post[]>(() => generatePosts(1, BATCH));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setPosts((prev) => {
        const next = generatePosts(prev.length + 1, BATCH);
        const all = [...prev, ...next];
        if (all.length >= MAX_POSTS) setHasMore(false);
        return all.slice(0, MAX_POSTS);
      });
      setLoading(false);
    }, 1200);
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadMore]);

  const handleReset = () => {
    setPosts(generatePosts(1, BATCH));
    setHasMore(true);
  };

  return (
    <ToolLayout
      title="Infinite Scroll"
      description="Content that loads dynamically as you scroll down. Practice scroll actions, waiting for new elements, and counting loaded items."
      difficulty="Intermediate"
      scenarios={[
        'Scroll to the bottom and verify new posts load automatically.',
        'Wait for the loading spinner to appear and disappear.',
        'Count the total number of posts after scrolling twice.',
        'Verify post #25 exists after scrolling enough.',
        'Scroll until "No more posts" message appears (50 max).',
        'Verify each post card has the correct title format.',
        'Click "Reset" and verify only the first 10 posts are shown.',
        'Use page.evaluate to scroll and wait for network idle.',
      ]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600" data-testid="post-count">
            Loaded: {posts.length} posts
          </p>
          <button onClick={handleReset} className="text-sm text-sky-600 hover:underline" data-testid="reset-button">
            Reset
          </button>
        </div>

        <div className="space-y-4" data-testid="post-list">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              data-testid={`post-${post.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 text-sm" data-testid={`title-${post.id}`}>
                  {post.title}
                </h3>
                <span className="text-xs text-slate-400 whitespace-nowrap ml-3">#{post.id}</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span data-testid={`author-${post.id}`}>By {post.author}</span>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Load trigger */}
        <div ref={observerRef} className="py-8 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-2" data-testid="loading-indicator">
              <div className="w-5 h-5 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Loading more posts...</span>
            </div>
          )}
          {!hasMore && (
            <p className="text-sm text-slate-500" data-testid="end-message">
              No more posts to load. You&apos;ve reached the end!
            </p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
