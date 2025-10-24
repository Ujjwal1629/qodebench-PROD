'use client';

import { useEffect, useState } from 'react';
import { getUserRedemptions, Redemption } from '@/app/actions/rewards';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Image from 'next/image';

export function RedemptionHistory() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRedemptions = async () => {
      setIsLoading(true);
      const data = await getUserRedemptions();
      setRedemptions(data);
      setIsLoading(false);
    };

    fetchRedemptions();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (redemptions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No redemptions yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Start earning points and redeem exclusive merch!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Redemption History</h2>
      {redemptions.map((redemption) => (
        <Card key={redemption.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Item Image */}
              <div className="relative h-20 w-20 bg-slate-200 rounded flex items-center justify-center flex-shrink-0">
                {redemption.merch_item?.image_url ? (
                  <Image
                    src={redemption.merch_item.image_url}
                    alt={redemption.merch_item.name}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <Package className="h-8 w-8 text-slate-400" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {redemption.merch_item?.name || 'Item'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(redemption.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <StatusBadge status={redemption.status} />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-semibold text-blue-600">
                      {redemption.points_spent.toLocaleString()}
                    </span>{' '}
                    points
                  </div>
                  {redemption.size && (
                    <div>
                      Size: <span className="font-semibold">{redemption.size}</span>
                    </div>
                  )}
                </div>

                {redemption.tracking_number && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-muted-foreground">Tracking:</span>
                    <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                      {redemption.tracking_number}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { icon: React.ReactNode; variant: any; label: string }> = {
    pending: {
      icon: <Clock className="h-3 w-3" />,
      variant: 'secondary',
      label: 'Pending',
    },
    processing: {
      icon: <Package className="h-3 w-3" />,
      variant: 'default',
      label: 'Processing',
    },
    shipped: {
      icon: <Truck className="h-3 w-3" />,
      variant: 'default',
      label: 'Shipped',
    },
    delivered: {
      icon: <CheckCircle className="h-3 w-3" />,
      variant: 'outline',
      label: 'Delivered',
    },
    cancelled: {
      icon: <XCircle className="h-3 w-3" />,
      variant: 'destructive',
      label: 'Cancelled',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}
