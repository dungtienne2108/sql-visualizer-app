
import { QueryComponents, Join, SelectColumn } from '../types';

/**
 * Parse SELECT column with potential alias
 * Examples: "name", "COUNT(*) as user_count", "AVG(age)", "DISTINCT(country) AS countries"
 */
const parseSelectColumn = (col: string): SelectColumn => {
  const trimmed = col.trim();
  
  // Check for AS alias
  const asMatch = trimmed.match(/^(.*?)\s+AS\s+(\w+)$/i);
  const expression = asMatch ? asMatch[1].trim() : trimmed;
  const alias = asMatch ? asMatch[2] : undefined;

  // Check for aggregate functions
  const countMatch = expression.match(/COUNT\s*\(\s*(\*|DISTINCT\s+(\w+)|(\w+))\s*\)/i);
  const sumMatch = expression.match(/SUM\s*\(\s*(\w+)\s*\)/i);
  const avgMatch = expression.match(/AVG\s*\(\s*(\w+)\s*\)/i);
  const minMatch = expression.match(/MIN\s*\(\s*(\w+)\s*\)/i);
  const maxMatch = expression.match(/MAX\s*\(\s*(\w+)\s*\)/i);
  const distinctMatch = expression.match(/DISTINCT\s*\(\s*(\w+)\s*\)/i);

  if (countMatch) {
    const isDistinct = countMatch[1].toUpperCase().includes('DISTINCT');
    return {
      expression,
      alias,
      displayName: alias || expression,
      isAggregate: true,
      aggregateType: isDistinct ? 'DISTINCT_COUNT' : 'COUNT',
      aggregateField: isDistinct ? countMatch[2] : '*'
    };
  }

  if (sumMatch) {
    return {
      expression,
      alias,
      displayName: alias || expression,
      isAggregate: true,
      aggregateType: 'SUM',
      aggregateField: sumMatch[1]
    };
  }

  if (avgMatch) {
    return {
      expression,
      alias,
      displayName: alias || expression,
      isAggregate: true,
      aggregateType: 'AVG',
      aggregateField: avgMatch[1]
    };
  }

  if (minMatch) {
    return {
      expression,
      alias,
      displayName: alias || expression,
      isAggregate: true,
      aggregateType: 'MIN',
      aggregateField: minMatch[1]
    };
  }

  if (maxMatch) {
    return {
      expression,
      alias,
      displayName: alias || expression,
      isAggregate: true,
      aggregateType: 'MAX',
      aggregateField: maxMatch[1]
    };
  }

  if (distinctMatch) {
    return {
      expression,
      alias,
      displayName: alias || expression,
      isAggregate: true,
      aggregateType: 'DISTINCT_COUNT',
      aggregateField: distinctMatch[1]
    };
  }

  return {
    expression,
    alias,
    displayName: alias || expression,
    isAggregate: false
  };
};

/**
 * A simplified SQL parser for educational MVP.
 * Focuses on extracting key components from a string.
 */
export const parseSQL = (sql: string): QueryComponents => {
  const normalized = sql.replace(/\s+/g, ' ').trim();
  
  // Basic Regex parsers for MVP clauses
  const selectMatch = normalized.match(/SELECT\s+(.*?)\s+FROM/i);
  const fromMatch = normalized.match(/FROM\s+(\w+)/i);
  
  // JOIN patterns: INNER/LEFT/RIGHT/FULL JOIN table ON condition
  const joinMatches = normalized.matchAll(/(INNER|LEFT|RIGHT|FULL)?\s*(?:OUTER\s+)?JOIN\s+(\w+)\s+ON\s+([\w.]+\s*=\s*[\w.]+)/gi);
  
  const whereMatch = normalized.match(/WHERE\s+(.*?)(?=\s+GROUP BY|\s+ORDER BY|\s+LIMIT|$)/i);
  const groupByMatch = normalized.match(/GROUP BY\s+(.*?)(?=\s+HAVING|\s+ORDER BY|\s+LIMIT|$)/i);
  const havingMatch = normalized.match(/HAVING\s+(.*?)(?=\s+ORDER BY|\s+LIMIT|$)/i);
  const orderByMatch = normalized.match(/ORDER BY\s+(.*?)(?=\s+LIMIT|$)/i);
  const limitMatch = normalized.match(/LIMIT\s+(\d+)/i);

  if (!selectMatch || !fromMatch) {
    throw new Error("Câu lệnh SQL không hợp lệ. Vui lòng kiểm tra lại.");
  }

  const selectColumns = selectMatch[1].split(',').map(s => parseSelectColumn(s.trim()));
  const fromTable = fromMatch[1].toLowerCase();

  const components: QueryComponents = {
    select: selectColumns,
    from: fromTable,
  };

  // Parse JOINs
  if (joinMatches) {
    const joins: Join[] = [];
    for (const match of joinMatches) {
      const joinTypeStr = (match[1] || 'INNER').toUpperCase();
      const joinTable = match[2].toLowerCase();
      const condition = match[3].trim();
      
      // Map to valid join types
      let joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' = 'INNER';
      if (joinTypeStr === 'LEFT') joinType = 'LEFT';
      else if (joinTypeStr === 'RIGHT') joinType = 'RIGHT';
      else if (joinTypeStr === 'FULL') joinType = 'FULL';
      
      // Parse join condition (e.g., "users.id = orders.user_id")
      const condMatch = condition.match(/([\w.]+)\s*=\s*([\w.]+)/);
      if (condMatch) {
        const leftPart = condMatch[1].split('.');
        const rightPart = condMatch[2].split('.');
        
        const leftTable = leftPart[0].toLowerCase();
        const leftColumn = leftPart[1] || leftPart[0];
        const rightTable = rightPart[0].toLowerCase();
        const rightColumn = rightPart[1] || rightPart[0];
        
        joins.push({
          type: joinType,
          table: joinTable,
          condition: { leftTable, leftColumn, rightTable, rightColumn }
        });
      }
    }
    if (joins.length > 0) components.joins = joins;
  }

  if (whereMatch) components.where = whereMatch[1].trim();
  if (groupByMatch) components.groupBy = groupByMatch[1].split(',').map(s => s.trim());
  if (havingMatch) components.having = havingMatch[1].trim();
  
  if (orderByMatch) {
    components.orderBy = orderByMatch[1].split(',').map(s => {
      const parts = s.trim().split(' ');
      return {
        column: parts[0],
        direction: (parts[1] && parts[1].toUpperCase() === 'DESC') ? 'DESC' : 'ASC'
      };
    });
  }

  if (limitMatch) components.limit = parseInt(limitMatch[1], 10);

  return components;
};
