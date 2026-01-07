export interface HighlightRange {
  start: number;
  end: number;
}

// Find the position of a clause in the SQL query
export function findClauseRange(sql: string, step: string): HighlightRange | null {
  const upperSQL = sql.toUpperCase();
  
  // Map step names to keywords we want to highlight
  const stepToKeyword: Record<string, string[]> = {
    'FROM': ['FROM'],
    'WHERE': ['WHERE'],
    'GROUP_BY': ['GROUP', 'BY'],
    'HAVING': ['HAVING'],
    'SELECT': ['SELECT'],
    'ORDER_BY': ['ORDER', 'BY'],
    'LIMIT': ['LIMIT'],
    'JOIN_SCAN_LEFT': ['FROM'],
    'JOIN_SCAN_RIGHT': ['JOIN'],
    'JOIN_MATCH': ['ON'],
    'JOIN_BUILD': ['JOIN'],
  };

  const keywords = stepToKeyword[step];
  if (!keywords) return null;

  // For FROM, return from FROM to the next clause
  if (step === 'FROM' || step === 'JOIN_SCAN_LEFT') {
    const fromIdx = upperSQL.indexOf('FROM');
    if (fromIdx === -1) return null;

    // Find the start (skip whitespace)
    let start = fromIdx;
    while (start < sql.length && /\s/.test(sql[start])) start++;

    // Find the next clause keyword
    const clauses = ['WHERE', 'GROUP', 'HAVING', 'ORDER', 'LIMIT', 'INNER', 'LEFT', 'RIGHT', 'FULL'];
    let end = sql.length;
    
    for (const clause of clauses) {
      const idx = upperSQL.indexOf(clause, fromIdx + 4);
      if (idx !== -1 && idx < end) {
        end = idx;
      }
    }

    // Trim trailing whitespace
    while (end > start && /\s/.test(sql[end - 1])) end--;

    return { start: fromIdx, end };
  }

  // For SELECT, return SELECT clause
  if (step === 'SELECT') {
    const selectIdx = upperSQL.indexOf('SELECT');
    if (selectIdx === -1) return null;

    // Find the end (until FROM)
    let end = upperSQL.indexOf('FROM', selectIdx);
    if (end === -1) end = sql.length;

    // Trim trailing whitespace
    while (end > selectIdx && /\s/.test(sql[end - 1])) end--;

    return { start: selectIdx, end };
  }

  // For WHERE, return WHERE clause
  if (step === 'WHERE') {
    const whereIdx = upperSQL.indexOf('WHERE');
    if (whereIdx === -1) return null;

    // Find the end (until GROUP, HAVING, ORDER, LIMIT, or end)
    const clauses = ['GROUP', 'HAVING', 'ORDER', 'LIMIT'];
    let end = sql.length;
    
    for (const clause of clauses) {
      const idx = upperSQL.indexOf(clause, whereIdx + 5);
      if (idx !== -1 && idx < end) {
        end = idx;
      }
    }

    // Trim trailing whitespace
    while (end > whereIdx && /\s/.test(sql[end - 1])) end--;

    return { start: whereIdx, end };
  }

  // For GROUP BY
  if (step === 'GROUP_BY') {
    const groupIdx = upperSQL.indexOf('GROUP');
    if (groupIdx === -1) return null;

    // Find the end (until HAVING, ORDER, LIMIT, or end)
    const clauses = ['HAVING', 'ORDER', 'LIMIT'];
    let end = sql.length;
    
    for (const clause of clauses) {
      const idx = upperSQL.indexOf(clause, groupIdx + 5);
      if (idx !== -1 && idx < end) {
        end = idx;
      }
    }

    // Trim trailing whitespace
    while (end > groupIdx && /\s/.test(sql[end - 1])) end--;

    return { start: groupIdx, end };
  }

  // For HAVING
  if (step === 'HAVING') {
    const havingIdx = upperSQL.indexOf('HAVING');
    if (havingIdx === -1) return null;

    // Find the end (until ORDER, LIMIT, or end)
    const clauses = ['ORDER', 'LIMIT'];
    let end = sql.length;
    
    for (const clause of clauses) {
      const idx = upperSQL.indexOf(clause, havingIdx + 6);
      if (idx !== -1 && idx < end) {
        end = idx;
      }
    }

    // Trim trailing whitespace
    while (end > havingIdx && /\s/.test(sql[end - 1])) end--;

    return { start: havingIdx, end };
  }

  // For ORDER BY
  if (step === 'ORDER_BY') {
    const orderIdx = upperSQL.indexOf('ORDER');
    if (orderIdx === -1) return null;

    // Find the end (until LIMIT or end)
    let end = upperSQL.indexOf('LIMIT', orderIdx + 5);
    if (end === -1) end = sql.length;

    // Trim trailing whitespace
    while (end > orderIdx && /\s/.test(sql[end - 1])) end--;

    return { start: orderIdx, end };
  }

  // For LIMIT
  if (step === 'LIMIT') {
    const limitIdx = upperSQL.indexOf('LIMIT');
    if (limitIdx === -1) return null;

    return { start: limitIdx, end: sql.length };
  }

  // For JOIN related steps
  if (step === 'JOIN_SCAN_RIGHT' || step === 'JOIN_MATCH' || step === 'JOIN_BUILD') {
    // Find the JOIN keyword (INNER, LEFT, RIGHT, FULL)
    const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'JOIN'];
    let joinIdx = -1;
    let keyword = '';

    for (const jType of joinTypes) {
      const idx = upperSQL.indexOf(jType);
      if (idx !== -1) {
        joinIdx = idx;
        keyword = jType;
        break;
      }
    }

    if (joinIdx === -1) return null;

    // Find the end (until WHERE, GROUP, HAVING, ORDER, LIMIT, or end)
    const clauses = ['WHERE', 'GROUP', 'HAVING', 'ORDER', 'LIMIT'];
    let end = sql.length;
    
    for (const clause of clauses) {
      const idx = upperSQL.indexOf(clause, joinIdx + keyword.length);
      if (idx !== -1 && idx < end) {
        end = idx;
      }
    }

    // Trim trailing whitespace
    while (end > joinIdx && /\s/.test(sql[end - 1])) end--;

    return { start: joinIdx, end };
  }

  return null;
}

