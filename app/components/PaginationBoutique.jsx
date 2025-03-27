'use client'
import { useState } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from '@/app/modules/boutique.module.css'

export default function PaginationBoutique({ totalProducts, productsPerPage }) {
    const searchParams = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()

    // Get current page from URL, default to 1 if not set
    const currentPage = Number(searchParams.get('page') || 1)
    const totalPages = Math.ceil(totalProducts / productsPerPage)

    function handlePageChange(newPage) {
        const params = new URLSearchParams(searchParams)
        
        // If it's the first page, remove the page parameter
        if (newPage === 1) {
            params.delete('page')
        } else {
            params.set('page', newPage.toString())
        }

        replace(`${pathname}?${params.toString()}`)
    }

    

    return (
        <div className={styles.paginationContainer}>
            <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
            >
                <ChevronLeft />
            </button>

            <div className={styles.pageNumbers}>
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1
                    return (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`${styles.pageNumberButton} ${pageNumber === currentPage ? styles.active : ''}`}
                        >
                            {pageNumber}
                        </button>
                    )
                })}
            </div>

            <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
            >
                <ChevronRight />
            </button>
        </div>
    )
}