import {hook, event, state, app} from "@blueprint/rxreact";

//state
export const useIsOpen = state<boolean>("shop", "isOpen");
export const useCustomerCount = state<number>("shop", "customerCount");
export const usePurchaseAmount = state<number>("shop", "purchaseAmount");

//events
export const useOpen = event("shop", "open");
export const useClose = event("shop", "close");
export const useCustomerEntered = event("shop", "customerEntered");
export const useCustomerLeft = event("shop", "customerLeft");
export const usePurchase = event("shop", "purchase");

//hooks
export const useRevenue = hook<number>("shop", "revenue");

//App
export const Shop = app("shop")