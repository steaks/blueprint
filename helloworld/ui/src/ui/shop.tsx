import React from "react";
import {
  Shop,
  useClose,
  useCustomerCount,
  useCustomerEntered,
  useCustomerLeft, useIsOpen,
  useOpen, usePurchase, usePurchaseAmount,
  useRevenue
} from "../apps/shop";

const ShopUI = () => {
  const [isOpen] = useIsOpen();
  const [customerCount] = useCustomerCount();
  const [revenue] = useRevenue();
  const [open] = useOpen();
  const [close] = useClose();
  const [customerEntered] = useCustomerEntered();
  const [customerLeft] = useCustomerLeft();
  const [purchase] = usePurchase();
  const [purchaseAmount, setPurchaseAmount] = usePurchaseAmount();

  return (
    <Shop>
      <div>Is Open: {isOpen === false ? "No" : "Yes"}</div>
      <div>Customer Count: {customerCount}</div>
      <div>Revenue: {revenue}</div>
      <hr/>
      <div>
        <button onClick={open}>Open</button>
        <button onClick={close}>Close</button>
      </div>
      <hr/>
      <div>
        <button onClick={customerEntered} disabled={!isOpen}>Customer Entered</button>
        <button onClick={customerLeft} disabled={!isOpen}>Customer Left</button>
      </div>
      <input type="number" defaultValue={purchaseAmount}
             onChange={e => setPurchaseAmount(Number(e.currentTarget.value))} disabled={!isOpen}/>
      <button onClick={purchase} disabled={!isOpen}>Purcahse</button>
    </Shop>
  );
};

export default ShopUI;