
export type SQLValue = string | number | boolean | null;

export interface TableRow {
  [key: string]: SQLValue;
  _id: string; // Internal unique ID for tracking row movement
  _isExcluded?: boolean; // Used for WHERE/HAVING visualization
  _isUnmatched?: boolean; // Used for LEFT/RIGHT JOIN visualization - row has no match
}

export interface Table {
  name: string;
  columns: string[];
  rows: TableRow[];
}

export enum SQLLogicalStep {
  PARSING = 'PARSING',
  FROM = 'FROM',
  JOIN_SCAN_LEFT = 'JOIN_SCAN_LEFT',
  JOIN_SCAN_RIGHT = 'JOIN_SCAN_RIGHT',
  JOIN_MATCH = 'JOIN_MATCH',
  JOIN_BUILD = 'JOIN_BUILD',
  WHERE = 'WHERE',
  GROUP_BY = 'GROUP BY',
  HAVING = 'HAVING',
  SELECT = 'SELECT',
  ORDER_BY = 'ORDER BY',
  LIMIT = 'LIMIT'
}

export interface ExecutionSnapshot {
  step: SQLLogicalStep;
  title: string;
  description: string;
  rows: TableRow[];
  columns: string[];
  metadata: {
    rowCount: number;
    groupCount?: number;
    operationCount?: number;
    matchCount?: number;
    unmatchedCount?: number;
    joinType?: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    highlightedClause: string;
    joinLeftTable?: string;
    joinRightTable?: string;
  };
}

export interface JoinCondition {
  leftTable: string;
  leftColumn: string;
  rightTable: string;
  rightColumn: string;
}

export interface Join {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  condition: JoinCondition;
}

export interface SelectColumn {
  expression: string; // Original column name or aggregate function
  alias?: string; // Alias if provided with AS
  displayName: string; // What to show in the result (alias or original)
  isAggregate?: boolean; // True if contains COUNT/SUM/AVG/MIN/MAX
  aggregateType?: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 'DISTINCT_COUNT'; // Type of aggregate
  aggregateField?: string; // Field being aggregated
}

export interface QueryComponents {
  select: SelectColumn[];
  from: string;
  joins?: Join[];
  where?: string;
  groupBy?: string[];
  having?: string;
  orderBy?: { column: string; direction: 'ASC' | 'DESC' }[];
  limit?: number;
}

export interface AppState {
  currentQuery: string;
  executionSteps: ExecutionSnapshot[];
  currentStepIndex: number;
  tables: Record<string, Table>;
  isPlaying: boolean;
  error: string | null;
}
