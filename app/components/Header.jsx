'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, Store, Menu, X } from "lucide-react"
import styles from '@/app/modules/header.module.css'
import { useCart } from "@/app/context/cartContext"

export default  function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [query, setQuery] = useState('')  // pour la recherche
    const [showSearch, setShowSearch] = useState(false)

    const {cartLength} = useCart()
    const router = useRouter()
    
  const handleSearch = ()=> {
    setQuery('')
      router.push(`/boutique?query=${query}`)
      
  }
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    const toggleSearch = ()=> {
        setShowSearch(prev => !prev)
    }

    return (
        
            <header className={styles.header}>
                <div className={styles.left}>
                    <Image className={styles.logo} src='/logo.png' alt='logo' width={409} height={374} />

                    <div className={styles.links}>
                    <Link href="/#nouveautes">NOUVEAUTÉS</Link>
                    <Link href="/boutique">PRODUITS</Link>
                    <Link href="/#aPropos">À PROPOS</Link>
                    <Link href="/#categories">CATÉGORIES</Link>

                    </div>
                </div>

                <div className={styles.right}>
                    <Link href={''} onClick={toggleSearch} ><Search size={35} /></Link>
                    <Link href={'/panier'} ><ShoppingCart  size={35} /><span>{cartLength}</span></Link>
                    <Link href={'/boutique'} ><Store size={35} /> </Link>
                    <Menu size={38} className={styles.menuToggle} onClick={toggleMenu} />
                </div>
            
            
            
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
                <X size={38} className={styles.closeButton} onClick={toggleMenu} />
                
                <div className={styles.links}>
                    <Link href="#nouveautes" onClick={toggleMenu}>NOUVEAUTÉS</Link>
                    <Link href={'/boutique'} onClick={toggleMenu}>PRODUITS</Link>
                    <Link href="/#aPropos">À PROPOS</Link>
                    <Link href="/#categories">CATÉGORIES</Link>
                </div>
                
                <div className={styles.mobileIcons}>
                    <Link href={''} onClick={toggleMenu}><Search size={30} /></Link>
                    <Link href={'/panier'} onClick={toggleMenu}><ShoppingCart size={30} /></Link>
                    <Link href={'/boutique'} onClick={toggleMenu}><Store size={30} /></Link>
                </div>
            </div>


         { showSearch &&
            <div className={styles.searchContainer}>
               
                <input type="text" name="query" value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="Recherchez un Produit.." />
                <button onClick={handleSearch}>Rechercher</button>
            </div>
           }
            </header>
        
    )
}