'use client';

import { useState } from 'react';
import { ToolLayout } from '../tool-layout';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 2499, image: '🎧' },
  { id: 2, name: 'Mechanical Keyboard', price: 3999, image: '⌨️' },
  { id: 3, name: 'USB-C Hub', price: 1299, image: '🔌' },
  { id: 4, name: 'Webcam HD', price: 1999, image: '📷' },
  { id: 5, name: 'Mouse Pad XL', price: 599, image: '🖱️' },
  { id: 6, name: 'Monitor Stand', price: 1499, image: '🖥️' },
];

const VALID_COUPON = 'QODE20';
const COUPON_DISCOUNT = 0.2;

export default function ShoppingCartTool() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'shop' | 'cart' | 'checkout'>('shop');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * COUPON_DISCOUNT) : 0;
  const total = subtotal - discount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === VALID_COUPON) {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  const placeOrder = () => {
    setOrderPlaced(true);
    setView('checkout');
  };

  const handleReset = () => {
    setCart([]);
    setCouponCode('');
    setCouponApplied(false);
    setCouponError('');
    setOrderPlaced(false);
    setView('shop');
  };

  return (
    <ToolLayout
      title="Mini E-Commerce"
      description="Add products to cart, update quantities, apply coupons, and complete a checkout flow. Full E2E practice scenario."
      difficulty="Advanced"
      scenarios={[
        'Add "Wireless Headphones" to cart and verify the cart badge updates.',
        'Add the same product twice and verify quantity becomes 2.',
        'Go to cart, increase and decrease quantities, verify totals update.',
        'Remove an item from cart and verify it disappears.',
        'Apply coupon code "QODE20" and verify 20% discount is applied.',
        'Apply an invalid coupon and verify the error message.',
        'Place an order and verify the success screen.',
        'Verify the subtotal, discount, and total calculations are correct.',
        'Reset and verify the cart is empty.',
      ]}
    >
      <div className="max-w-3xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView('shop')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === 'shop' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              data-testid="nav-shop"
            >
              Shop
            </button>
            <button
              onClick={() => setView('cart')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                view === 'cart' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              data-testid="nav-cart"
            >
              Cart
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" data-testid="cart-badge">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          <button onClick={handleReset} className="text-sm text-sky-600 hover:underline" data-testid="reset-button">
            Reset
          </button>
        </div>

        {/* Shop View */}
        {view === 'shop' && !orderPlaced && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" data-testid="product-grid">
            {products.map((product) => {
              const inCart = cart.find((item) => item.id === product.id);
              return (
                <div key={product.id} className="bg-white border border-slate-200 rounded-xl p-4 text-center" data-testid={`product-${product.id}`}>
                  <div className="text-4xl mb-3">{product.image}</div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1" data-testid={`name-${product.id}`}>{product.name}</h3>
                  <p className="text-sm font-bold text-slate-700 mb-3" data-testid={`price-${product.id}`}>₹{product.price.toLocaleString()}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 bg-sky-600 text-white rounded-lg text-xs font-medium hover:bg-sky-700"
                    data-testid={`add-${product.id}`}
                  >
                    {inCart ? `In Cart (${inCart.quantity})` : 'Add to Cart'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart View */}
        {view === 'cart' && !orderPlaced && (
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-500" data-testid="empty-cart">
                Your cart is empty. Go shop!
              </div>
            ) : (
              <>
                <div className="space-y-3" data-testid="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-4" data-testid={`cart-item-${item.id}`}>
                      <span className="text-2xl">{item.image}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">₹{item.price.toLocaleString()} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 border border-slate-300 rounded text-sm hover:bg-slate-50" data-testid={`decrease-${item.id}`}>-</button>
                        <span className="w-8 text-center text-sm font-medium" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 border border-slate-300 rounded text-sm hover:bg-slate-50" data-testid={`increase-${item.id}`}>+</button>
                      </div>
                      <p className="text-sm font-bold text-slate-900 w-20 text-right" data-testid={`item-total-${item.id}`}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline" data-testid={`remove-${item.id}`}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    data-testid="coupon-input"
                  />
                  <button onClick={applyCoupon} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-900" data-testid="apply-coupon">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600" data-testid="coupon-error">{couponError}</p>}
                {couponApplied && <p className="text-xs text-green-600" data-testid="coupon-success">Coupon QODE20 applied — 20% off!</p>}

                {/* Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span data-testid="subtotal">₹{subtotal.toLocaleString()}</span></div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-green-600"><span>Discount (20%)</span><span data-testid="discount">-₹{discount.toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
                    <span>Total</span><span data-testid="total">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={placeOrder} className="w-full py-3 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700" data-testid="place-order">
                  Place Order — ₹{total.toLocaleString()}
                </button>
              </>
            )}
          </div>
        )}

        {/* Order Success */}
        {orderPlaced && (
          <div className="text-center py-12 space-y-4" data-testid="order-success">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-slate-900">Order Placed!</h2>
            <p className="text-sm text-slate-600">
              Your order of ₹{total.toLocaleString()} has been confirmed.
            </p>
            <p className="text-xs text-slate-500" data-testid="order-id">
              Order ID: ORD-{Date.now().toString(36).toUpperCase()}
            </p>
            <button onClick={handleReset} className="text-sm text-sky-600 hover:underline" data-testid="shop-again">
              Shop Again
            </button>
          </div>
        )}

        {/* Hint */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
          <strong>Coupon:</strong> Use <code className="bg-slate-200 px-1 rounded">QODE20</code> for 20% off.
        </div>
      </div>
    </ToolLayout>
  );
}
