'use client';

import { MerchItem } from '@/app/actions/rewards';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Package } from 'lucide-react';
import Image from 'next/image';

interface MerchCardProps {
  item: MerchItem;
  userPoints: number;
  onRedeem: () => void;
}

export function MerchCard({ item, userPoints, onRedeem }: MerchCardProps) {
  const canAfford = userPoints >= item.point_cost;
  const isOutOfStock = item.stock_quantity <= 0;
  const isBetaItem = item.is_active;
  const isComingSoon = !isBetaItem;

  return (
    <Card className={`overflow-hidden ${!canAfford || isOutOfStock || isComingSoon ? 'opacity-60' : ''}`}>
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <Package className="h-16 w-16 text-slate-400" />
        )}
        {isComingSoon && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-500/80 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center p-4">
              <Badge className="text-lg mb-2 bg-white text-blue-600">Coming in v1.0</Badge>
              <p className="text-xs text-white font-medium">Keep earning points!</p>
            </div>
          </div>
        )}
        {isOutOfStock && isBetaItem && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
          </div>
        )}
        {isBetaItem && !isOutOfStock && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 text-white">Beta Available</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <Badge variant="outline" className="capitalize">
            {item.category}
          </Badge>
        </div>

        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-blue-600" />
            <span className="font-bold text-blue-600">
              {item.point_cost.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">points</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {item.stock_quantity} in stock
          </p>
        </div>

        {item.sizes && item.sizes.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">
              Sizes: {item.sizes.join(', ')}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onRedeem}
          disabled={!canAfford || isOutOfStock || isComingSoon}
          className="w-full"
          variant={canAfford && !isOutOfStock && !isComingSoon ? 'default' : 'outline'}
        >
          {isComingSoon
            ? 'Available in v1.0'
            : isOutOfStock
            ? 'Out of Stock'
            : !canAfford
            ? `Need ${(item.point_cost - userPoints).toLocaleString()} more points`
            : 'Redeem Now'}
        </Button>
      </CardFooter>
    </Card>
  );
}
