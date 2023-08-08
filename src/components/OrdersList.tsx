import { memo, useRef, useState } from 'react';
import { Order, OrderItem } from '@/interfaces/order';
import { formatDate, formatPrice } from '@/utils/helpers';
import styles from '@/styles/modules/Order.module.scss';
import OrderDetailsModal from './OrderDetailsModal';

function OrdersListComponent({ orders }: { orders: Order[] }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalOrderRef = useRef<Order>();

  if (!orders?.length) {
    return <div>You have no active or shipped orders</div>;
  }

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const onModalOpen = (order: Order) => {
    modalOrderRef.current = order;
    setIsModalOpen(true);
  };

  return (
    <>
      <section className={styles.ordersContainer}>
        <h3>Here is list of your orders:</h3>

        <div className={styles.orders}>
          {orders.map((order: Order) => (
            <div className={styles.orderItem} key={order.orderId}>
              <div className={styles.orderItemHeader}>
                <span className="bold">Order number: {order.orderId}</span>
                <button className={styles.link} onClick={() => onModalOpen(order)}>
                  More info
                </button>
              </div>
              <div className={styles.orderItemBlocks}>
                <div className={styles.orderItemBlock}>
                  <span className="bold">Date of order</span>
                  <time dateTime={order.date}>{formatDate(order.date)}</time>
                </div>
                <div className={styles.orderItemBlock}>
                  <span className="bold">Total</span>
                  <span>$ {formatPrice(order.total)}</span>
                </div>
                <div className={styles.orderItemBlock}>
                  <span className="bold">Status</span>
                  <span>{order.status || 'Unshipped'}</span>
                </div>
                {!!order.trackingNumber
                  && <div className={styles.orderItemBlock}>
                    <a className={styles.link}
                      target="_blank"
                      href={`${order.trackingUrl}${order.trackingNumber}`}
                    >
                      Track your package
                    </a>
                  </div>
                }
              </div>
              <div className={styles.orderItemBlock}>
                <span className="bold">Items</span>
                <div>
                  {order.items.map((item: OrderItem, idx: number) => (
                    <span key={item.info._id}>
                      <a href={`/products/${item.info._id}`} className={styles.link}>
                        {item.info.name}
                      </a> ({item.total}){idx === order.items.length - 1
                        ? ''
                        : ', '
                      }
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        orderId={modalOrderRef.current?.orderId || ''}
        orderTotal={modalOrderRef.current?.total || 0}
      />
    </>
  );
}

const OrdersList = memo(OrdersListComponent);
export default OrdersList;
