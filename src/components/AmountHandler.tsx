/* eslint-disable no-unused-vars */
import { NOT_DIGIT } from '@/constants/regex';
import { Product } from '@/interfaces/product/product';
import styles from '@/styles/modules/Product.module.scss';
import { FormEvent, useEffect, useRef, useState } from 'react';

const enum AmountActions {
  Add = 'add',
  Remove = 'remove',
}

type Props = {
  readonly?: boolean;
  initialValue?: number;
  miniView?: boolean;
  availability?: Product['availability'];
  onChange: (amount: number, isDeleteAction?: boolean) => void;
}

const MAX_NUMBER = 99;

export default function AmountHandler(
  { onChange = () => { }, readonly = false, initialValue = 1, availability, miniView }: Props,
) {
  const [amount, setAmount] = useState<number>(1);
  const isDeleteRef = useRef<boolean>();

  useEffect(() => {
    isDeleteRef.current = undefined;
    setAmount(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isDeleteRef.current === undefined) {
      return;
    }
    onChange(amount, isDeleteRef.current);
  }, [amount, onChange]);

  const onInput = (e: FormEvent) => {
    if (isDeleteRef.current === undefined) {
      isDeleteRef.current = false;
    }
    const { value } = e.target as HTMLInputElement;
    let num: number = parseInt(value.replace(NOT_DIGIT, ''), 10) || 0;
    if (num < 0) {
      num = 0;
    }
    if (num > MAX_NUMBER) {
      num = 99;
    }
    if (availability && num > availability) {
      num = availability;
    }
    setAmount(num);
  };

  const amountClick = (action: AmountActions) => {
    switch (action) {
      case AmountActions.Add:
        setAmount((state: number) => {
          isDeleteRef.current = false;
          let newValue: number = state + 1;
          if (availability && newValue > availability) {
            newValue = availability;
          }
          return newValue;
        });
        break;
      case AmountActions.Remove:
        setAmount((state: number) => {
          isDeleteRef.current = true;
          return state > 0 ? state - 1 : 0;
        });
        break;
      default:
        console.warn(`No such amount button action: ${action}`);
        break;
    }
  };

  return (
    <div className={styles.productHeaderCartActions}>
      <button
        disabled={amount <= 0}
        onClick={() => amountClick(AmountActions.Remove)}
        className={`${styles.productHeaderActionBtn} ${miniView && styles.productHeaderActionBtnMini}`}>
        -
      </button>
      <input
        type="text"
        readOnly={readonly}
        className={`${styles.productHeaderInput} ${miniView && styles.productHeaderInputMini}`}
        value={amount}
        max={availability ?? undefined}
        inputMode="numeric"
        onInput={onInput} />
      <button
        disabled={!!availability && amount >= availability}
        onClick={() => amountClick(AmountActions.Add)}
        className={`${styles.productHeaderActionBtn} ${miniView && styles.productHeaderActionBtnMini}`}>
        +
      </button>
    </div>
  );
}
