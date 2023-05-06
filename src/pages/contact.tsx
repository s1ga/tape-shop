import Head from 'next/head';
import styles from '@/styles/modules/Contact.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope, faHome, faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  return (
    <>
      <Head><title>Contact - QuiPtaping</title></Head>
      <div className={`${styles.contact} container`}>
        <section className={styles.contactForm}>
          <h2 className="title centered">Contact</h2>
          <p>
            QuiPtaping is a registered brand of Mypro BV., the Netherlands.
            We develop and market applications for tape.
          </p>
          <p className={styles.contactText}>
            Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand.
          </p>
          <p>Questions or suggestions? Need advice? Simply get in touch. We will be happy to assist you.</p>

          <form className={styles.form}>
            <div className={styles.formItem}>
              <label className={styles.formLabel} htmlFor="name">Name</label>
              <input className={styles.formInput} type="text" id="name" placeholder="Name" required />
            </div>
            <div className={styles.formItem}>
              <label className={styles.formLabel} htmlFor="email">E-mail</label>
              <input className={styles.formInput}
                type="email" inputMode="email" id="email"
                placeholder="E-mail" required />
            </div>
            <div className={styles.formItem}>
              <label className={styles.formLabel} htmlFor="message">Message</label>
              <textarea className={styles.formInput} id="message" rows={4} required />
            </div>
            <button type="submit" className={styles.formBtn}>
              Send
            </button>
          </form>
        </section>
        <section className={styles.contactInfo}>
          <h2 className="title">QuiPtaping</h2>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FontAwesomeIcon icon={faHome} size="xl" />
            </div>
            <div>
              <h3 className={`title ${styles.infoTitle}`}>Address</h3>
              <p>Leidsevaartweg 1</p>
              <p>2106 VK Heemstede</p>
              <p>Nederland</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FontAwesomeIcon icon={faPhone} size="xl" />
            </div>
            <div>
              <h3 className={`title ${styles.infoTitle}`}>Phone no.</h3>
              <a href="tel:+31652088599">+31652088599</a>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FontAwesomeIcon icon={faEnvelope} size="xl" />
            </div>
            <div>
              <h3 className={`title ${styles.infoTitle}`}>E-mail</h3>
              <a href="mailto:info@quiptaping.com">info@quiptaping.com</a>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <FontAwesomeIcon icon={faCheck} size="xl" />
            </div>
            <div>
              <h3 className={`title ${styles.infoTitle}`}>Other</h3>
              <p>
                <span className="bold">CoC</span> = 34259972
              </p>
              <p>
                <span className="bold">VAT</span> = NL817685364B01
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
