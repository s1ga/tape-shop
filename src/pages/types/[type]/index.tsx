import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/modules/Type.module.scss';
import dbConnect from '@/utils/db';
import TypeService from '@/services/type.service';
import { Type } from '@/interfaces/type';
import { Category } from '@/interfaces/category';
import ProductService from '@/services/product.service';

export const getServerSideProps = async ({ params }: { params: { type: string } }) => {
  await dbConnect();

  const type = await TypeService.findById(params.type);
  if (!type) {
    return {
      notFound: true,
    };
  }
  const products = await Promise.all(
    type.categories.map(({ _id }) => ProductService.getByTypeCategories(type._id, _id).count()),
  );
  const counts: Record<string, number> = products
    .reduce((acc: Record<string, number>, curr: number, idx: number) => ({
      ...acc,
      [type.categories[idx]._id]: curr,
    }), {});

  return {
    props: {
      type: JSON.parse(JSON.stringify(type)),
      counts: JSON.parse(JSON.stringify(counts)),
    },
  };
};

export default function Page({ type, counts }: { type: Type, counts: Record<string, number> }) {
  return (
    <>
      <Head>
        <title>{`${type.name} - QuiPtaping`}</title>
      </Head>
      <section className="container">
        <h1 className={`${styles.typeTitle} title centered`}>
          {type.name}
        </h1>

        <div className={styles.list}>
          {type.categories.map((c: Category) => (
            <Link key={c._id} href={`/types/${type.id}/category/${c._id}`} className={styles.categoryCard}>
              <Image
                className={styles.categoryCardImg}
                src={c.imageUrl}
                alt={c.name}
                width={300}
                height={300}
                priority
                decoding="async"
              />
              <div>
                <h3 className={styles.categoryCardTitle}>{c.name}</h3>
                <p className={styles.categoryCardCaption}>
                  {counts[c._id] > 1 ? `${counts[c._id]} products` : `${counts[c._id]} product`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
