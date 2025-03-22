'use client'

import Image from "next/image"
import Link from "next/link"
import styles from "@/app/modules/dashboard.module.css"
import { usePathname } from "next/navigation"
import { ChartNoAxesCombined, PackageOpen, Warehouse } from 'lucide-react'

export default function DashboardNav() {
    const pathname = usePathname()
    
    const isActive = (path) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(path)
    }

    return (
        <div className={styles.sidebar}>
            <Image className={styles.logo} src='/logo.png' alt='logo' width={409} height={374} />

            <div className={styles.links}>   
                <ul>
                   <li><Link href='/dashboard' className={isActive('/dashboard') ? styles.active : ''}><ChartNoAxesCombined /> Dashboard</Link></li>
                   <li><Link href='/dashboard/produits' className={isActive('/dashboard/produits') ? styles.active : ''}><Warehouse /> Gestion des Produits</Link></li>
                   <li><Link href='/dashboard/commandes' className={isActive('/dashboard/commandes') ? styles.active : ''}><PackageOpen /> Gestion des Commandes</Link></li>
                </ul>
            </div>

            <button>Se déconnecter</button>
        </div>
    )
}