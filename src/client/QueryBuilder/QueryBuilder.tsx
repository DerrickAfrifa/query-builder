import { Dispatch, SetStateAction } from "react";
import Group from "./Group";
import { IQuery } from "./types";


type QueryBuilderProps = { query: IQuery, setQuery: Dispatch<SetStateAction<IQuery>> }

const QueryBuilder = ({ query, setQuery }: QueryBuilderProps) => {
  return (
    <Group
      combinator={query.combinator}
      subConditions={query.conditions}
      path={[]}
      setQuery={setQuery}
      query={query}
      bordered={false}
    />
  );
}

export default QueryBuilder;
