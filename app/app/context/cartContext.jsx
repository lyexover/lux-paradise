'use client'

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export default function CartProvider({children}){


    const [cartLength, setCartLength] = useState(0)

    useEffect(()=> {
        const length = JSON.parse(localStorage.getItem('lux_paradise_cart'))?.length || 0
        setCartLength(length)
    })


    return (
        <CartContext.Provider value={{cartLength, setCartLength}}>
        {children}

         </ CartContext.Provider >
    )
}

export const useCart = () => useContext(CartContext)