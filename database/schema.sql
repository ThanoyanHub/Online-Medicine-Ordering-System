CREATE DATABASE IF NOT EXISTS medicine_ordering CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medicine_ordering;

DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS medicines;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  phone VARCHAR(30),
  address TEXT,
  hashed_password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  profile_picture_url VARCHAR(512),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE medicines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  price DOUBLE NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  manufacturer VARCHAR(120),
  requires_prescription BOOLEAN NOT NULL DEFAULT TRUE,
  image_url VARCHAR(512),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_medicines_name (name),
  INDEX idx_medicines_category (category)
) ENGINE=InnoDB;

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('pending_verification','approved','processing','dispatched','delivered','rejected','cancelled') NOT NULL DEFAULT 'pending_verification',
  total_amount DOUBLE NOT NULL,
  shipping_address TEXT NOT NULL,
  rejection_reason VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DOUBLE NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id)
) ENGINE=InnoDB;

CREATE TABLE prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  image_url VARCHAR(512) NOT NULL,
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prescriptions_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Password for both seeded accounts is: AdminPass123!
INSERT INTO users (full_name, email, phone, address, hashed_password, role) VALUES
('Team 1 Administrator', 'admin@mediorder.local', '+10000000000', 'Admin Office', '$2b$12$2.UydJwWRo6/g4YrS59I3.Eu0gHiM7d/306h6pFMGIDJ5x0k7cPbO', 'admin'),
('Demo Customer', 'customer@mediorder.local', '+10000000001', '12 Health Street, Colombo', '$2b$12$2.UydJwWRo6/g4YrS59I3.Eu0gHiM7d/306h6pFMGIDJ5x0k7cPbO', 'user');

INSERT INTO medicines (name, category, description, price, stock, manufacturer, requires_prescription) VALUES
('Amoxicillin 500mg', 'Antibiotic', 'Broad spectrum antibiotic capsules for bacterial infections. Dispense only against a valid prescription.', 12.50, 120, 'HealthCore Pharma', TRUE),
('Atorvastatin 20mg', 'Cardiology', 'Lipid lowering tablet used for cholesterol management under clinician supervision.', 18.75, 90, 'CardioLabs', TRUE),
('Cetirizine 10mg', 'Allergy', 'Non-drowsy antihistamine tablets for allergy symptoms.', 5.40, 200, 'MediWell', TRUE),
('Metformin 500mg', 'Diabetes', 'Oral diabetes medicine for blood glucose management.', 9.30, 160, 'GlucoCare', TRUE),
('Salbutamol Inhaler', 'Respiratory', 'Reliever inhaler for bronchospasm and asthma symptoms.', 14.20, 75, 'BreatheSafe', TRUE),
('Omeprazole 20mg', 'Gastroenterology', 'Proton pump inhibitor capsules for acid-related conditions.', 7.85, 140, 'Digestiva', TRUE);
