import Rate from '@/components/Rate';
import { FormEvent, useState } from 'react';
import styles from '@/styles/modules/Review.module.scss';
import LinkService from '@/services/link.service';

const CREATE_REVIEW_URL = LinkService.apiReviewsLink();

type Props = {
  productName: string;
  isFirstReview: boolean;
  // eslint-disable-next-line no-unused-vars
  onAddReview: (fields: Record<string, string>) => Promise<void>;
}

export default function ReviewForm({ productName, isFirstReview, onAddReview }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [validateMessage, setValidateMessage] = useState<string>('');

  const isValidRating = () => {
    if (rating === 0) {
      setValidateMessage('Rating is required and should be greather than 0');
      return false;
    }
    return true;
  };

  const changeRating = (rate: number) => {
    setValidateMessage('');
    setRating(rate);
  };

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidRating()) {
      return;
    }

    const form = new FormData(e.target as HTMLFormElement);
    const message = form.get('review')?.toString() || '';
    const name = form.get('name')?.toString() || '';
    const email = form.get('email')?.toString() || '';
    const checkbox = form.get('checkbox');

    if (checkbox) {
      // TODO: handle savinng information in review form
    }
    await onAddReview({ message, name, email, rating: rating.toString() });
  };

  return (
    <section className={styles.reviewFormContainer}>
      <h2 className={styles.reviewFormTitle}>
        {isFirstReview ? `Be the first to review "${productName}"` : 'Add a review'}
      </h2>
      <p>
        Your email address will not be published. Required fields are marked with *.
      </p>

      <form action={CREATE_REVIEW_URL} method="POST" className={styles.reviewForm} onSubmit={submitForm}>
        <div className={styles.reviewFormItem}>
          <div className={styles.reviewFormRating}>
            <label className={`${styles.reviewFormLabel} bold`} htmlFor="rating">Your rating *</label>
            <div id="rating">
              <Rate rating={rating} onChange={changeRating} />
            </div>
          </div>
          {validateMessage && <p className={styles.error}>{validateMessage}</p>}
        </div>

        <div className={styles.reviewFormItem}>
          <label className={`${styles.reviewFormLabel} bold`} htmlFor="review">Your review *</label>
          <textarea
            className={`${styles.reviewFormInput} ${styles.reviewFormArea}`}
            name="review" id="review" maxLength={500}
            cols={45} rows={8} required></textarea>
        </div>

        <div className={styles.reviewFormBlock}>
          <div className={styles.reviewFormItem}>
            <label className={`${styles.reviewFormLabel} bold`} htmlFor="name">Name *</label>
            <input className={styles.reviewFormInput} type="text" id="name" name="name" required />
          </div>

          <div className={styles.reviewFormItem}>
            <label className={`${styles.reviewFormLabel} bold`} htmlFor="email">Email *</label>
            <input
              className={styles.reviewFormInput}
              type="email" inputMode="email"
              id="email" name="email" required
            />
          </div>
        </div>

        <div className={`${styles.reviewFormCheckboxBlock} ${styles.reviewFormItem}`}>
          <input className={styles.reviewFormCheckbox} type="checkbox" id='checkbox' name='checkbox' />
          <label htmlFor="checkbox">
            Save my name, email, and website in this browser for the next time I comment.
          </label>
        </div>

        <button type="submit" className={styles.reviewFormBtn}>
          Submit
        </button>
      </form>
    </section>
  );
}
