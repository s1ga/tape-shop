import { PreparedReview, Review } from '@/interfaces/review';
import styles from '@/styles/modules/Review.module.scss';
import { useState } from 'react';
import Loader from '@/components/Loader';
import httpMethods from '@/constants/httpMethods';
import getDomain from '@/utils/getDomain';
import { ServerData } from '@/interfaces/serverData';
import ToastService from '@/services/toast.service';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';

type Props = {
  fetchedReviews: Review[];
  productId: string;
  productName: string;
}

const REVIEW_URL = `${getDomain()}/api/reviews`;

export default function Reviews({ fetchedReviews, productName, productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>(fetchedReviews);
  const [loading, setLoading] = useState<boolean>(false);

  const addReview = async (fields: Record<string, string>) => {
    const body: PreparedReview = {
      rating: +fields.rating,
      text: fields.message,
      name: fields.name,
      email: fields.email,
      productId,
    };

    try {
      setLoading(true);
      const res = await fetch(REVIEW_URL, {
        method: httpMethods.post,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const { data }: ServerData<Review | string> = await res.json();

      if (!res.ok) {
        throw new Error(data as string);
      }

      setReviews((state: Review[]) => [data as Review, ...state]);
    } catch (error: any) {
      console.error(error.message);
      ToastService.error(error.message as string);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {!!reviews.length
        && <ul className={styles.reviews}>
          {reviews.map((r: Review) => (
            <li key={r._id}>
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>
      }

      {!reviews.length && <p className={styles.reviews}>There are no reviews yet.</p>}

      <ReviewForm productName={productName} isFirstReview={!reviews.length} onAddReview={addReview} />
    </>
  );
}
