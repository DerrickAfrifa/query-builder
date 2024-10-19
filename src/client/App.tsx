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
    <div className="flex flex-col px-4">
      <h1 className="text-2xl font-bold mb-4">Query Builder</h1>

      <div className="flex bg-neutral-100 p-4 rounded-md text-sm">
        <div className="flex flex-col w-2/3 h-[85vh] max-h-[85vh] overflow-y-auto rounded-md border border-slate-300">
          <QueryBuilder query={query} setQuery={setQuery} />
        </div>

        <div className="flex flex-col w-1/3 mx-4">
          <pre className="max-h-[80vh] overflow-y-auto bg-white p-2 rounded-md shadow">
            {JSON.stringify(query, null, 2)}
          </pre>
          <form className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClick}
              className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700"
            >
              Submit
            </button>            
          </form>          
        </div>

      </div>


    </div>
  );
}

export default App;
