import { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import QueryBuilder from "./QueryBuilder/QueryBuilder";

const initialQuery: Query = {
  combinator: "AND",
  conditions: [
    {
      fieldName: "transaction_state",
      operation: "EQUAL",
      value: "SUCCEEDED",
    },
    {
      combinator: "AND",
      subConditions: [
        {
          fieldName: "amount",
          operation: "EQUAL",
          value: {
            amount: 10,
            currency: "EUR",
          },
        },
        {
          combinator: "OR",
          subConditions: [
            {
              fieldName: "id",
              operation: "EQUAL",
              value: "123",
            },
            {
              fieldName: "device_ip",
              operation: "NOT_EQUAL",
              value: "192.168.0.1",
            },
          ],
        },
      ],
    },
  ],
};

type Field =
  | "amount"
  | "name"
  | "id"
  | "transaction_state"
  | "device_ip"
  | "installments";
type Operation = "EQUAL" | "NOT_EQUAL" | "LESS_THAN" | "GREATER_THAN";
type Combinator = "AND" | "OR";

interface Rule {
  fieldName: Field;
  operation: Operation;
  value: any;
}

interface Group {
  combinator: Combinator;
  subConditions: (Rule | Group)[];
}

interface Query {
  combinator: Combinator;
  conditions: (Rule | Group)[];
}

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

const valueWidgets: { [key in Field]: (value: any) => React.ReactNode } = {
  amount: ({ value, setQuery, query, path }) => (
    <div>
      <input
        type="number"
        value={value.amount || 0}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as Rule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.value = {
            amount: e.target.value,
            currency: value.currency || "EUR",
          };
          setQuery(updatedQuery);
        }}
      />
      <select
        value={value.currency || "EUR"}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as Rule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.value = {
            amount: value.amount || 0,
            currency: e.target.value,
          };
          setQuery(updatedQuery);
        }}
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
        const targetNode = findNode(updatedQuery, path) as Rule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
    />
  ),
  id: ({ value, setQuery, query, path }) => (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as Rule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
    />
  ),
  transaction_state: ({ value, setQuery, query, path }) => (
    <select
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as Rule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
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
        const targetNode = findNode(updatedQuery, path) as Rule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
    />
  ),
  installments: ({ value, setQuery, query, path }) => (
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const updatedQuery = { ...query };
        const targetNode = findNode(updatedQuery, path) as Rule;
        const ruleIndex = path[path.length - 1];
        console.log("targetGroup", targetNode, "index", ruleIndex);
        targetNode.value = e.target.value;
        setQuery(updatedQuery);
      }}
    />
  ),
};

const operationOptions: { [key in Field]: Operation[] } = {
  amount: ["EQUAL", "NOT_EQUAL", "LESS_THAN", "GREATER_THAN"],
  name: ["EQUAL", "NOT_EQUAL"],
  id: ["EQUAL", "NOT_EQUAL"],
  transaction_state: ["EQUAL", "NOT_EQUAL"],
  device_ip: ["EQUAL", "NOT_EQUAL"],
  installments: ["EQUAL", "NOT_EQUAL", "LESS_THAN", "GREATER_THAN"],
};

const findNode = (
  group: Group | Query | Rule,
  path: number[]
): Group | Query | Rule => {

  if (path.length === 0) {
    console.log("found group", group);
    return group;
  }

  const [currentIndex, ...remainingPath] = path;

  const nextGroup = isRoot(group as Query | Group)
    ? (group as Query).conditions[currentIndex]
    : (group as Group).subConditions[currentIndex];

  return findNode(nextGroup, remainingPath);
};

const Rule = ({
  condition,
  path,
  setQuery,
  query,
}: {
  condition: Rule;
  path: number[];
  setQuery: Dispatch<SetStateAction<Query>>;
  query: Query;
}) => {
  const { fieldName, operation, value } = condition;
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <select
        value={fieldName}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as Rule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.fieldName = e.target.value as Field;
          targetNode.value = defaultValues[e.target.value as Field];
          setQuery(updatedQuery);
        }}
      >
        {(Object.keys(fieldOptions) as Field[]).map((field) => (
          <option value={field}>{fieldOptions[field]}</option>
        ))}
      </select>

      <select
        value={operation}
        onChange={(e) => {
          const updatedQuery = { ...query };
          const targetNode = findNode(updatedQuery, path) as Rule;
          const ruleIndex = path[path.length - 1];
          console.log("targetGroup", targetNode, "index", ruleIndex);
          targetNode.operation = e.target.value as Operation;
          setQuery(updatedQuery);
        }}
      >
        {(operationOptions[fieldName] as Operation[]).map((operation) => (
          <option value={operation}>{operation}</option>
        ))}
      </select>

      {valueWidgets[fieldName]({ value, setQuery, query, path })}
    </div>
  );
};

const isGroup = (condition: Rule | Group): condition is Group => {
  return !!(condition as Group).combinator;
};

const isRoot = (condition: Group | Query): condition is Query => {
  return !!(condition as Query).conditions;
};

const Group = ({
  combinator,
  subConditions,
  path,
  setQuery,
  query,
}: {
  combinator: Combinator;
  subConditions: (Rule | Group)[];
  path: number[];
  setQuery: Dispatch<SetStateAction<Query>>;
  query: Query;
}) => {
  return (
    <div style={{ border: "1px solid black", padding: "1rem" }}>
      <div style={{ display: "flex", marginBottom: "1rem", gap: "1rem" }}>
        <select
          value={combinator}
          onChange={(e) => {
            const updatedQuery = { ...query };
            const targetGroup = findNode(updatedQuery, path) as Group | Query;
            targetGroup.combinator = e.target.value as Combinator;
            setQuery(updatedQuery);
          }}
        >
          {(Object.keys(combinatorOptions) as Combinator[]).map((combinator) => (
            <option value={combinator}>{combinatorOptions[combinator]}</option>
          ))}
        </select>

        <button
          onClick={() => {
            const newRule: Rule = {
              fieldName: "name",
              operation: "EQUAL",
              value: "",
            };
            const updatedQuery = { ...query };

            const targetNode = findNode(updatedQuery, path) as Group | Query;
            
            if (isRoot(targetNode)) {
              targetNode.conditions.push(newRule);
            } else if (targetNode.subConditions) {
              targetNode.subConditions.push(newRule);
            }

            setQuery(updatedQuery);
          }}
        >
          + Add Rule
        </button>

        <button
          onClick={() => {
            const newGroup: Group = { combinator: "AND", subConditions: [] };
            const updatedQuery = { ...query };

            const targetNode = findNode(updatedQuery, path) as Group | Query;

            if (isRoot(targetNode)) {
              targetNode.conditions.push(newGroup);
            } else if (targetNode.subConditions) {
              targetNode.subConditions.push(newGroup);
            }

            setQuery(updatedQuery);
          }}
        >
          + Add Group
        </button>
      </div>

      <div>
        {subConditions.map((subCondition, index) =>
          isGroup(subCondition) ? (
            <Group
              combinator={subCondition.combinator}
              subConditions={subCondition.subConditions}
              path={path.concat(index)}
              setQuery={setQuery}
              query={query}
            />
          ) : (
            <Rule
              condition={subCondition as Rule}
              path={path.concat(index)}
              setQuery={setQuery}
              query={query}
            />
          )
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [query, setQuery] = useState<Query>(initialQuery);

  const handleClick = async () => {
    try {
      await axios.post("/api/save-rules", {});
      alert("Submitted");
    } catch {
      alert("Error");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>Query Builder</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "lightgray",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "tomato",
            width: "50%",
          }}
        >
          <QueryBuilder query={query} setQuery={setQuery} />
          {/* <Group
            combinator={query.combinator}
            subConditions={query.conditions}
            path={[]}
            setQuery={setQuery}
            query={query}
          /> */}
        </div>

        <h3>Generated JSON:</h3>
        <pre>{JSON.stringify(query, null, 2)}</pre>
      </div>

      <form>
        <button type="button" onClick={handleClick}>
          Submit
        </button>
        <button type="button" onClick={handleClick}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default App;
