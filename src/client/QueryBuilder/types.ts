type Field =
  | "amount"
  | "name"
  | "id"
  | "transaction_state"
  | "device_ip"
  | "installments";
type Operation = "EQUAL" | "NOT_EQUAL" | "LESS_THAN" | "GREATER_THAN";
type Combinator = "AND" | "OR";

interface IRule {
  fieldName: Field;
  operation: Operation;
  value: any;
}

interface IGroup {
  combinator: Combinator;
  subConditions: (IRule | IGroup)[];
}

interface IQuery {
  combinator: Combinator;
  conditions: (IRule | IGroup)[];
}

export type { Field, Operation, Combinator, IRule, IGroup, IQuery };
