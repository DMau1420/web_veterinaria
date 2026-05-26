import os
import pymysql

def get_connection():
    """
    Establece y retorna la conexión a la base de datos MariaDB (bd_vet).
    """
    try:
        connection = pymysql.connect(
            # os.getenv busca la variable de Docker; si no existe, usa tu valor local
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'mau'),
            password=os.getenv('DB_PASSWORD', 'mau1234'),
            database=os.getenv('DB_NAME', 'bd_vet'),
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.MySQLError as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None
