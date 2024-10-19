import { useState } from "react";
import axios from "axios";
import { QueryBuilder } from "./QueryBuilder";
import { IQuery } from "./QueryBuilder/types";

const initialQuery: IQuery = {
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


const App = () => {
  const [query, setQuery] = useState<IQuery>(initialQuery);

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
