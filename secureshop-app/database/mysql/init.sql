CREATE DATABASE IF NOT EXISTS secureshop;
USE secureshop;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    isAdmin TINYINT(1) DEFAULT 0,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0,
    category VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (username, email, password_hash, isAdmin) VALUES
('admin', 'admin@secureshop.local', '5f4dcc3b5aa765d61d8327deb882cf99', 1),
('alice', 'alice@example.com', '482c811da5d5b4bc6d497ffa98491e38', 0),
('bob', 'bob@example.com', 'e10adc3949ba59abbe56e057f20f883e', 0);

INSERT INTO products (name, description, price, quantity, category) VALUES
('Laptop Pro 15', 'Ordinateur portable haute performance', 1299.99, 50, 'electronique'),
('Casque Audio HD', 'Casque sans fil avec réduction de bruit', 199.99, 150, 'electronique'),
('Sac à dos Urban', 'Sac à dos résistant pour laptop 15 pouces', 79.99, 200, 'accessoires'),
('Clavier Mécanique RGB', 'Clavier gaming switches Cherry MX', 149.99, 80, 'electronique'),
('Souris Ergonomique', 'Souris sans fil ergonomique', 59.99, 120, 'electronique'),
('Webcam 4K', 'Webcam avec autofocus et micro intégré', 89.99, 75, 'electronique'),
('Hub USB-C', 'Hub multiport 7-en-1', 49.99, 200, 'accessoires'),
('Support Laptop', 'Support réglable en aluminium', 39.99, 100, 'accessoires');

INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES
(2, 1, 1, 1299.99, 'completed'),
(2, 2, 2, 399.98, 'completed'),
(3, 3, 1, 79.99, 'pending');
