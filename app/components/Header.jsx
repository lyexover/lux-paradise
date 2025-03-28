'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
                        <a href="#nouveautes">NOUVEAUTÉS</a>
                        <Link href={'/boutique'}>PRODUITS</Link>
                        <a href="#aPropos">À PROPOS</a>
                        <a href="#categories">CATÉGORIES</a>
                    </div>
                </div>

                <div className={styles.right}>
                    <Link href={''} ><Search size={35} /></Link>
                    <Link href={''} ><ShoppingCart size={35} /></Link>
                    <Link href={''} ><Store size={35} /></Link>
                    <Menu size={38} className={styles.menuToggle} onClick={toggleMenu} />
                </div>
            
            
            
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
                <X size={38} className={styles.closeButton} onClick={toggleMenu} />
                
                <div className={styles.links}>
                    <a href="#nouveautes" onClick={toggleMenu}>NOUVEAUTÉS</a>
                    <Link href={'/boutique'} onClick={toggleMenu}>PRODUITS</Link>
                    <a href="#aPropos" onClick={toggleMenu}>À PROPOS</a>
                    <a href="#categories" onClick={toggleMenu}>CATÉGORIES</a>
                </div>
                
                <div className={styles.mobileIcons}>
                    <Link href={''} onClick={toggleMenu}><Search size={30} /></Link>
                    <Link href={''} onClick={toggleMenu}><ShoppingCart size={30} /></Link>
                    <Link href={''} onClick={toggleMenu}><Store size={30} /></Link>
                </div>
            </div>

            </header>
        
    )
}