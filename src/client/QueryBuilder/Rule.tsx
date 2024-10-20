import { Dispatch, SetStateAction } from "react";
import { IRule, IQuery, Field, Operation } from "./types";
import { findNode } from "./utils";
import { currencyOptions, defaultValues, fieldOptions, operationOptions } from "./constants";

type RuleProps = {
  condition: IRule;
  path: number[];
  setQuery: Dispatch<SetStateAction<IQuery>>;
  query: IQuery;
};

const valueWidgets: { [key in Field]: (value: any) => React.ReactNode } = {
  amount: ({ value, setQuery, query, path }) => (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 w-full md:w-auto">
      <input
        type="number"
        value={value.amount || 0}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as IRule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.value = {
            amount: e.target.value,
            currency: value.currency || "EUR",
          };
          setQuery(updatedQuery);
        }}
        className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
      />
      <select
        value={value.currency || "EUR"}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as IRule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.value = {
            amount: value.amount || 0,
            currency: e.target.value,
          };
          setQuery(updatedQuery);
        }}
        className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
      >
        {Object.keys(currencyOptions).map((currency) => (
          <option value={currency}>{currencyOptions[currency]}</option>
        ))}
      </select>
    </div>
  ),
  name: ({ value, setQuery, query, path }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as IRule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
      className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
    />
  ),
  id: ({ value, setQuery, query, path }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as IRule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
      className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
    />
  ),
  transaction_state: ({ value, setQuery, query, path }) => (
    <select
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as IRule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
      className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
    >
      <option value="SUCCEEDED">SUCCEEDED</option>
      <option value="REJECTED">REJECTED</option>
      <option value="ERROR">ERROR</option>
      <option value="TIMEOUT">TIMEOUT</option>
      <option value="CANCELLED">CANCELLED</option>
      <option value="FAILED">FAILED</option>
      <option value="ABORTED">ABORTED</option>
    </select>
  ),
  device_ip: ({ value, setQuery, query, path }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as IRule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
      className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
    />
  ),
  installments: ({ value, setQuery, query, path }) => (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as IRule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
      className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
    />
  ),
};

const Rule = ({ condition, path, setQuery, query }: RuleProps) => {
  const { fieldName, operation, value } = condition;
  return (
    <div key={path.join("-")} className="flex flex-col md:flex-row gap-4 md:gap-4 items-center mb-8 md:mb-2">
      <select
        key={`${path.join("-")}-field`}
        value={fieldName}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as IRule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.fieldName = e.target.value as Field;
          targetNode.value = defaultValues[e.target.value as Field];
          setQuery(updatedQuery);
        }}
        className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
      >
        {(Object.keys(fieldOptions) as Field[]).map((field) => (
          <option key={`${path.join("-")}-${field}-option`} value={field}>{fieldOptions[field]}</option>
        ))}
      </select>

      <select
        key={`${path.join("-")}-operation`}
        value={operation}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as IRule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.operation = e.target.value as Operation;
          setQuery(updatedQuery);
        }}
        className="border border-gray-300 rounded-md p-1 w-full md:w-auto"
      >
        {(operationOptions[fieldName] as Operation[]).map((operation) => (
          <option key={`${path.join("-")}-${operation}-option`} value={operation}>{operation}</option>
        ))}
      </select>

      {valueWidgets[fieldName]({ value, setQuery, query, path })}
    </div>
  );
};

export default Rule;
