'use client';

import { useState } from 'react';
import { MerchItem, MerchCategory } from '@/app/actions/rewards';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins } from 'lucide-react';
import { MerchCard } from './merch-card';
import { RedemptionModal } from './redemption-modal';
import { RedemptionHistory } from './redemption-history';

interface RewardsClientProps {
  initialMerchItems: MerchItem[];
  initialUserPoints: number;
}

export function RewardsClient({ initialMerchItems, initialUserPoints }: RewardsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<MerchCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<MerchItem | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredItems =
    selectedCategory === 'all'
      ? initialMerchItems
      : initialMerchItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Beta Announcement Banner */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎉</div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Beta Launch Special!</h3>
              <p className="text-sm text-orange-800">
                Earn points now, redeem stickers immediately! Premium merch (T-shirts, Hoodies, Mugs)
                unlocks when we hit <strong>1,000 active users</strong>. Your points carry over!
              </p>
              <div className="mt-2 flex gap-2 text-xs text-orange-700">
                <span className="bg-orange-100 px-2 py-1 rounded">✓ Stickers Available Now</span>
                <span className="bg-orange-100 px-2 py-1 rounded">✓ 1 Redemption Per User</span>
                <span className="bg-orange-100 px-2 py-1 rounded">✓ Limited to 50 Beta Users</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Balance */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Points Balance</p>
                <p className="text-3xl font-bold text-blue-600">
                  {initialUserPoints.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showHistory ? 'View Store' : 'View Redemption History'}
            </button>
          </div>
        </CardContent>
      </Card>

      {showHistory ? (
        <RedemptionHistory />
      ) : (
        <>
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as MerchCategory | 'all')}>
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="apparel">Apparel</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="office">Office</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Merch Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MerchCard
                key={item.id}
                item={item}
                userPoints={initialUserPoints}
                onRedeem={() => setSelectedItem(item)}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No items found in this category
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Redemption Modal */}
      {selectedItem && (
        <RedemptionModal
          item={selectedItem}
          userPoints={initialUserPoints}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
