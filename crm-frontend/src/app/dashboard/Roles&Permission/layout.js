import styles from './page.module.css'
import Link from 'next/link'

export default function({children}){
    return(
        <>

            <div className={styles.sidebar}>
                <div className={styles.links}>
                    <Link href='/dashboard/Roles&Permission' className={styles.link}>Roles</Link>
                </div>
                <div className={styles.links}>
                     <Link href='/dashboard/Roles&Permission/permission' className={styles.link}>Permissions</Link>
                </div>
            </div>
            {children}
        </>
    )
}