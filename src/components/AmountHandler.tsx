/* eslint-disable no-unused-vars */
import { NOT_DIGIT } from '@/constants/regex';
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
  onChange: (amount: number, isDeleteAction?: boolean) => void;
}

const MAX_NUMBER = 99;

export default function AmountHandler(
  { onChange = () => { }, readonly = false, initialValue = 1, miniView }: Props,
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
    const { value } = e.target as HTMLInputElement;
    const num = parseInt(value.replace(NOT_DIGIT, ''), 10) || 0;
    setAmount(num > MAX_NUMBER ? 99 : num);
  };

  const amountClick = (action: AmountActions) => {
    switch (action) {
      case AmountActions.Add:
        setAmount((state: number) => {
          isDeleteRef.current = false;
          return state + 1;
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
        onClick={() => amountClick(AmountActions.Remove)}
        className={`${styles.productHeaderActionBtn} ${miniView && styles.productHeaderActionBtnMini}`}>
        -
      </button>
      <input
        type="text"
        readOnly={readonly}
        className={`${styles.productHeaderInput} ${miniView && styles.productHeaderInputMini}`}
        value={amount}
        inputMode="numeric"
        onInput={onInput} />
      <button
        onClick={() => amountClick(AmountActions.Add)}
        className={`${styles.productHeaderActionBtn} ${miniView && styles.productHeaderActionBtnMini}`}>
        +
      </button>
    </div>
  );
}
