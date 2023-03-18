import styles from '@/styles/Footer.module.css';
import { FiPhoneCall } from 'react-icons/fi';
import { MdPolicy } from 'react-icons/md';
import { CgFileDocument } from 'react-icons/cg';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p className={styles.footerText}>© 2022 SaaS. All Rights Reserved</p>
                <nav className={styles.footerNav}>
                    <ul className={styles.footerLinks}>
                        <li className={styles.footerli}>
                            <a className={styles.footera} href="#">Terms of Service <CgFileDocument /><span className={styles.separator}>|</span></a>
                        </li>
                        <li className={styles.footerli}>
                            <a className={styles.footera} href="#">Privacy Policy <MdPolicy /><span className={styles.separator}>|</span></a>
                        </li>
                        <li className={styles.footerli}>
                            <a className={styles.footera} href="#">Contact Us <FiPhoneCall /><span className={styles.separator}>|</span></a>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}
