import os
import shutil
from typing import Optional
import config
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import bcrypt
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CONFIGURACIÓN DE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://127.0.0.1:4200", "*"],  # Permite peticiones desde el frontend de Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURACIÓN DE CARPETA PARA IMÁGENES ---
IMAGENES_DIR = "imagenes-backend"
os.makedirs(IMAGENES_DIR, exist_ok=True)
app.mount("/imagenes-backend", StaticFiles(directory=IMAGENES_DIR), name="imagenes-backend")

# --- MODELOS PYDANTIC (Para JSON requests) ---
class UsuarioBase(BaseModel):
    nombre: str
    apellidos: Optional[str] = None
    email: str
    password: str
    telefono: Optional[str] = None
    rol: str = "USER"

class UsuarioLogin(BaseModel):
    identificador: str
    password: str

class CitaBase(BaseModel):
    mascota_id: int
    usuario_id: int
    fecha: str
    hora: str
    motivo: str
    estado: str = "Pendiente"


# ==========================================
# LOGIN
# ==========================================
@app.post("/login")
def login(usuario_login: UsuarioLogin):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            # Buscar usuario por email o teléfono
            sql = "SELECT id, nombre, apellidos, email, password, rol FROM usuarios WHERE email = %s OR telefono = %s"
            cursor.execute(sql, (usuario_login.identificador, usuario_login.identificador))
            usuario_en_db = cursor.fetchone()

            if not usuario_en_db:
                raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

            # Verificar la contraseña
            password_valida = bcrypt.checkpw(
                usuario_login.password.encode('utf-8'),
                usuario_en_db['password'].encode('utf-8')
            )

            if not password_valida:
                raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

            # Excluir la contraseña del objeto de respuesta para no enviarla al cliente
            del usuario_en_db['password']

            return {"mensaje": "Login exitoso", "usuario": usuario_en_db}
    finally:
        if conn: conn.close()


# ==========================================
# CRUD: USUARIOS
# ==========================================
@app.get("/usuarios")
def obtener_usuarios():
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, nombre, apellidos, email, telefono, rol, fecha_registro FROM usuarios")
            return cursor.fetchall()
    finally:
        if conn: conn.close()

@app.post("/usuarios")
def crear_usuario(usuario: UsuarioBase):
    conn = config.get_connection()
    try:
        # Encriptar la contraseña antes de guardarla
        salt = bcrypt.gensalt()
        password_encriptada = bcrypt.hashpw(usuario.password.encode('utf-8'), salt).decode('utf-8')

        with conn.cursor() as cursor:
            sql = """INSERT INTO usuarios (nombre, apellidos, email, password, telefono, rol)
                     VALUES (%s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (usuario.nombre, usuario.apellidos, usuario.email, password_encriptada, usuario.telefono, usuario.rol))
            conn.commit()
            return {"mensaje": "Usuario creado correctamente", "id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conn: conn.close()

@app.delete("/usuarios/{id}")
def eliminar_usuario(id: int):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
            conn.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            return {"mensaje": "Usuario eliminado"}
    finally:
        if conn: conn.close()


# ==========================================
# MÉTRICAS
# ==========================================
@app.get("/contar_mascotas")
def contar_mascotas():
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) as total FROM mascotas")
            total = cursor.fetchone()['total']

            cursor.execute("SELECT COUNT(*) as mes_actual FROM mascotas WHERE MONTH(fecha_registro) = MONTH(CURRENT_DATE()) AND YEAR(fecha_registro) = YEAR(CURRENT_DATE())")
            mes_actual = cursor.fetchone()['mes_actual']

            # Datos para gráfica de pacientes activos (meses del año actual)
            cursor.execute("""
                SELECT MONTH(fecha_registro) as mes, COUNT(*) as cantidad
                FROM mascotas
                WHERE YEAR(fecha_registro) = YEAR(CURRENT_DATE())
                GROUP BY MONTH(fecha_registro)
            """)
            historico = cursor.fetchall()
            historico_meses = [0] * 12
            for row in historico:
                historico_meses[row['mes'] - 1] = row['cantidad']

            # Datos para gráfica de especies
            cursor.execute("SELECT especie, COUNT(*) as cantidad FROM mascotas GROUP BY especie")
            especies = cursor.fetchall()
            especies_dict = {row['especie']: row['cantidad'] for row in especies}

            return {"total": total, "mes_actual": mes_actual, "historico_meses": historico_meses, "especies": especies_dict}
    finally:
        if conn: conn.close()

# ==========================================
# CRUD: MASCOTAS (Incluye subida de imagen)
# ==========================================
@app.get("/mascotas")
def obtener_mascotas():
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM mascotas")
            return cursor.fetchall()
    finally:
        if conn: conn.close()

@app.get("/mascotas/{id}")
def obtener_mascota(id: int):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM mascotas WHERE id = %s", (id,))
            mascota = cursor.fetchone()
            if not mascota:
                raise HTTPException(status_code=404, detail="Mascota no encontrada")
            return mascota
    finally:
        if conn: conn.close()

@app.post("/mascotas")
def crear_mascota(
    usuario_id: int = Form(...),
    nombre: str = Form(...),
    especie: str = Form(...),
    raza: Optional[str] = Form(None),
    edad: Optional[int] = Form(None),
    peso: Optional[float] = Form(None),
    proxima_vacuna: Optional[str] = Form(None),
    imagen: Optional[UploadFile] = File(None)
):
    conn = config.get_connection()
    try:
        imagen_path = None
        with conn.cursor() as cursor:
            if imagen:
                # Obtener info del usuario para crear la carpeta personalizada
                cursor.execute("SELECT nombre, apellidos FROM usuarios WHERE id = %s", (usuario_id,))
                user_info = cursor.fetchone()
                if user_info:
                    u_nombre = user_info['nombre'].replace(" ", "").lower()
                    u_apellidos = user_info['apellidos'].replace(" ", "").lower() if user_info['apellidos'] else ""
                    folder_name = f"{u_nombre}{u_apellidos[:3]}{usuario_id}"
                else:
                    folder_name = f"usuario_{usuario_id}"

                user_dir = os.path.join(IMAGENES_DIR, folder_name)
                os.makedirs(user_dir, exist_ok=True)

                imagen_path = f"{IMAGENES_DIR}/{folder_name}/{imagen.filename}"
                local_path = os.path.join(user_dir, imagen.filename)

                with open(local_path, "wb") as buffer:
                    shutil.copyfileobj(imagen.file, buffer)

            sql = """INSERT INTO mascotas (usuario_id, nombre, especie, raza, edad, peso, proxima_vacuna, imagen)
                     VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (usuario_id, nombre, especie, raza, edad, peso, proxima_vacuna, imagen_path))
            conn.commit()
            return {"mensaje": "Mascota registrada correctamente", "id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conn: conn.close()

@app.put("/mascotas/{id}")
def actualizar_mascota(
    id: int,
    usuario_id: int = Form(...),
    nombre: str = Form(...),
    especie: str = Form(...),
    raza: Optional[str] = Form(None),
    edad: Optional[int] = Form(None),
    peso: Optional[float] = Form(None),
    proxima_vacuna: Optional[str] = Form(None),
    imagen: Optional[UploadFile] = File(None)
):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT imagen FROM mascotas WHERE id = %s", (id,))
            mascota = cursor.fetchone()
            if not mascota:
                raise HTTPException(status_code=404, detail="Mascota no encontrada")

            imagen_path = mascota['imagen']
            # Si se envía una imagen nueva, la sobreescribimos
            if imagen:
                cursor.execute("SELECT nombre, apellidos FROM usuarios WHERE id = %s", (usuario_id,))
                user_info = cursor.fetchone()
                if user_info:
                    u_nombre = user_info['nombre'].replace(" ", "").lower()
                    u_apellidos = user_info['apellidos'].replace(" ", "").lower() if user_info['apellidos'] else ""
                    folder_name = f"{u_nombre}{u_apellidos[:3]}{usuario_id}"
                else:
                    folder_name = f"usuario_{usuario_id}"

                user_dir = os.path.join(IMAGENES_DIR, folder_name)
                os.makedirs(user_dir, exist_ok=True)

                imagen_path = f"{IMAGENES_DIR}/{folder_name}/{imagen.filename}"
                local_path = os.path.join(user_dir, imagen.filename)

                with open(local_path, "wb") as buffer:
                    shutil.copyfileobj(imagen.file, buffer)

            sql = """UPDATE mascotas SET usuario_id=%s, nombre=%s, especie=%s, raza=%s,
                     edad=%s, peso=%s, proxima_vacuna=%s, imagen=%s WHERE id=%s"""
            cursor.execute(sql, (usuario_id, nombre, especie, raza, edad, peso, proxima_vacuna, imagen_path, id))
            conn.commit()
            return {"mensaje": "Mascota actualizada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conn: conn.close()

@app.delete("/mascotas/{id}")
def eliminar_mascota(id: int):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM mascotas WHERE id = %s", (id,))
            conn.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Mascota no encontrada")
            return {"mensaje": "Mascota eliminada"}
    finally:
        if conn: conn.close()


# ==========================================
# CRUD: CITAS
# ==========================================
@app.get("/citas")
def obtener_citas():
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM citas")
            return cursor.fetchall()
    finally:
        if conn: conn.close()

@app.post("/citas")
def crear_cita(cita: CitaBase):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """INSERT INTO citas (mascota_id, usuario_id, fecha, hora, motivo, estado)
                     VALUES (%s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (cita.mascota_id, cita.usuario_id, cita.fecha, cita.hora, cita.motivo, cita.estado))
            conn.commit()
            return {"mensaje": "Cita registrada correctamente", "id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conn: conn.close()

@app.put("/citas/{id}")
def actualizar_cita(id: int, cita: CitaBase):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            sql = """UPDATE citas SET mascota_id=%s, usuario_id=%s, fecha=%s, hora=%s, motivo=%s, estado=%s WHERE id=%s"""
            cursor.execute(sql, (cita.mascota_id, cita.usuario_id, cita.fecha, cita.hora, cita.motivo, cita.estado, id))
            conn.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Cita no encontrada o sin cambios")
            return {"mensaje": "Cita actualizada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conn: conn.close()

@app.delete("/citas/{id}")
def eliminar_cita(id: int):
    conn = config.get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM citas WHERE id = %s", (id,))
            conn.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="Cita no encontrada")
            return {"mensaje": "Cita eliminada correctamente"}
    finally:
        if conn: conn.close()

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=False)
