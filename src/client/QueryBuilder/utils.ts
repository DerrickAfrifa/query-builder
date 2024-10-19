import { IGroup, IQuery, IRule } from "./types";

const isGroup = (condition: IRule | IGroup): condition is IGroup => {
  return !!(condition as IGroup).combinator;
};

const isRoot = (condition: IGroup | IQuery): condition is IQuery => {
  return !!(condition as IQuery).conditions;
};

const findNode = (
  group: IGroup | IQuery | IRule,
  path: number[]
): IGroup | IQuery | IRule => {
  if (path.length === 0) {
    return group;
  }

  const [currentIndex, ...remainingPath] = path;

  const nextGroup = isRoot(group as IQuery | IGroup)
    ? (group as IQuery).conditions[currentIndex]
    : (group as IGroup).subConditions[currentIndex];

  return findNode(nextGroup, remainingPath);
};

export { isGroup, isRoot, findNode };
