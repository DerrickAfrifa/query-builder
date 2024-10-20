import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryBuilder } from '../index';
import { IQuery } from '../types';

let initialQuery: IQuery;

beforeEach(() => {
  // Reset initialQuery before each test
  initialQuery = {
    combinator: "AND",
    conditions: [
      {
        fieldName: "name",
        operation: "EQUAL",
        value: "john",
      },
    ],
  };
});

describe('QueryBuilder', () => {
  it('renders initial query', () => {
    const setQuery = vi.fn();
    render(<QueryBuilder query={initialQuery} setQuery={setQuery} />);
    
    expect(screen.getByText('AND')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('EQUAL')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john')).toBeInTheDocument();
  });

  it('adds a new rule', () => {
    const setQuery = vi.fn();
    render(<QueryBuilder query={initialQuery} setQuery={setQuery} />);
    
    fireEvent.click(screen.getByText('+ Add Rule'));
    
    expect(setQuery).toHaveBeenCalled();
    const updatedQuery = setQuery.mock.calls[0][0];
    expect(updatedQuery.conditions.length).toBe(2);
  });

  it('adds a new group', () => {
    const setQuery = vi.fn();
    render(<QueryBuilder query={initialQuery} setQuery={setQuery} />);
    
    fireEvent.click(screen.getByText('+ Add Group'));
    
    expect(setQuery).toHaveBeenCalled();
    const updatedQuery = setQuery.mock.calls[0][0];
    expect(updatedQuery.conditions.length).toBe(2);
    expect(updatedQuery.conditions[1]).toHaveProperty('subConditions');
  });
});
