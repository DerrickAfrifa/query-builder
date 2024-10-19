import { Combinator, Field, Operation } from "./types";

const combinatorOptions: { [key in Combinator]: string } = {
  AND: "AND",
  OR: "OR",
};

const fieldOptions: { [key in Field]: string } = {
  amount: "Amount",
  name: "Name",
  id: "ID",
  transaction_state: "Transaction State",
  device_ip: "Device IP",
  installments: "Installments",
};

const defaultValues: { [key in Field]: any } = {
  amount: { amount: 0, currency: "EUR" },
  name: "",
  id: "",
  transaction_state: "SUCCEEDED",
  device_ip: "",
  installments: 0,
};

const currencyOptions: { [key in string]: string } = {
  EUR: "EUR",
  USD: "USD",
  GBP: "GBP",
};

const operationOptions: { [key in Field]: Operation[] } = {
  amount: ["EQUAL", "NOT_EQUAL", "LESS_THAN", "GREATER_THAN"],
  name: ["EQUAL", "NOT_EQUAL"],
  id: ["EQUAL", "NOT_EQUAL"],
  transaction_state: ["EQUAL", "NOT_EQUAL"],
  device_ip: ["EQUAL", "NOT_EQUAL"],
  installments: ["EQUAL", "NOT_EQUAL", "LESS_THAN", "GREATER_THAN"],
};

export {
  combinatorOptions,
  fieldOptions,
  defaultValues,
  currencyOptions,
  operationOptions,
};
