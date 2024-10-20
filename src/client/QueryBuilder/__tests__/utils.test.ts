import { describe, it, expect } from 'vitest';
import { findNode, isGroup, isRoot } from '../utils';
import { IQuery } from '../types';

describe('Utils', () => {
  const testQuery: IQuery = {
    combinator: 'AND',
    conditions: [
      { fieldName: 'name', operation: 'EQUAL', value: 'John' },
      {
        combinator: 'OR',
        subConditions: [
          { fieldName: "installments", operation: 'GREATER_THAN', value: 18 },
          { fieldName: "device_ip", operation: 'EQUAL', value: "192.168.1.1" }
        ]
      }
    ]
  };

  describe('findNode', () => {
    it('finds the correct node', () => {
      const node = findNode(testQuery, [1, 0]);
      expect(node).toEqual({ fieldName: 'installments', operation: 'GREATER_THAN', value: 18 });
    });
  });

  describe('isGroup', () => {
    it('correctly identifies a group', () => {
      expect(isGroup(testQuery.conditions[1])).toBe(true);
      expect(isGroup(testQuery.conditions[0])).toBe(false);
    });
  });

  describe('isRoot', () => {
    it('correctly identifies the root query', () => {
      expect(isRoot(testQuery)).toBe(true);
      // @ts-ignore
      expect(isRoot(testQuery.conditions[1])).toBe(false);
    });
  });
});