import styles from './page.module.css'
import Link from 'next/link'

export default function({children}){
    return(
        <>

            <div className={styles.sidebar}>
                <div className={styles.links}>
                    <Link href='/dashboard/master' className={styles.link}>Master : Type</Link>
                </div>
                <div className={styles.links}>
                     <Link href='/dashboard/master/source' className={styles.link}>Master : Source</Link>
                </div>
                <div className={styles.links}>
                     <Link href='/dashboard/master/status' className={styles.link}>Master : Status</Link>
                </div>
            </div>
            {children}
        </>
    )
}