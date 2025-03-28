'use client';

import { ShoppingBasket } from 'lucide-react';
import styles from '@/app/modules/produit.module.css';

export function AddToCartButton() {
  return (
    <button 
      className={styles.commander}
    >
      <ShoppingBasket /> 
      AJOUTER AU PANIER
    </button>
  );
}