// components/Footer.jsx
import styles from '@/app/modules/footer.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone, MapPin, ShoppingCart } from 'lucide-react'

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                {/* Logo Section */}
                <div className={styles.logoSection}>
                    <Image
                        src="/logo.png"
                        alt="LUX-PARADISE Logo"
                        width={150}
                        height={50}
                        className={styles.logoImage}
                    />
                    <p className={styles.tagline}>
                        Le luxe devient votre paradis quotidien
                    </p>
                </div>

                {/* Navigation Links */}
                <div className={styles.linksSection}>
                    <h3 className={styles.sectionTitle}>Navigation</h3>
                    <ul className={styles.linksList}>
                        <li>
                            <Link href="/produits" className={styles.footerLink}>Produits</Link>
                        </li>
                        <li>
                            <Link href="/a-propos" className={styles.footerLink}>À propos</Link>
                        </li>
                        <li>
                            <Link href="/categories" className={styles.footerLink}>Catégories</Link>
                        </li>
                        <li>
                            <Link href="/panier" className={styles.footerLink}>
                                Panier <ShoppingCart size={16} className={styles.cartIcon} />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className={styles.contactSection}>
                    <h3 className={styles.sectionTitle}>Contactez-nous</h3>
                    <ul className={styles.contactList}>
                        <li className={styles.contactItem}>
                            <Phone size={18} className={styles.contactIcon} />
                            <span>+213 123 456 789</span>
                        </li>
                        <li className={styles.contactItem}>
                            <Mail size={18} className={styles.contactIcon} />
                            <span>contact@luxparadise.com</span>
                        </li>
                        <li className={styles.contactItem}>
                            <MapPin size={18} className={styles.contactIcon} />
                            <span>Alger, Algérie</span>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className={styles.socialSection}>
                    <h3 className={styles.sectionTitle}>Suivez-nous</h3>
                    <div className={styles.socialIcons}>
                        <a
                            href="https://facebook.com/luxparadise"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <Facebook size={24} />
                        </a>
                        <a
                            href="https://instagram.com/luxparadise"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                        >
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className={styles.copyright}>
                <p>© {new Date().getFullYear()} LUX-PARADISE. Tous droits réservés.</p>
            </div>
        </footer>
    )
}