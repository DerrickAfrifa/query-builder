import { Dispatch, SetStateAction } from "react";
import Rule from "./Rule";
import { Combinator, IGroup, IQuery, IRule } from "./types";
import { findNode, isGroup, isRoot } from "./utils";
import { combinatorOptions } from "./constants";

type GroupProps = {
  combinator: Combinator;
  subConditions: (IRule | IGroup)[];
  path: number[];
  setQuery: Dispatch<SetStateAction<IQuery>>;
  query: IQuery;
  bordered?: boolean;
};

const Group = ({
  combinator,
  subConditions,
  path,
  setQuery,
  query,
  bordered = true,
}: GroupProps) => {

  const newRule: IRule = {
    fieldName: "name",
    operation: "EQUAL",
    value: "",
  };

  const newGroup: IGroup = { combinator: "AND", subConditions: [] };

  const addCondition = (condition: IRule | IGroup) => {
    const updatedQuery = { ...query };
    const targetNode = findNode(updatedQuery, path) as IGroup | IQuery;

    if (isRoot(targetNode)) {
      targetNode.conditions?.push(condition);
    } else if (targetNode.subConditions) {
      targetNode.subConditions?.push(condition);
    }

    setQuery(updatedQuery);
  };

  return (
    <div
      key={path.join("-")}
      className={`border ${
        bordered ? "border-slate-300" : "border-transparent"
      } rounded-md p-2 md:p-4 mb-2 last:mb-0 relative`}
    >
      <div className="flex mb-4 gap-4">
        <select
          key={`${path.join("-")}-combinator`}
          value={combinator}
          onChange={(e) => {
            const updatedQuery = { ...query };
            const targetGroup = findNode(updatedQuery, path) as IGroup | IQuery;
            targetGroup.combinator = e.target.value as Combinator;
            setQuery(updatedQuery);
          }}
          className="border border-gray-300 rounded-md"
        >
          {(Object.keys(combinatorOptions) as Combinator[]).map(
            (combinator) => (
              <option
                key={`${path.join("-")}-${combinator}-option`}
                value={combinator}
              >
                {combinatorOptions[combinator]}
              </option>
            )
          )}
        </select>

        <button
          onClick={() => addCondition(newRule)}
          className="bg-slate-800 text-sm text-white px-2 py-1 rounded-md hover:bg-slate-700 leading-none"
        >
          + Add Rule
        </button>
        <button
          onClick={() => addCondition(newGroup)}
          className="bg-slate-800 text-sm text-white px-2 py-1 rounded-md hover:bg-slate-700 leading-none"
        >
          + Add Group
        </button>
      </div>

      <div>
        {subConditions.map((subCondition, index) =>
          isGroup(subCondition) ? (
            <Group
              key={`${path.join("-")}-${index}-group`}
              combinator={subCondition.combinator}
              subConditions={subCondition.subConditions}
              path={path.concat(index)}
              setQuery={setQuery}
              query={query}
              bordered
            />
          ) : (
            <Rule
              key={`${path.join("-")}-${index}-rule`}
              condition={subCondition as IRule}
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

export default Group;
