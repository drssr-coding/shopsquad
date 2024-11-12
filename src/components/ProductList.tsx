import React from 'react';
import { ShoppingBag, Plus, User } from 'lucide-react';
import type { Product, Participant } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProductListProps {
  products: Product[];
  participants: Participant[];
  onAssignProduct: (productId: string, participantId: string | null) => void;
  onAddProduct: () => void;
  currentUserId: string;
}

export function ProductList({ products, participants, onAssignProduct, onAddProduct, currentUserId }: ProductListProps) {
  const getTotalAmount = () => {
    return products.reduce((sum, product) => sum + product.price, 0);
  };

  const getParticipantTotal = (participantId: string) => {
    return products
      .filter(product => product.assignedTo === participantId)
      .reduce((sum, product) => sum + product.price, 0);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
        <p className="text-gray-500 mb-6">Start adding products to your shopping list!</p>
        <button
          onClick={onAddProduct}
          className="bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B] text-white px-6 py-3 rounded-xl inline-flex items-center hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Shopping List</h2>
          <p className="text-gray-500">Total: {formatCurrency(getTotalAmount())}</p>
        </div>
        <button
          onClick={onAddProduct}
          className="bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B] text-white px-4 py-2 rounded-xl inline-flex items-center hover:shadow-lg transition-all text-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Added By</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-gray-500">{product.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {participants.find(p => p.id === product.addedBy)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={product.assignedTo || ''}
                      onChange={(e) => onAssignProduct(product.id, e.target.value || null)}
                      className="rounded-xl border border-gray-200 focus:border-[#FF4D8D] focus:ring focus:ring-[#FF4D8D] focus:ring-opacity-50 text-sm"
                      disabled={product.addedBy !== currentUserId && product.assignedTo !== currentUserId}
                    >
                      <option value="">Unassigned</option>
                      {participants.map((participant) => (
                        <option key={participant.id} value={participant.id}>
                          {participant.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Distribution</h3>
        <div className="space-y-3">
          {participants.map((participant) => {
            const total = getParticipantTotal(participant.id);
            const percentage = (total / getTotalAmount()) * 100 || 0;
            
            return (
              <div key={participant.id} className="flex items-center gap-3">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                    <span className="text-sm text-gray-600">{formatCurrency(total)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}