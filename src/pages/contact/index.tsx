import Head from 'next/head';
import styles from '@/styles/modules/Contact.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEnvelope, faHome, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FormEvent, useState } from 'react';
import ContactFeedbackService from '@/services/contactFeedback.service';
import getDomain from '@/utils/getDomain';
import httpMethods from '@/constants/httpMethods';
import ToastService from '@/services/toast.service';
import { ServerData } from '@/interfaces/serverData';
import Loader from '@/components/Loader';

const CONTACT_URL = `${getDomain()}/api/contact-feedback`;

export default function Contact() {
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const body = ContactFeedbackService.prepareFields({
      name: form.get('name')?.toString() || '',
      email: form.get('email')?.toString() || '',
      message: form.get('message')?.toString() || '',
    });

    try {
      const res = await fetch(CONTACT_URL, {
        method: httpMethods.post,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const { data }: ServerData<string> = await res.json();

      if (!res.ok) {
        throw new Error(data as string);
      }
      ToastService.success(data);
    } catch (error: any) {
      console.error(error);
      ToastService.error(error.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact - QuiPtaping</title>
        <meta
          name="description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
        <meta name="dc.title" content="Contact - QuiPtaping" />
        <meta
          name="dc.description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
        <meta name="dc.relation" content={`${process.env.NEXT_PUBLIC_DOMAIN}/contact`} />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/contact`} />
        <meta name="og:url" content={`${process.env.NEXT_PUBLIC_DOMAIN}/contact`} />
        <meta property="og:title" content="Contact - QuiPtaping" />
        <meta
          name="og:description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
        <meta name="twitter:title" content="Contact - QuiPtaping" />
        <meta
          name="twitter:description"
          content="QuiPtaping is a registered brand of Mypro BV., the Netherlands.
           We develop and market applications for tape.
           Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand."
        />
      </Head>
      <div className={`${styles.contact} container`}>
        <section className={styles.contactForm}>
          <h2 className="title centered">Contact</h2>
          {loading && <Loader />}
          {!loading
            && <>
              <p className={styles.contactText}>
                QuiPtaping is a registered brand of Mypro BV., the Netherlands.
                We develop and market applications for tape.
                Our products are marketed in Europe, North America, Canada, Mexico, Australia and New Zealand.
              </p>
              <p>
                Questions or suggestions? Need advice? Simply get in touch. We will be happy to assist you.
              </p>

              <form action={CONTACT_URL} method="POST" className={styles.form} onSubmit={onSubmit}>
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="name">Name</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="email">E-mail</label>
                  <input className={styles.formInput}
                    type="email" inputMode="email" id="email" name="email"
                    placeholder="E-mail" required />
                </div>
                <div className={styles.formItem}>
                  <label className={styles.formLabel} htmlFor="message">Message</label>
                  <textarea
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    id="message" name="message"
                    rows={4} required
                  />
                </div>
                <button type="submit" className={styles.formBtn}>
                  Send
                </button>
              </form>
            </>}
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
