'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MerchItem, redeemMerch, AddressDetails } from '@/app/actions/rewards';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Package } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface RedemptionModalProps {
  item: MerchItem;
  userPoints: number;
  isOpen: boolean;
  onClose: () => void;
}

export function RedemptionModal({ item, userPoints, isOpen, onClose }: RedemptionModalProps) {
  const router = useRouter();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const handleRedeem = async () => {
    // Validate required fields
    if (!addressDetails.name || !addressDetails.address_line1 || !addressDetails.city ||
        !addressDetails.state || !addressDetails.zip || !addressDetails.country || !addressDetails.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate size if required
    if (item.sizes && item.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    setIsRedeeming(true);

    const result = await redeemMerch(item.id, selectedSize || null, addressDetails);

    if (result.success) {
      toast.success('Redemption successful! Your order is being processed.');
      router.refresh();
      onClose();
    } else {
      toast.error(result.error || 'Failed to process redemption');
    }

    setIsRedeeming(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redeem {item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Preview */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="relative h-20 w-20 bg-slate-200 rounded flex items-center justify-center flex-shrink-0">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <Package className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.point_cost.toLocaleString()} points
              </p>
            </div>
          </div>

          {/* Size Selection */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {item.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shipping Address</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-full">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={addressDetails.name}
                  onChange={(e) => setAddressDetails({ ...addressDetails, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2 col-span-full">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  value={addressDetails.address_line1}
                  onChange={(e) => setAddressDetails({ ...addressDetails, address_line1: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>

              <div className="space-y-2 col-span-full">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  value={addressDetails.address_line2}
                  onChange={(e) => setAddressDetails({ ...addressDetails, address_line2: e.target.value })}
                  placeholder="Apt 4B (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={addressDetails.city}
                  onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={addressDetails.state}
                  onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
                  placeholder="CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP/Postal Code *</Label>
                <Input
                  id="zip"
                  value={addressDetails.zip}
                  onChange={(e) => setAddressDetails({ ...addressDetails, zip: e.target.value })}
                  placeholder="94102"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={addressDetails.country}
                  onChange={(e) => setAddressDetails({ ...addressDetails, country: e.target.value })}
                  placeholder="United States"
                />
              </div>

              <div className="space-y-2 col-span-full">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={addressDetails.phone}
                  onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Current Balance:</span>
              <span className="font-semibold">{userPoints.toLocaleString()} points</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Item Cost:</span>
              <span className="font-semibold text-red-600">
                -{item.point_cost.toLocaleString()} points
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-300">
              <span className="font-semibold">Remaining Balance:</span>
              <span className="font-bold text-blue-600">
                {(userPoints - item.point_cost).toLocaleString()} points
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRedeeming}>
            Cancel
          </Button>
          <Button onClick={handleRedeem} disabled={isRedeeming}>
            {isRedeeming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Redemption'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
