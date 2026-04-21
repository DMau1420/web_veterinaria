-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS bd_vet;
USE bd_vet;

-- Tabla de Usuarios (Sirve tanto para Administradores como para Dueños/Clientes)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('ADMIN', 'USER') DEFAULT 'USER',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Mascotas (Pacientes)
CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    edad INT,
    peso DECIMAL(5,2),
    proxima_vacuna DATE,
    icono VARCHAR(10),
    color_bg VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Citas
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mascota_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    estado ENUM('Pendiente', 'Confirmada', 'Cancelada', 'Completada') DEFAULT 'Pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==========================================
-- DATOS DE PRUEBA (Opcional, para empezar)
-- ==========================================

-- 1. Insertar usuarios de prueba (1 Admin, 3 Clientes)
INSERT INTO usuarios (nombre, apellidos, email, password, telefono, rol) VALUES
('Admin', 'Principal', 'admin@vet.com', 'admin123', '555-0000', 'ADMIN'),
('Carlos', 'Pérez', 'carlos@email.com', 'pass123', '555-1111', 'USER'),
('Ana', 'Gómez', 'ana@email.com', 'pass123', '555-2222', 'USER'),
('Luis', 'Martínez', 'luis@email.com', 'pass123', '555-3333', 'USER'),
('Andrea', 'Loria', 'andrea@email.com', 'pass123', '555-4444', 'USER');

-- 2. Insertar mascotas de prueba
INSERT INTO mascotas (usuario_id, nombre, especie, raza, edad, peso, proxima_vacuna, icono, color_bg) VALUES
(2, 'Michi', 'Gato', 'Mestizo', 3, 4.50, '2023-10-15', '🐱', 'bg-orange-100'),
(3, 'Firulais', 'Perro', 'Labrador', 5, 22.00, '2023-11-10', '🐶', 'bg-sky-100'),
(4, 'Copo', 'Conejo', 'Angora', 1, 1.20, NULL, '🐰', 'bg-pink-100'),
(5, 'Max', 'Perro', 'Bulldog', 4, 18.50, '2024-01-20', '🐶', 'bg-blue-100'),
(2, 'Nemo', 'Pez', 'Payaso', 1, 0.10, NULL, '🐟', 'bg-teal-100');

-- 3. Insertar citas de prueba
-- Usamos CURDATE() para que las fechas siempre sean cercanas al día en que ejecutes el script
INSERT INTO citas (mascota_id, usuario_id, fecha, hora, motivo, estado) VALUES
(1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00:00', 'Vacunación Anual', 'Pendiente'),
(2, 3, CURDATE(), '11:30:00', 'Revisión general', 'Confirmada'),
(3, 4, CURDATE(), '09:00:00', 'Corte de uñas', 'Pendiente'),
(4, 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', 'Consulta por alergia', 'Confirmada'),
(5, 2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '16:00:00', 'Revisión', 'Cancelada'),
(1, 2, DATE_SUB(CURDATE(), INTERVAL 10 DAY), '09:30:00', 'Desparasitación', 'Completada');