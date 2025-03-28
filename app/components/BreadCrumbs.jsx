'use client'
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { House, ChevronRight } from "lucide-react"
import Link from "next/link"
import styles from '@/app/modules/breadcrumb.module.css'


export default function BreadCrumbs(){

    const  pathname = usePathname()
    const [path, setPath] = useState([])

    useEffect(()=> {
        
        const slices = pathname.split('/').filter(slice=> slice !== '')
        setPath(['home', ...slices])

    }, [pathname])


    return (
        <div className={styles.container}>
            {  path.map((segment, index) => {

                    const href = `/${path.slice(1, index + 1).join('/')}`
                    if (index == 0) return <Link className={styles.segment} key={segment} href={'/'} ><House width={17} height={17}  /> :</Link> 

                    else {
                        return <Link className={styles.segment} key={segment} href={href} ><ChevronRight width={17} height={17} />{`${segment}`}</Link>
                    }
                })
            }
        </div>
    )
}