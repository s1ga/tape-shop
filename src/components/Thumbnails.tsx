import styles from '@/styles/modules/Thumbnails.module.scss';
import Image from 'next/image';
import { useState } from 'react';

// TODO: implement
export default function Thumbnails({ images }: { images: string[] }) {
  const [selected, setSelected] = useState<number>(0);

  const changeImage = (idx: number) => {
    setSelected(idx);
  };

  return (
    <div>
      <div className={styles.mainBlock}>
        {images.map((img: string, idx: any) => (
          <Image
            key={`${img}_${idx}`}
            className={`${styles.mainImg} ${selected !== idx && styles.mainImgHidden}`}
            src={images[selected]}
            alt={''}
            width={280}
            height={280}
          />
        ))}
      </div>

      <ul className={styles.thumbContainer}>
        {images.map((img: string, idx: number) => (
          <li
            key={`${img}_${idx}`}
            className={`${styles.thumbImg} ${selected === idx && styles.thumbImgActive}`}
            onClick={() => changeImage(idx)}
          >
            <Image
              src={img}
              alt={''}
              width={60}
              height={60}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
