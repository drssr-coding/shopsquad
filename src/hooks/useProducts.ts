import { useState, useCallback } from 'react';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Product, Party } from '../types';

export function useProducts(partyId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = useCallback(async (
    productData: {
      name: string;
      price: number;
      image?: string;
      description?: string;
    },
    userId: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        ...productData,
        addedBy: userId,
        addedAt: Timestamp.now(),
      };

      const partyRef = doc(db, 'parties', partyId);
      await updateDoc(partyRef, {
        products: arrayUnion(newProduct)
      });

      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
      return null;
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  const assignProduct = useCallback(async (
    productId: string,
    participantId: string | null,
    party: Party
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProducts = party.products.map(product => 
        product.id === productId
          ? { ...product, assignedTo: participantId }
          : product
      );

      const partyRef = doc(db, 'parties', partyId);
      await updateDoc(partyRef, { products: updatedProducts });
      return true;
    } catch (err) {
      console.error('Error assigning product:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign product');
      return false;
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  return {
    loading,
    error,
    addProduct,
    assignProduct
  };
}