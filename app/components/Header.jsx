'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { Search, ShoppingCart, Store, Menu, X } from "lucide-react"
import styles from '@/app/modules/header.module.css'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
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
                    <Link href={''} ><Search size={35} /></Link>
                    <Link href={'/panier'} ><ShoppingCart size={35} /></Link>
                    <Link href={'/boutique'} ><Store size={35} /></Link>
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

            </header>
        
    )
}