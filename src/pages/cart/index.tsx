/* eslint-disable no-unused-vars */
import Head from 'next/head';
import { useCartContext } from '@/context/cartContext';
import { CartItem, Cart as ICart } from '@/interfaces/cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import AmountHandler from '@/components/AmountHandler';
import { formatPrice, roundPrice } from '@/utils/helpers';
import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import ToastService from '@/services/toast.service';
import ScreenUtils from '@/utils/screen';
import httpMethods from '@/constants/httpMethods';
import {
  Accordion, AccordionDetails, AccordionSummary, Backdrop,
  FormControl, FormControlLabel, Radio, RadioGroup, Tooltip,
} from '@mui/material';
import LinkService from '@/services/link.service';
import { ShippingRate, ShippingDestination, ShippingRatesResponse } from '@/interfaces/shippingRates';
import ShippingService from '@/services/shipping.service';
import CurrentCountry from '@/services/country.service';
import Loader from '@/components/Loader';
import ConditionalWrapper from '@/components/ConditionalWrapper';
import { ServerData } from '@/interfaces/serverData';
import { AppliedCoupon } from '@/interfaces/coupon';
import UserService from '@/services/user.service';
import CouponsService from '@/services/coupons.service';
import couponType from '@/constants/coupon';
import styles from '@/styles/modules/Cart.module.scss';

type CartTableProps = {
  isTablet: boolean;
  cart: ICart;
  appliedCoupon: AppliedCoupon | null;
  removeCoupon: CallableFunction;
  removeAllItem: CallableFunction;
  changeProductAmount: CallableFunction;
  onCouponApplied: CallableFunction;
}

type CartTotalProps = {
  isTablet: boolean;
  cart: ICart;
  shippingRates: ShippingRate[] | undefined;
  selectedRate: ShippingRate | undefined;
  defaultAddress: ShippingDestination | undefined;
  fetchShipping: (form: FormData) => void;
  onSelect: (rate: ShippingRate) => void;
  onReset: CallableFunction;
  getCouponText: () => string;
}

const COUPOUN_APPLY_TOAST_SUCCESS = 'coupon-apply-success';
const COUPOUN_APPLY_TOAST_ERROR = 'coupon-apply-error';

export default function Cart() {
  const { cart, removeAllItem, removeItem, addItems, applyCoupon, resetCoupon } = useCartContext();
  const [isTablet, setIsTablet] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>();
  const [selectedRate, setSelectedRate] = useState<ShippingRate>();
  const [addressForm, setAddressForm] = useState<ShippingDestination>();
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const initialAddress = useRef<ShippingDestination>();
  const toastRef = useRef<number | string>();

  useEffect(() => {
    setIsTablet(ScreenUtils.isTablet());
    const handleResize = () => setIsTablet(ScreenUtils.isTablet());
    window.addEventListener('resize', handleResize);

    const address = ShippingService.getDestinationFromStorage();
    if (address) {
      initialAddress.current = address;
      setAddressForm(address);
    }
    const coupon = CouponsService.getFromStorage();
    if (coupon?.code) {
      applyCouponCode(coupon.code);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (addressForm) {
      fetchShipping();
    }
  }, [addressForm]);

  useEffect(() => {
    if (appliedCoupon) {
      applyCoupon(appliedCoupon);
    }
    if ((shippingRates?.length || 0) <= 0) {
      return;
    }
    fetchShipping();
  }, [cart.totalAmount]);

  useEffect(() => {
    const coupon = CouponsService.getFromStorage();
    setAppliedCoupon((state: AppliedCoupon | null) => (coupon ? state : null));
  }, [cart.appliedCouponPrice]);

  useEffect(() => {
    if (selectedRate) {
      ShippingService.saveShippingRateInStorage(selectedRate);
    }
  }, [selectedRate]);

  const reset = () => {
    initialAddress.current = undefined;
    ShippingService.deleteDestinationFromStorage();
    ShippingService.deleteShippingRateFromStorage();
    setShippingRates(undefined);
    setSelectedRate(undefined);
    setAddressForm(undefined);
  };

  const changeAddress = (f: FormData) => {
    const destination = ShippingService.prepareDestination(f);
    setAddressForm(destination);
    ShippingService.saveDestinationInStorage(destination);
  };

  const fetchShipping = () => {
    if (!cart || cart.totalAmount === 0) {
      return;
    }

    setIsLoading(true);
    fetch(LinkService.apiOrdersRatesLink(), {
      method: httpMethods.post,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ShippingService.prepareRatesBody(addressForm!, cart.items)),
    })
      .then(async (res: Response) => {
        const data: ShippingRatesResponse = await res.json();
        if (!data.success) {
          throw new Error(data.errors[0]?.details);
        }

        const savedRate = ShippingService.getShippingRateFromStorage();
        const found = data.rates.find((r: ShippingRate) => r.service_code === savedRate?.service_code);
        setSelectedRate(found ?? data.rates[0]);
        setShippingRates(data.rates);
      })
      .catch((error: Error) => {
        ToastService.error(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const changeProductAmount = (item: CartItem, amount: number, isDelete?: boolean): void => {
    if (isDelete || amount === 0) {
      removeItem(item.info);
    } else {
      addItems(item.info);
    }
  };

  const clearCoupon = () => {
    resetCoupon();
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string) => {
    if (!code) return;
    if (code === appliedCoupon?.code) {
      if (!ToastService.isActive(toastRef.current)) {
        toastRef.current = ToastService.warn(
          'This coupon is already applied',
        );
      }
      return;
    }

    setIsLoading(true);
    fetch(LinkService.apiApplyCouponLink(), {
      method: httpMethods.post,
      body: JSON.stringify({ code }),
      headers: {
        'Content-Type': 'Application/json',
        Authorization: UserService.getUserToken(),
      },
    })
      .then(async (res: Response) => {
        const { data }: ServerData<AppliedCoupon | string> = await res.json();
        if (!res.ok) {
          throw new Error(data as string);
        }

        const result = applyCoupon(data as AppliedCoupon);
        if (typeof result === 'string') return;
        if (!result) {
          clearCoupon();
          return;
        }
        setAppliedCoupon(data as AppliedCoupon);
        ToastService.success(
          `${(data as AppliedCoupon).name} has been applied successfully`,
          { toastId: COUPOUN_APPLY_TOAST_SUCCESS },
        );
      })
      .catch((err: Error) => {
        clearCoupon();
        ToastService.error(err.message, {
          toastId: COUPOUN_APPLY_TOAST_ERROR,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const removeCoupon = () => {
    clearCoupon();
    ToastService.success('Coupon has been removed successfully');
  };

  const getCouponText = useCallback(() => {
    const productsEnum: string[] = [];
    if (appliedCoupon?.appliedProducts.length) {
      appliedCoupon?.appliedProducts.forEach((id: string) => {
        const found = cart.items.find((i: CartItem) => i.info._id === id);
        if (found) {
          productsEnum.push(found.info.name);
        }
      });
    } else {
      cart.items.forEach((i: CartItem) => {
        productsEnum.push(i.info.name);
      });
    }

    const discountText = `${appliedCoupon?.type === couponType.Flat
      ? `$${appliedCoupon.discount}`
      : `${appliedCoupon?.discount}%`}`;
    const discountExceededText = appliedCoupon?.maximumDiscount === cart.appliedCouponPrice
      ? `
        Due to the fact that maximum discount is exceeded, 
        the discount amount is $${appliedCoupon?.maximumDiscount}
      `
      : '';
    const text = `
    ${appliedCoupon?.name} ${appliedCoupon?.type.toLowerCase()} coupon on ${discountText} has been applied.
    The Coupon discount applies to the following products: ${productsEnum.join(', ')}. ${discountExceededText}
    `;
    return text;
  }, [cart, appliedCoupon]);

  return (
    <>
      <Head>
        <title>Cart - QuiPtaping</title>
        <meta name="dc.title" content="Cart - QuiPtaping" />
        <meta name="dc.description" content="Cart" />
        <meta name="dc.relation" content={LinkService.cartLink()} />
        <meta name="robots" content="follow, noindex" />
        <meta property="og:url" content={LinkService.cartLink()} />
        <meta property="og:title" content="Cart - QuiPtaping" />
        <meta property="og:description" content="Cart" />
        <meta name="twitter:title" content="Cart - QuiPtaping" />
        <meta name="twitter:description" content="Cart" />
      </Head>

      <section className={`${styles.cart} container`}>
        <h1 className="title centered">Cart</h1>

        <CartTable
          isTablet={isTablet}
          cart={cart}
          appliedCoupon={appliedCoupon}
          removeCoupon={removeCoupon}
          removeAllItem={removeAllItem}
          changeProductAmount={changeProductAmount}
          onCouponApplied={applyCouponCode}
        />
        {!!cart.totalAmount
          && <CartTotal
            isTablet={isTablet}
            fetchShipping={changeAddress}
            cart={cart}
            defaultAddress={initialAddress.current}
            shippingRates={shippingRates}
            selectedRate={selectedRate}
            onSelect={setSelectedRate}
            onReset={reset}
            getCouponText={getCouponText}
          />
        }

        <Backdrop
          sx={{ zIndex: 1001 }}
          open={isLoading}
        >
          <Loader customColor="#fff" />
        </Backdrop>
      </section>
    </>
  );
}

function CartTable(
  { cart, appliedCoupon, removeCoupon, removeAllItem,
    changeProductAmount, onCouponApplied, isTablet }: CartTableProps,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (cart.totalAmount === 0) {
    return <div>Your cart is currently empty.</div>;
  }

  if (isTablet) {
    return (
      <>
        <table className={styles.cartTable} cellSpacing={0}>
          <tbody>
            {cart.items.map((c: CartItem) => (
              <tr key={c.info._id}>
                <td style={{ justifyContent: 'flex-end' }}>
                  <FontAwesomeIcon
                    className={styles.cartTableIcon}
                    onClick={() => removeAllItem(c.info)}
                    icon={faCircleXmark} size="xl"
                  />
                </td>
                <td style={{ justifyContent: 'center' }}>
                  <Link href={`/products/${c.info._id}`}>
                    <Image
                      className={styles.cartTableImg}
                      src={c.info.images[0]}
                      alt={c.info.name}
                      width={90}
                      height={90}
                      decoding="async"
                      loading="lazy"
                    />
                  </Link>
                </td>
                <td>
                  <span className="bold">Product:</span>
                  <Link className={`${styles.cartTableName} bold`} href={`/products/${c.info._id}`}>
                    {c.info.name}
                  </Link>
                </td>
                <td>
                  <span className="bold">Price:</span>
                  <span>$ {c.info.price}</span>
                </td>
                <td>
                  <span className="bold">Quantity:</span>
                  <AmountHandler
                    availability={c.info.availability}
                    initialValue={c.total}
                    readonly={true}
                    onChange={
                      (amount: number, isDelete?: boolean) => changeProductAmount(c, amount, isDelete)
                    }
                  />
                </td>
                <td>
                  <span className="bold">Subtotal:</span>
                  <span>$ {formatPrice(roundPrice(c.total * c.info.price))}</span>
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ display: 'block' }} colSpan={6}>
                <div className={styles.cartTableAction}>
                  <input
                    className={styles.cartTableInput}
                    type="text"
                    ref={inputRef}
                    placeholder="Coupon code"
                    required
                  />
                  <button
                    className={styles.cartTableBtn}
                    onClick={() => {
                      onCouponApplied(inputRef.current?.value);
                      (inputRef.current as HTMLInputElement).value = '';
                    }}
                  >
                    Apply coupon
                  </button>
                </div>
                {!!appliedCoupon && <div className={styles.cartTableCouponCaption}>
                  {appliedCoupon.name} coupon has been applied.
                  You can <button
                    onClick={() => {
                      (inputRef.current as HTMLInputElement).value = '';
                      removeCoupon();
                    }}
                    className={`${styles.cartLink} ${styles.cartTableActionLink}`}>
                    remove it.
                  </button>
                </div>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  return (
    <>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((c: CartItem) => (
            <tr key={c.info._id}>
              <td>
                <FontAwesomeIcon
                  className={styles.cartTableIcon}
                  onClick={() => removeAllItem(c.info)}
                  icon={faCircleXmark} size="xl"
                />
              </td>
              <td>
                <Link href={`/products/${c.info._id}`}>
                  <Image
                    className={styles.cartTableImg}
                    src={c.info.images[0]}
                    alt={c.info.name}
                    width={85}
                    height={85}
                    decoding="async"
                    loading="lazy"
                  />
                </Link>
              </td>
              <td>
                <Link className={`${styles.cartTableName} bold`} href={`/products/${c.info._id}`}>
                  {c.info.name}
                </Link>
              </td>
              <td>
                $ {c.info.price}
              </td>
              <td>
                <AmountHandler
                  availability={c.info.availability}
                  initialValue={c.total}
                  readonly={true}
                  onChange={
                    (amount: number, isDelete?: boolean) => changeProductAmount(c, amount, isDelete)
                  }
                />
              </td>
              <td>
                $ {formatPrice(roundPrice(c.total * c.info.price))}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={6}>
              <div className={styles.cartTableAction}>
                <input
                  className={styles.cartTableInput}
                  type="text"
                  ref={inputRef}
                  placeholder="Coupon code"
                  required
                />
                <button
                  className={styles.cartTableBtn}
                  onClick={() => {
                    onCouponApplied(inputRef.current?.value);
                    (inputRef.current as HTMLInputElement).value = '';
                  }}
                >
                  Apply coupon
                </button>
              </div>
              {!!appliedCoupon && <div className={styles.cartTableCouponCaption}>
                {appliedCoupon.name} coupon has been applied.
                You can <button
                  onClick={() => {
                    (inputRef.current as HTMLInputElement).value = '';
                    removeCoupon();
                  }}
                  className={`${styles.cartLink} ${styles.cartTableActionLink}`}>
                  remove it.
                </button>
              </div>
              }
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function CartTotal({ cart, fetchShipping, onSelect, selectedRate,
  shippingRates, defaultAddress, isTablet, onReset, getCouponText }: CartTotalProps) {
  const [currentAddress, setCurrentAddress] = useState<string>('');

  useEffect(() => {
    if (defaultAddress) {
      const { city, post_code: postal, street, country_code: country } = defaultAddress;
      setCurrentAddress(`${street}, ${city}, ${postal}, ${country}`);
    }
  }, [defaultAddress]);

  const conditionalWrapper = (children: ReactNode) => (
    <div className={styles.cartTotalMobileWrapper}>{children}</div>
  );

  const setAddress = (form: FormData) => {
    const city = form.get('city')?.toString() || '';
    const street = form.get('street')?.toString() || '';
    const postal = form.get('postal')?.toString() || '';
    setCurrentAddress(`${street}, ${city}, ${postal}, ${CurrentCountry.countryName}`);
  };

  const calculateShipping = (e: FormEvent) => {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    fetchShipping(form);
    setAddress(form);
  };

  const reset = () => {
    setCurrentAddress('');
    onReset();
  };

  const setCurrentRate = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    onSelect(
      shippingRates?.find((r: ShippingRate) => r.service_code === value)!,
    );
  };

  const calculateTotal = useCallback(() => {
    const shippingRate = selectedRate?.total_price || 0;
    const couponTotal = cart.appliedCouponPrice || 0;
    return roundPrice(cart.totalPrice + shippingRate - couponTotal);
  }, [cart, selectedRate]);

  return (
    <div className={styles.cartTotal}>
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th colSpan={2} className={`${styles.cartTotalTitle} title`}>
              Cart totals
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className={`${styles.cartTotalHeading} bold`}>Subtotal: </th>
            <td>
              <span className={`${styles.cartTotalCaption} bold`}>Subtotal:</span>
              <span>$ {formatPrice(roundPrice(cart.totalPrice))}</span>
            </td>
          </tr>
          {!!cart.appliedCouponPrice
            && <tr>
              <th className={`${styles.cartTotalHeading} bold`}>Coupon sale: </th>
              <td>
                <span className={`${styles.cartTotalCaption} bold`}>Coupon sale:</span>
                <div>
                  <span>$ {formatPrice(cart.appliedCouponPrice)}</span>
                  <Tooltip
                    arrow={true}
                    disableInteractive={true}
                    title={getCouponText()}
                    placement="top"
                  >
                    <FontAwesomeIcon
                      className={`${styles.cartTableIcon} ${styles.cartTooltipIcon}`}
                      icon={faCircleInfo}
                    />
                  </Tooltip>
                </div>
              </td>
            </tr>
          }
          <tr>
            <th className={`${styles.cartTotalHeading} bold`}>Shipping: </th>
            <td className={styles.cartTotalShipping}>
              <ConditionalWrapper wrapper={conditionalWrapper} condition={isTablet}>
                <span className={`${styles.cartTotalCaption} bold`}>Shipping:</span>
                <div>
                  {!shippingRates && 'Shipping options will be updated during checkout.'}
                  {shippingRates?.length === 0
                    && <>
                      No shipping options were found for
                      <div className="bold">
                        {currentAddress || 'default'}
                      </div>
                    </>
                  }
                  {(shippingRates?.length || 0) > 0
                    && <>
                      <FormControl>
                        <RadioGroup
                          value={selectedRate?.service_code}
                          onChange={setCurrentRate}
                        >
                          {shippingRates?.map((rate: ShippingRate) => (
                            <FormControlLabel
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontSize: isTablet ? 14 : 16,
                                },
                              }}
                              className={styles.cartTotalLabel}
                              key={rate.service_code}
                              control={
                                <Radio sx={{
                                  '&': { padding: '8px' },
                                  '& .MuiSvgIcon-root': { fontSize: isTablet ? 15 : 16 },
                                }}
                                />
                              }
                              value={rate.service_code}
                              label={`${rate.service_name} - $ ${formatPrice(rate.total_price)}`}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <div className={`${styles.topIndentSm} ${styles.cartTotalShippingAddressMobile}`}>
                        Shipping with {selectedRate?.service_name} to&nbsp;
                        <div className="bold">{currentAddress}</div>
                      </div>
                      <div className={styles.topIndentSm}>
                        Shipping cost: ${formatPrice(selectedRate?.total_price || 0)}
                      </div>
                    </>
                  }
                </div>
              </ConditionalWrapper>
              <div>
                <Accordion sx={{
                  backgroundColor: 'inherit',
                  color: 'inherit',
                  boxShadow: 'none',
                }}>
                  <AccordionSummary sx={{
                    '&': {
                      padding: 0,
                      minHeight: 'auto',
                    },
                    '&.Mui-expanded': {
                      minHeight: 'auto',
                    },
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                    },
                    '& .MuiAccordionSummary-content.Mui-expanded': {
                      margin: 0,
                    },
                  }}>
                    <a className={styles.cartLink}>
                      {shippingRates ? 'Change address' : 'Calculate shipping'}
                    </a>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: 0 }}>
                    <form
                      className={styles.cartTotalForm} method={httpMethods.post}
                      action={LinkService.apiOrdersRatesLink()} onSubmit={calculateShipping}
                      onReset={reset}
                    >
                      <select
                        className={styles.cartTotalInput}
                        defaultValue={CurrentCountry.countryCode} name="country" id="country"
                      >
                        <option style={{ pointerEvents: 'none' }} value={CurrentCountry.countryCode}>
                          {CurrentCountry.countryName}
                        </option>
                      </select>
                      <input
                        defaultValue={defaultAddress?.city || ''}
                        className={styles.cartTotalInput}
                        type="text" placeholder="City"
                        id="city" name="city" required
                      />
                      <input
                        defaultValue={defaultAddress?.street || ''}
                        className={styles.cartTotalInput}
                        type="text" placeholder="Street"
                        id="street" name="street" required
                      />
                      <input
                        defaultValue={defaultAddress?.post_code || ''}
                        className={styles.cartTotalInput}
                        type="text" placeholder="Postal code"
                        id="postal" name="postal" required
                      />
                      <div className={styles.cartTotalActions}>
                        <button className={styles.cartTotalFormBtn} type="submit">
                          Update
                        </button>
                        <button className={styles.cartLink} type="reset">
                          Clear
                        </button>
                      </div>
                    </form>
                  </AccordionDetails>
                </Accordion>
              </div>
            </td>
          </tr>
          <tr>
            <th className={`${styles.cartTotalHeading} bold`}>Total: </th>
            <td>
              <span className={`${styles.cartTotalCaption} bold`}>Total:</span>
              <span>$ {formatPrice(calculateTotal())}</span>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button className={styles.cartTableBtn}>
                Proceed to checkout
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
