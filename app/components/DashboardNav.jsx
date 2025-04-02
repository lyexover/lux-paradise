'use client'

import Image from "next/image"
import Link from "next/link"
import styles from "@/app/modules/dashboard.module.css"
import { usePathname, useRouter } from "next/navigation"
import { ChartNoAxesCombined, PackageOpen, Warehouse } from 'lucide-react'
import { logOut } from "@/lib/actions" // Importez votre action serveur

export default function DashboardNav() {
    const pathname = usePathname()
    const router = useRouter()
    
    const isActive = (path) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard'
        }
        return pathname.startsWith(path)
    }
    
    const handleLogout = async () => {
        await logOut()
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

            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    )
}