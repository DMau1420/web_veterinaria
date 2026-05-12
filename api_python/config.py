import pymysql

def get_connection():
    """
    Establece y retorna la conexión a la base de datos MariaDB (bd_vet).
    """
    try:
        connection = pymysql.connect(
            host='localhost',
            user='mau',
            password='mau1234',       
            database='bd_vet',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except pymysql.MySQLError as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None