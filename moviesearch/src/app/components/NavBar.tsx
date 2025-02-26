"use client";
import Link from 'next/link';
import styles from './NavBar.module.css';
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const pathname = usePathname();
    return (
        <div className={styles.navbar}>
            <ul>
                <li>
                    <Link 
                        className={pathname === '/' ? styles.active : ''}                    
                        href="/">Home</Link>
                </li>
                <li>
                    <Link 
                        className={pathname === '/movies' ? styles.active : ''}
                        href="/movies">Movies</Link>
                </li>
            </ul>
        </div>
    )
}
