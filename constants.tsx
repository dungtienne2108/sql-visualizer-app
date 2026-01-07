
import { Table } from './types';

export const INITIAL_TABLES: Record<string, Table> = {
  users: {
    name: 'users',
    columns: ['id', 'name', 'age', 'country', 'active', 'email'],
    rows: [
      { _id: 'u1', id: 1, name: 'Alice Johnson', age: 25, country: 'USA', active: true, email: 'alice@example.com' },
      { _id: 'u2', id: 2, name: 'Bob Smith', age: 30, country: 'UK', active: false, email: 'bob@example.com' },
      { _id: 'u3', id: 3, name: 'Charlie Brown', age: 22, country: 'USA', active: true, email: 'charlie@example.com' },
      { _id: 'u4', id: 4, name: 'David Wilson', age: 35, country: 'Canada', active: true, email: 'david@example.com' },
      { _id: 'u5', id: 5, name: 'Eve Davis', age: 28, country: 'UK', active: true, email: 'eve@example.com' },
      { _id: 'u6', id: 6, name: 'Frank Miller', age: 32, country: 'Germany', active: true, email: 'frank@example.com' },
      { _id: 'u7', id: 7, name: 'Grace Lee', age: 26, country: 'Japan', active: true, email: 'grace@example.com' },
      { _id: 'u8', id: 8, name: 'Henry Taylor', age: 45, country: 'USA', active: false, email: 'henry@example.com' },
      { _id: 'u9', id: 9, name: 'Ivy White', age: 24, country: 'Australia', active: true, email: 'ivy@example.com' },
      { _id: 'u10', id: 10, name: 'Jack Martinez', age: 38, country: 'Spain', active: true, email: 'jack@example.com' },
      { _id: 'u11', id: 11, name: 'Karen Garcia', age: 29, country: 'France', active: true, email: 'karen@example.com' },
      { _id: 'u12', id: 12, name: 'Leo Anderson', age: 31, country: 'USA', active: true, email: 'leo@example.com' },
      { _id: 'u13', id: 13, name: 'Mia Thomas', age: 27, country: 'Canada', active: false, email: 'mia@example.com' },
      { _id: 'u14', id: 14, name: 'Noah Jackson', age: 33, country: 'UK', active: true, email: 'noah@example.com' },
      { _id: 'u15', id: 15, name: 'Olivia Martin', age: 23, country: 'Germany', active: true, email: 'olivia@example.com' },
    ]
  },
  orders: {
    name: 'orders',
    columns: ['order_id', 'user_id', 'product', 'amount', 'order_date', 'status'],
    rows: [
      { _id: 'o1', order_id: 101, user_id: 1, product: 'Laptop', amount: 1200, order_date: '2024-01-15', status: 'Delivered' },
      { _id: 'o2', order_id: 102, user_id: 2, product: 'Phone', amount: 800, order_date: '2024-01-16', status: 'Delivered' },
      { _id: 'o3', order_id: 103, user_id: 1, product: 'Monitor', amount: 300, order_date: '2024-01-17', status: 'Delivered' },
      { _id: 'o4', order_id: 104, user_id: 3, product: 'Keyboard', amount: 150, order_date: '2024-01-18', status: 'Pending' },
      { _id: 'o5', order_id: 105, user_id: 4, product: 'Desk', amount: 450, order_date: '2024-01-19', status: 'Delivered' },
      { _id: 'o6', order_id: 106, user_id: 1, product: 'Chair', amount: 200, order_date: '2024-01-20', status: 'Delivered' },
      { _id: 'o7', order_id: 107, user_id: 6, product: 'Headphones', amount: 250, order_date: '2024-02-01', status: 'Delivered' },
      { _id: 'o8', order_id: 108, user_id: 7, product: 'Tablet', amount: 600, order_date: '2024-02-02', status: 'Shipped' },
      { _id: 'o9', order_id: 109, user_id: 9, product: 'Webcam', amount: 120, order_date: '2024-02-03', status: 'Pending' },
      { _id: 'o10', order_id: 110, user_id: 10, product: 'Mouse Pad', amount: 25, order_date: '2024-02-04', status: 'Delivered' },
      { _id: 'o11', order_id: 111, user_id: 3, product: 'USB Hub', amount: 45, order_date: '2024-02-05', status: 'Delivered' },
      { _id: 'o12', order_id: 112, user_id: 11, product: 'Monitor Stand', amount: 80, order_date: '2024-02-06', status: 'Shipped' },
      { _id: 'o13', order_id: 113, user_id: 12, product: 'Laptop Stand', amount: 100, order_date: '2024-02-07', status: 'Delivered' },
      { _id: 'o14', order_id: 114, user_id: 14, product: 'Mechanical Keyboard', amount: 180, order_date: '2024-02-08', status: 'Pending' },
      { _id: 'o15', order_id: 115, user_id: 7, product: 'External SSD', amount: 320, order_date: '2024-02-09', status: 'Delivered' },
      { _id: 'o16', order_id: 116, user_id: 4, product: 'Docking Station', amount: 200, order_date: '2024-02-10', status: 'Shipped' },
      { _id: 'o17', order_id: 117, user_id: 1, product: 'Gaming Mouse', amount: 75, order_date: '2024-02-11', status: 'Delivered' },
      { _id: 'o18', order_id: 118, user_id: 15, product: 'Wireless Charger', amount: 65, order_date: '2024-02-12', status: 'Delivered' },
      { _id: 'o19', order_id: 119, user_id: 6, product: 'Monitor', amount: 350, order_date: '2024-02-13', status: 'Pending' },
      { _id: 'o20', order_id: 120, user_id: 11, product: 'Desk Lamp', amount: 55, order_date: '2024-02-14', status: 'Delivered' },
      { _id: 'o21', order_id: 121, user_id: 99, product: 'Premium Keyboard', amount: 250, order_date: '2024-02-15', status: 'Cancelled' },
    ]
  },
  departments: {
    name: 'departments',
    columns: ['dept_id', 'dept_name', 'manager_id', 'location', 'budget'],
    rows: [
      { _id: 'd1', dept_id: 1, dept_name: 'Engineering', manager_id: 1, location: 'New York', budget: 500000 },
      { _id: 'd2', dept_id: 2, dept_name: 'Sales', manager_id: 3, location: 'London', budget: 300000 },
      { _id: 'd3', dept_id: 3, dept_name: 'Marketing', manager_id: 6, location: 'Berlin', budget: 200000 },
      { _id: 'd4', dept_id: 4, dept_name: 'HR', manager_id: 7, location: 'Tokyo', budget: 150000 },
      { _id: 'd5', dept_id: 5, dept_name: 'Finance', manager_id: 10, location: 'Madrid', budget: 350000 },
      { _id: 'd6', dept_id: 6, dept_name: 'Operations', manager_id: 12, location: 'USA', budget: 400000 },
      { _id: 'd7', dept_id: 7, dept_name: 'R&D', manager_id: 99, location: 'Silicon Valley', budget: 750000 },
    ]
  },
  sales: {
    name: 'sales',
    columns: ['id', 'product', 'amount', 'category', 'region', 'quarter'],
    rows: [
      { _id: 's1', id: 101, product: 'Laptop', amount: 1200, category: 'Electronics', region: 'North', quarter: 'Q1' },
      { _id: 's2', id: 102, product: 'Phone', amount: 800, category: 'Electronics', region: 'South', quarter: 'Q1' },
      { _id: 's3', id: 103, product: 'Chair', amount: 150, category: 'Furniture', region: 'North', quarter: 'Q1' },
      { _id: 's4', id: 104, product: 'Desk', amount: 450, category: 'Furniture', region: 'West', quarter: 'Q1' },
      { _id: 's5', id: 105, product: 'Headphones', amount: 200, category: 'Electronics', region: 'East', quarter: 'Q2' },
      { _id: 's6', id: 106, product: 'Monitor', amount: 300, category: 'Electronics', region: 'North', quarter: 'Q2' },
      { _id: 's7', id: 107, product: 'Lamp', amount: 45, category: 'Furniture', region: 'South', quarter: 'Q2' },
      { _id: 's8', id: 108, product: 'Tablet', amount: 600, category: 'Electronics', region: 'West', quarter: 'Q2' },
      { _id: 's9', id: 109, product: 'Keyboard', amount: 150, category: 'Electronics', region: 'East', quarter: 'Q3' },
      { _id: 's10', id: 110, product: 'Bookshelf', amount: 200, category: 'Furniture', region: 'North', quarter: 'Q3' },
      { _id: 's11', id: 111, product: 'Mouse', amount: 50, category: 'Electronics', region: 'South', quarter: 'Q3' },
      { _id: 's12', id: 112, product: 'Desk Organizer', amount: 75, category: 'Furniture', region: 'West', quarter: 'Q3' },
      { _id: 's13', id: 113, product: 'USB Hub', amount: 45, category: 'Electronics', region: 'East', quarter: 'Q4' },
      { _id: 's14', id: 114, product: 'Printer', amount: 300, category: 'Electronics', region: 'North', quarter: 'Q4' },
      { _id: 's15', id: 115, product: 'Office Chair', amount: 250, category: 'Furniture', region: 'South', quarter: 'Q4' },
    ]
  }
};

export const SAMPLE_QUERIES = [
  "SELECT name, age, country FROM users WHERE age > 25",
  "SELECT country, COUNT(*) as user_count FROM users GROUP BY country HAVING user_count > 1 ORDER BY user_count DESC",
  "SELECT category, SUM(amount) as total_sales FROM sales WHERE amount > 100 GROUP BY category ORDER BY total_sales DESC",
  "SELECT name, country FROM users WHERE active = true ORDER BY name ASC",
  "SELECT users.name, orders.product, orders.amount FROM users INNER JOIN orders ON users.id = orders.user_id",
  "SELECT users.name, orders.product FROM users LEFT JOIN orders ON users.id = orders.user_id",
  "SELECT users.name, orders.product FROM users RIGHT JOIN orders ON users.id = orders.user_id",
  "SELECT users.name, orders.product FROM users FULL JOIN orders ON users.id = orders.user_id",
  "SELECT users.name, COUNT(orders.order_id) as order_count FROM users LEFT JOIN orders ON users.id = orders.user_id GROUP BY users.name ORDER BY order_count DESC",
  "SELECT DISTINCT(country) FROM users WHERE active = true ORDER BY country",
  "SELECT region, quarter, SUM(amount) as quarterly_sales FROM sales GROUP BY region, quarter ORDER BY region, quarter"
];

export const EXAMPLES = [
  // Cơ bản
  {
    query: "SELECT name, age, country FROM users WHERE age > 25",
    description: "Chọn tên, tuổi, quốc gia từ users có tuổi > 25",
    category: "Cơ bản"
  },
  {
    query: "SELECT name, country FROM users WHERE active = true ORDER BY name ASC",
    description: "Chọn tên và quốc gia của người dùng đang hoạt động, sắp xếp theo tên",
    category: "Cơ bản"
  },
  {
    query: "SELECT DISTINCT(country) FROM users WHERE active = true ORDER BY country",
    description: "Lấy danh sách quốc gia khác nhau của người dùng đang hoạt động",
    category: "Cơ bản"
  },
  
  // Lọc dữ liệu
  {
    query: "SELECT name, age, country FROM users WHERE age > 25",
    description: "Lọc người dùng có tuổi > 25",
    category: "Lọc dữ liệu"
  },
  
  // Nhóm & Tổng hợp
  {
    query: "SELECT country, COUNT(*) as user_count FROM users GROUP BY country HAVING user_count > 1 ORDER BY user_count DESC",
    description: "Đếm số người dùng theo quốc gia (có >1 người), sắp xếp giảm dần",
    category: "Nhóm & Tổng hợp"
  },
  {
    query: "SELECT category, SUM(amount) as total_sales FROM sales WHERE amount > 100 GROUP BY category ORDER BY total_sales DESC",
    description: "Tính tổng doanh số theo danh mục (>100), sắp xếp giảm dần",
    category: "Nhóm & Tổng hợp"
  },
  {
    query: "SELECT region, quarter, SUM(amount) as quarterly_sales FROM sales GROUP BY region, quarter ORDER BY region, quarter",
    description: "Tính doanh số theo vùng và quý, sắp xếp",
    category: "Nhóm & Tổng hợp"
  },
  
  // Sắp xếp
  {
    query: "SELECT name, country FROM users WHERE active = true ORDER BY name ASC",
    description: "Sắp xếp người dùng đang hoạt động theo tên (A-Z)",
    category: "Sắp xếp"
  },
  
  // Kết nối bảng
  {
    query: "SELECT users.name, orders.product, orders.amount FROM users INNER JOIN orders ON users.id = orders.user_id",
    description: "INNER JOIN: Hiển thị người dùng và đơn hàng của họ (chỉ có match)",
    category: "Kết nối bảng"
  },
  {
    query: "SELECT users.name, orders.product FROM users LEFT JOIN orders ON users.id = orders.user_id",
    description: "LEFT JOIN: Tất cả người dùng + đơn hàng của họ (nếu có)",
    category: "Kết nối bảng"
  },
  {
    query: "SELECT users.name, orders.product FROM users RIGHT JOIN orders ON users.id = orders.user_id",
    description: "RIGHT JOIN: Tất cả đơn hàng + thông tin người dùng (nếu có)",
    category: "Kết nối bảng"
  },
  {
    query: "SELECT users.name, orders.product FROM users FULL JOIN orders ON users.id = orders.user_id",
    description: "FULL JOIN: Tất cả người dùng và đơn hàng (kể cả không match)",
    category: "Kết nối bảng"
  },
  {
    query: "SELECT users.name, COUNT(orders.order_id) as order_count FROM users LEFT JOIN orders ON users.id = orders.user_id GROUP BY users.name ORDER BY order_count DESC",
    description: "LEFT JOIN + GROUP BY: Đếm đơn hàng của mỗi người dùng",
    category: "Kết nối bảng"
  }
];
