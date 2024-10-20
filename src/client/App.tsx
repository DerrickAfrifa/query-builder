import { useState } from "react";
import axios from "axios";
import { QueryBuilder } from "./QueryBuilder";
import { IQuery } from "./QueryBuilder/types";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import aod from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";

SyntaxHighlighter.registerLanguage("javascript", json);

const App = () => {
  const initialQuery: IQuery = {
    combinator: "AND",
    conditions: [
      {
        fieldName: "name",
        operation: "EQUAL",
        value: "",
      },
    ],
  };  
  const [query, setQuery] = useState<IQuery>(initialQuery);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleClick = async () => {
    try {
      await axios.post("/api/save-rules", {});
      alert("Submitted");
    } catch {
      alert("Error");
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(query, null, 2)).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
    });
  };

  return (
    <div className="flex flex-col md:p-4">
      <h1 className="text-2xl font-bold my-4 mx-2 md:mx-0 md:my-2">Query Builder</h1>

      <div className="flex flex-col md:flex-row bg-neutral-100 p-4 md:rounded-md text-sm">
        <div className="flex flex-col w-full md:w-2/3 md:h-[80vh] max-h-[80vh] overflow-y-auto rounded-md border border-slate-300 mb-4 md:mb-0">
          <QueryBuilder query={query} setQuery={setQuery} />
        </div>

        <div className="flex flex-col w-full md:w-1/3 mx-0 md:mx-4">
          <div className="relative">
            <SyntaxHighlighter
              className="md:h-[80vh] max-h-[80vh] overflow-y-auto bg-white p-2 rounded-md shadow"
              language="json"
              style={aod}
            >
              {JSON.stringify(query, null, 2)}
            </SyntaxHighlighter>
            <button
              onClick={handleCopyJSON}
              className="absolute top-2 right-4 bg-slate-100 text-slate-800 px-2 py-1 text-sm rounded-md hover:bg-slate-200 hidden md:block"
            >
              {copySuccess ? "Copied!" : "Copy JSON"}
            </button>
          </div>
          <form className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setQuery(initialQuery)}
              className="bg-red-500 text-white px-4 py-2 text-sm rounded-md hover:bg-red-600"
            >
              Reset
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
};

export default App;
