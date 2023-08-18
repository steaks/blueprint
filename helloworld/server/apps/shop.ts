import {app, state, hook, event, operator, ref, set, get, trigger} from "@blueprint/rx";
import {StateRef} from "@blueprint/rx/types";
import _ from "lodash";

const onCustomerEntered = (customerCount$: StateRef<number>) => {
  const currentCount = get(customerCount$);
  set(customerCount$, currentCount + 1);
};

const onCustomerLeft = (customerCount$: StateRef<number>) => {
  const currentCount = get(customerCount$);
  set(customerCount$, currentCount - 1);
};

const onPurchase = (purchaseAmount: number) => {
  sales.push(Number(purchaseAmount));
};

const sales: number[] = [];

const revenue = (): number =>
  _.sum(sales);

const shop$$ = app(() => {
  const open$ = event("open");
  const close$ = event("close");
  const customerEntered$ = event("customerEntered");
  const customerLeft$ = event("customerLeft");
  const purchase$ = event("purchase");

  const isOpen$ = state("isOpen", false);
  const customerCount$ = state("customerCount", 0);
  const purchaseAmount$ = state<number>("purchaseAmount");

  const onOpen$ = hook(
    "onOpen",
    {runWhen: "onlytriggers", triggers: [open$]},
    set(isOpen$, true)
  );

  const onClose$ = hook(
    "onClose",
    {runWhen: "onlytriggers", triggers: [close$]},
    set(customerCount$, 0),
    set(isOpen$, false)
  );

  const onCustomerEntered$ = hook(
    "onCustomerEntered",
    {runWhen: "onlytriggers", triggers: [customerEntered$]},
    operator(onCustomerEntered, ref(customerCount$))
  );

  const onCustomerLeft$ = hook(
    "onCustomerLeft",
    {runWhen: "onlytriggers", triggers: [customerLeft$]},
    operator(onCustomerLeft, ref(customerCount$))
  );

  const revenue$ = hook(
    "revenue",
    {manualTrigger: true},
    operator(revenue)
  );

  const onPurchase$ = hook(
    "onPurchase",
    {runWhen: "onlytriggers", triggers: [purchase$]},
    operator(onPurchase, purchaseAmount$),
    trigger(revenue$)
  );

  return {
    name: "shop",
    state: [isOpen$, customerCount$, purchaseAmount$],
    events: [open$, close$, customerEntered$, customerLeft$, purchase$],
    hooks: [onOpen$, onClose$, onCustomerEntered$, onCustomerLeft$, revenue$, onPurchase$]
  };
});

export default shop$$;