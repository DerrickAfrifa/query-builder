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
};

const Group = ({
  combinator,
  subConditions,
  path,
  setQuery,
  query,
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
  }

  return (
    <div style={{ border: "1px solid black", padding: "1rem" }}>
      <div style={{ display: "flex", marginBottom: "1rem", gap: "1rem" }}>
        <select
          value={combinator}
          onChange={(e) => {
            const updatedQuery = { ...query };
            const targetGroup = findNode(updatedQuery, path) as IGroup | IQuery;
            targetGroup.combinator = e.target.value as Combinator;
            setQuery(updatedQuery);
          }}
        >
          {(Object.keys(combinatorOptions) as Combinator[]).map(
            (combinator) => (
              <option value={combinator}>
                {combinatorOptions[combinator]}
              </option>
            )
          )}
        </select>

        <button onClick={() => addCondition(newRule)}> + Add Rule </button>
        <button onClick={() => addCondition(newGroup)}> + Add Group </button>

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
