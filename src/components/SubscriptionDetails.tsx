import { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Plus, 
  Minus, 
  CreditCard, 
  Shield,
  Clock,
  Users,
  Database,
  Zap
} from 'lucide-react';
import { Product, CartItem } from '../types/subscription';

interface SubscriptionDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  onProceedToCheckout: () => void;
}

export default function SubscriptionDetails({ 
  product, 
  onBack, 
  onAddToCart, 
  onProceedToCheckout 
}: SubscriptionDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(product.billingPeriod);

  const planOptions = [
    { period: 'monthly' as const, discount: 0, label: 'Monthly', popular: false },
    { period: 'yearly' as const, discount: 20, label: 'Annual (Save 20%)', popular: true }
  ];

  const calculatePrice = (basePriceMonthly: number, period: string, discount: number) => {
    if (period === 'yearly') {
      return Math.round(basePriceMonthly * 12 * (1 - discount / 100));
    }
    return basePriceMonthly;
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      product: {
        ...product,
        billingPeriod: selectedPlan,
        price: calculatePrice(product.price, selectedPlan, selectedPlan === 'yearly' ? 20 : 0)
      },
      quantity
    };
    onAddToCart(cartItem);
    onProceedToCheckout();
  };

  const selectedPlanData = planOptions.find(p => p.period === selectedPlan);
  const finalPrice = calculatePrice(product.price, selectedPlan, selectedPlanData?.discount || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Details</h1>
            <p className="text-gray-600">Choose your plan and get started</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">{product.icon}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  {product.badge && (
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      product.badge === 'Popular' ? 'bg-orange-100 text-orange-700' :
                      product.badge === 'New' ? 'bg-green-100 text-green-700' :
                      product.badge === 'Premium' ? 'bg-purple-100 text-purple-700' :
                      product.badge === 'Enterprise' ? 'bg-indigo-100 text-indigo-700' :
                      product.badge === 'Beta' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Plan Selection */}
              {product.billingPeriod !== 'one-time' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {planOptions.map((plan) => (
                      <div
                        key={plan.period}
                        onClick={() => setSelectedPlan(plan.period)}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPlan === plan.period
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-2 left-4">
                            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                              Most Popular
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{plan.label}</div>
                            <div className="text-sm text-gray-600">
                              ${calculatePrice(product.price, plan.period, plan.discount)}
                              {plan.period === 'yearly' ? '/year' : '/month'}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPlan === plan.period
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPlan === plan.period && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Enterprise Security</div>
                    <div className="text-sm text-gray-600">SOC 2 compliant with end-to-end encryption</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">24/7 Support</div>
                    <div className="text-sm text-gray-600">Round-the-clock technical support</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Team Collaboration</div>
                    <div className="text-sm text-gray-600">Share insights with your team</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Data Export</div>
                    <div className="text-sm text-gray-600">Export data in multiple formats</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Product</span>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900 capitalize">{selectedPlan}</span>
                </div>
                {product.billingPeriod !== 'one-time' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
                {selectedPlanData?.discount && selectedPlanData.discount > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-500 line-through">
                        ${product.price * (selectedPlan === 'yearly' ? 12 : 1) * quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Discount ({selectedPlanData.discount}%)</span>
                      <span className="text-green-600">
                        -${Math.round(product.price * (selectedPlan === 'yearly' ? 12 : 1) * quantity * selectedPlanData.discount / 100)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalPrice * quantity}</span>
                </div>
                <div className="text-sm text-gray-500 text-right">
                  {selectedPlan === 'yearly' ? 'per year' : selectedPlan === 'monthly' ? 'per month' : 'one-time'}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout with Stripe</span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">Get started instantly</div>
                    <div className="text-blue-700">Access your subscription immediately after payment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}