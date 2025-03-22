import DashboardNav from "@/components/DashboardNav"
import styles from "@/app/modules/dashboard.module.css"


export default function dashboardLayout({children}){
    return (
        <div className={styles.dashboardWrapper} >
            <DashboardNav/>
            <main className={styles.main} >{children}</main>
        </div>
    )
}