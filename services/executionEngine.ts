
import { 
  Table, 
  QueryComponents, 
  ExecutionSnapshot, 
  SQLLogicalStep, 
  TableRow, 
  SQLValue,
  Join,
  JoinCondition
} from '../types';

/**
 * Check if two rows match a JOIN condition
 */
const evaluateJoinCondition = (leftRow: TableRow, rightRow: TableRow, condition: JoinCondition): boolean => {
  const leftVal = leftRow[condition.leftColumn];
  const rightVal = rightRow[condition.rightColumn];
  return leftVal === rightVal;
};

/**
 * Simple condition evaluator for WHERE/HAVING
 * Supports: =, >, <, !=, >=, <=
 */
const evaluateCondition = (row: TableRow, condition: string): boolean => {
  try {
    // Very simple evaluator for MVP: replace col names with values
    // Note: In production, use a safe expression parser.
    let expr = condition;
    
    // Support basic 'active = true' or 'age > 25'
    Object.keys(row).forEach(key => {
      if (key.startsWith('_')) return;
      const value = row[key];
      const replacement = typeof value === 'string' ? `'${value}'` : String(value);
      // Word boundary regex to avoid replacing parts of names
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      expr = expr.replace(regex, replacement);
    });

    // Replace SQL syntax with JS
    expr = expr.replace(/=/g, '==').replace(/<>/g, '!=').replace(/AND/gi, '&&').replace(/OR/gi, '||');
    
    // eslint-disable-next-line no-eval
    return !!eval(expr);
  } catch (e) {
    console.error("Evaluation Error:", e);
    return false;
  }
};

export const generateExecutionSteps = (
  query: QueryComponents, 
  tables: Record<string, Table>
): ExecutionSnapshot[] => {
  const steps: ExecutionSnapshot[] = [];
  const sourceTable = tables[query.from];

  if (!sourceTable) {
    throw new Error(`Table '${query.from}' not found.`);
  }

  // 1. FROM STEP
  let currentRows = [...sourceTable.rows];
  let currentColumns = [...sourceTable.columns];
  let tableAliases: Record<string, string> = { [query.from]: query.from };

  steps.push({
    step: SQLLogicalStep.FROM,
    title: 'FROM',
    description: `Tải dữ liệu từ bảng '${sourceTable.name}'. Đây là cơ sở cho tất cả các thao tác tiếp theo.`,
    rows: JSON.parse(JSON.stringify(currentRows)),
    columns: currentColumns,
    metadata: {
      rowCount: currentRows.length,
      highlightedClause: `FROM ${query.from}`
    }
  });

  // 1.5 JOIN STEPS (if any)
  if (query.joins && query.joins.length > 0) {
    for (const join of query.joins) {
      const joinTable = tables[join.table];
      if (!joinTable) {
        throw new Error(`Table '${join.table}' not found for JOIN.`);
      }

      // Step: Scan Left Table (FROM table)
      steps.push({
        step: SQLLogicalStep.JOIN_SCAN_LEFT,
        title: 'JOIN: Scan Left Table',
        description: `Quét bảng trái '${query.from}'. Đây sẽ được so sánh với bảng phải '${join.table}'.`,
        rows: JSON.parse(JSON.stringify(currentRows)),
        columns: currentColumns,
        metadata: {
          rowCount: currentRows.length,
          highlightedClause: `FROM ${query.from}`,
          joinLeftTable: query.from
        }
      });

      // Step: Scan Right Table (JOIN table)
      steps.push({
        step: SQLLogicalStep.JOIN_SCAN_RIGHT,
        title: 'JOIN: Scan Right Table',
        description: `Quét bảng phải '${join.table}'. Mỗi dòng sẽ được kiểm tra đối với điều kiện của bảng trái.`,
        rows: JSON.parse(JSON.stringify(joinTable.rows)),
        columns: joinTable.columns,
        metadata: {
          rowCount: joinTable.rows.length,
          highlightedClause: `JOIN ${join.table}`,
          joinRightTable: join.table
        }
      });

      // Step: Match Condition
      const matches: Array<{ leftRow: TableRow; rightRow: TableRow }> = [];
      const matchedLeftIds = new Set<string>();
      const matchedRightIds = new Set<string>();

      currentRows.forEach(leftRow => {
        joinTable.rows.forEach(rightRow => {
          if (evaluateJoinCondition(leftRow, rightRow, join.condition)) {
            matches.push({ leftRow, rightRow });
            matchedLeftIds.add(leftRow._id);
            matchedRightIds.add(rightRow._id);
          }
        });
      });

      const joinTypeTitle = `${join.type.toUpperCase()} JOIN`;
      steps.push({
        step: SQLLogicalStep.JOIN_MATCH,
        title: `${joinTypeTitle}: Match Condition`,
        description: `Tìm các dòng khớp where ${join.condition.leftTable}.${join.condition.leftColumn} = ${join.condition.rightTable}.${join.condition.rightColumn}. Tìm thấy ${matches.length} dòng khớp.`,
        rows: [], // Visualization handled separately
        columns: [],
        metadata: {
          rowCount: matches.length,
          matchCount: matches.length,
          joinType: join.type,
          highlightedClause: `ON ${join.condition.leftTable}.${join.condition.leftColumn} = ${join.condition.rightTable}.${join.condition.rightColumn}`
        }
      });

      // Step: Build Joined Rows
      const joinedRows: TableRow[] = [];
      let rowCounter = 0;

      // For INNER JOIN: only matched rows
      // For LEFT JOIN: matched rows + unmatched left rows
      // For RIGHT JOIN: matched rows + unmatched right rows
      // For FULL JOIN: matched + unmatched left + unmatched right

      // Add matched rows
      matches.forEach(match => {
        const joined: TableRow = { _id: `j${rowCounter++}` };
        
        // Add left table columns with prefix
        currentColumns.forEach(col => {
          joined[`${query.from}.${col}`] = match.leftRow[col];
        });
        
        // Add right table columns with prefix
        joinTable.columns.forEach(col => {
          joined[`${join.table}.${col}`] = match.rightRow[col];
        });
        
        joinedRows.push(joined);
      });

      // Add unmatched rows based on JOIN type
      if (join.type === 'LEFT' || join.type === 'FULL') {
        currentRows.forEach(leftRow => {
          if (!matchedLeftIds.has(leftRow._id)) {
            const joined: TableRow = { _id: `j${rowCounter++}`, _isUnmatched: true };
            currentColumns.forEach(col => {
              joined[`${query.from}.${col}`] = leftRow[col];
            });
            joinTable.columns.forEach(col => {
              joined[`${join.table}.${col}`] = null;
            });
            joinedRows.push(joined);
          }
        });
      }

      if (join.type === 'RIGHT' || join.type === 'FULL') {
        joinTable.rows.forEach(rightRow => {
          if (!matchedRightIds.has(rightRow._id)) {
            const joined: TableRow = { _id: `j${rowCounter++}`, _isUnmatched: true };
            currentColumns.forEach(col => {
              joined[`${query.from}.${col}`] = null;
            });
            joinTable.columns.forEach(col => {
              joined[`${join.table}.${col}`] = rightRow[col];
            });
            joinedRows.push(joined);
          }
        });
      }

      const joinedColumns = [
        ...currentColumns.map(col => `${query.from}.${col}`),
        ...joinTable.columns.map(col => `${join.table}.${col}`)
      ];

      const unmatchedCount = joinedRows.filter(r => r._isUnmatched).length;
      steps.push({
        step: SQLLogicalStep.JOIN_BUILD,
        title: `${joinTypeTitle}: Kết quả`,
        description: `Tập kết quả của JOIN ${join.type.toLowerCase()}. Số dòng hợp lệ: ${matches.length}, Số dòng không hợp lệ: ${unmatchedCount}. Tổng số dòng: ${joinedRows.length}.`,
        rows: JSON.parse(JSON.stringify(joinedRows)),
        columns: joinedColumns,
        metadata: {
          rowCount: joinedRows.length,
          matchCount: matches.length,
          unmatchedCount: unmatchedCount,
          joinType: join.type,
          highlightedClause: `${join.type.toUpperCase()} JOIN ${join.table}`
        }
      });

      // Update current state for next operations
      currentRows = joinedRows;
      currentColumns = joinedColumns;
      tableAliases[join.table] = join.table;
    }
  }

  // 2. WHERE STEP
  if (query.where) {
    const filteredRows = currentRows.map(row => ({
      ...row,
      _isExcluded: !evaluateCondition(row, query.where!)
    }));

    steps.push({
      step: SQLLogicalStep.WHERE,
      title: 'WHERE',
      description: `Lọc các dòng theo điều kiện: "${query.where}". Các dòng không khớp được đánh dấu để loại bỏ.`,
      rows: JSON.parse(JSON.stringify(filteredRows)),
      columns: currentColumns,
      metadata: {
        rowCount: filteredRows.filter(r => !r._isExcluded).length,
        highlightedClause: `WHERE ${query.where}`
      }
    });

    currentRows = filteredRows.filter(r => !r._isExcluded).map(r => {
      const { _isExcluded, ...rest } = r;
      return rest;
    });
  }

  // 3. GROUP BY & AGGREGATIONS
  // For MVP, we handle simple GROUP BY and COUNT/SUM if mentioned in SELECT
  if (query.groupBy) {
    const groups: Record<string, TableRow[]> = {};
    currentRows.forEach(row => {
      const groupKey = query.groupBy!.map(col => row[col]).join('|');
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(row);
    });

    // Simplified aggregation: just show groups
    steps.push({
      step: SQLLogicalStep.GROUP_BY,
      title: 'GROUP BY',
      description: `Nhóm ${currentRows.length} dòng thành ${Object.keys(groups).length} nhóm dựa trên: ${query.groupBy.join(', ')}.`,
      rows: JSON.parse(JSON.stringify(currentRows)), // Visualization might show grouping visually later
      columns: currentColumns,
      metadata: {
        rowCount: currentRows.length,
        groupCount: Object.keys(groups).length,
        highlightedClause: `GROUP BY ${query.groupBy.join(', ')}`
      }
    });

    // We transform rows into aggregated rows for next steps if grouped
    const aggregatedRows: TableRow[] = Object.keys(groups).map((key, idx) => {
      const groupRows = groups[key];
      const firstRow = groupRows[0];
      const newRow: TableRow = { _id: `g${idx}` };
      
      // Preserve grouped columns
      query.groupBy!.forEach(col => {
        newRow[col] = firstRow[col];
      });

      // Simple detection of aggregates in SELECT
      query.select.forEach(col => {
        const lower = col.toLowerCase();
        if (lower.includes('count(*)')) {
          newRow[col] = groupRows.length;
        } else if (lower.includes('sum(')) {
          const field = col.match(/\((.*?)\)/)?.[1];
          if (field) {
            newRow[col] = groupRows.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
          }
        }
      });

      return newRow;
    });

    currentRows = aggregatedRows;
    currentColumns = Object.keys(aggregatedRows[0]).filter(k => !k.startsWith('_'));
  }

  // 4. HAVING
  if (query.having && query.groupBy) {
    const filteredGroups = currentRows.map(row => ({
      ...row,
      _isExcluded: !evaluateCondition(row, query.having!)
    }));

    steps.push({
      step: SQLLogicalStep.HAVING,
      title: 'HAVING',
      description: `Lọc các nhóm đã nhóm dựa trên: "${query.having}". Điều này xảy ra sau khi nhóm.`,
      rows: JSON.parse(JSON.stringify(filteredGroups)),
      columns: currentColumns,
      metadata: {
        rowCount: filteredGroups.filter(r => !r._isExcluded).length,
        highlightedClause: `HAVING ${query.having}`
      }
    });

    currentRows = filteredGroups.filter(r => !r._isExcluded).map(r => {
      const { _isExcluded, ...rest } = r;
      return rest;
    });
  }

  // 5. SELECT STEP
  // Filter columns and compute final projections
  const finalColumns = query.select.includes('*') 
    ? sourceTable.columns 
    : query.select;

  const projectedRows = currentRows.map(row => {
    const newRow: TableRow = { _id: row._id };
    finalColumns.forEach(col => {
      // If aggregate was already computed in Group By, use it. Otherwise direct mapping.
      newRow[col] = row[col] !== undefined ? row[col] : row[col];
    });
    return newRow;
  });

  steps.push({
    step: SQLLogicalStep.SELECT,
    title: 'SELECT',
    description: `Chiếu tập hợp các cột cuối cùng: ${finalColumns.join(', ')}. Tổng hợp được kết thúc ở đây.`,
    rows: JSON.parse(JSON.stringify(projectedRows)),
    columns: finalColumns,
    metadata: {
      rowCount: projectedRows.length,
      highlightedClause: `SELECT ${query.select.join(', ')}`
    }
  });

  currentRows = projectedRows;
  currentColumns = finalColumns;

  // 6. ORDER BY
  if (query.orderBy) {
    const sortedRows = [...currentRows].sort((a, b) => {
      for (const sort of query.orderBy!) {
        const valA = a[sort.column];
        const valB = b[sort.column];
        if (valA === valB) continue;
        const multiplier = sort.direction === 'ASC' ? 1 : -1;
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * multiplier;
        }
        return String(valA).localeCompare(String(valB)) * multiplier;
      }
      return 0;
    });

    steps.push({
      step: SQLLogicalStep.ORDER_BY,
      title: 'ORDER BY',
      description: `Sắp xếp kết quả cuối cùng. Thứ tự logic: ${query.orderBy.map(s => `${s.column} ${s.direction}`).join(', ')}.`,
      rows: JSON.parse(JSON.stringify(sortedRows)),
      columns: currentColumns,
      metadata: {
        rowCount: sortedRows.length,
        highlightedClause: `ORDER BY ${query.orderBy.map(s => `${s.column} ${s.direction}`).join(', ')}`
      }
    });

    currentRows = sortedRows;
  }

  // 7. LIMIT
  if (query.limit !== undefined) {
    const limitedRows = currentRows.slice(0, query.limit);
    steps.push({
      step: SQLLogicalStep.LIMIT,
      title: 'LIMIT',
      description: `Giới hạn kết quả đến ${query.limit} dòng đầu tiên.`,
      rows: JSON.parse(JSON.stringify(limitedRows)),
      columns: currentColumns,
      metadata: {
        rowCount: limitedRows.length,
        highlightedClause: `LIMIT ${query.limit}`
      }
    });
  }

  return steps;
};
