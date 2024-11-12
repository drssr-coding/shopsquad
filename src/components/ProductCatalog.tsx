import React, { useState } from 'react';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { productCatalog } from '../data/productCatalog';
import { formatCurrency } from '../utils/formatters';
import type { CatalogProduct } from '../types';

interface ProductCatalogProps {
  onSelectProduct: (product: CatalogProduct) => void;
  onClose: () => void;
}

export function ProductCatalog({ onSelectProduct, onClose }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = Array.from(
    new Set(productCatalog.map(product => product.category))
  );

  const filteredProducts = productCatalog.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B] text-transparent bg-clip-text">
              Add Products
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-200 focus:border-[#FF4D8D] focus:ring focus:ring-[#FF4D8D] focus:ring-opacity-50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 rounded-xl border border-gray-200 focus:border-[#FF4D8D] focus:ring focus:ring-[#FF4D8D] focus:ring-opacity-50"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm text-[#FF4D8D] font-medium mb-1">{product.brand}</div>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:shadow-md transition-shadow flex items-center"
                    >
                      <ShoppingBag className="h-4 w-4 mr-1.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}