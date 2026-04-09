# TODO REST API - Node.js & TypeScript

Una API REST robusta y escalable construida con **Node.js, Express y TypeScript**, diseñada meticulosamente bajo los principios de **Clean Architecture** y **Domain-Driven Design (DDD)**. 

Este proyecto utiliza **Prisma ORM** y **PostgreSQL** para la persistencia de los datos, demostrando un excelente manejo de responsabilidades y la correcta implementación de inyección de dependencias.

---

## 🚀 Requisitos Previos

- **Node.js** (v18 o superior recomendado)
- **PostgreSQL** (en ejecución local, remoto o a través de Docker)

## 🛠️ Instalación y Configuración

1. **Clonar el repositorio y acceder a la carpeta del proyecto**
2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto. Configura las siguientes variables base para la conexión:
   ```env
   PORT=3000
   PUBLIC_PATH=public
   POSTGRES_URL="postgresql://tu_usuario:tu_contraseña@localhost:5432/tu_base_de_datos"
   ```

4. **Ejecutar migraciones de Prisma:**
   Genera el cliente de Prisma y las migraciones necesarias en tu base de datos utilizando el siguiente comando:
   ```bash
   npx prisma migrate dev
   ```

5. **Levantar el servidor en desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor debería inicializarse en el puerto configurado (ej: `http://localhost:3000`).

---

## 🏛️ Arquitectura del Proyecto

Este proyecto no utiliza una arquitectura tradicional fuertemente acoplada a un framework (como MVC desnudo), sino que apuesta por la **Clean Architecture** combinada con conceptos fundamentales de **Domain-Driven Design (DDD)**. 

### ¿Cuáles son las ventajas de este enfoque?

* **Total Independencia de Frameworks**: La lógica de negocio no sabe ni le importa si usas `Express`, `Fastify`, `NestJS` u otro.
* **Escalabilidad y Modificabilidad**: Es muy fácil escalar módulos a medida que crece la aplicación. Añadir una entidad o un nuevo Endpoint no afectará ni alterará otras partes del sistema.
* **Mantenibilidad Cero Fricción**: Si el día de mañana decides migrar la base de datos (por ejemplo, pasar de PostgreSQL a MongoDB o MySQL), no tendrás que reescribir toda la aplicación. Solamente escribes un nuevo `DataSource` de infraestructura; la aplicación en sí permanecerá intacta y funcionará igual.
* **Pruebas (Testing) Rápidas y Confiables**: Al depender de abstracciones, aislar reglas de negocio en pruebas automatizadas usando simples "Mocks" es trivial.

### Capas de la Arquitectura

#### 1. Capa de Dominio (`/src/domain`)
Es el corazón de la aplicación. Aquí reside la **lógica de negocio** pura, sin importar qué librerías de terceros se utilizan.
- **Entidades (`Entities`)**: Reglas de negocio y estado interno que representan la data de dominio de manera estricta (ej. `TodoEntity`).
- **DTOs (`Data Transfer Objects`)**: Protegen a la aplicación validando exhaustivamente cualquier información o carga útil que entre a nuestro sistema de manera limpia (evitando ensuciar los controladores).
- **Interfaces (Abstract Classes)**: Aquí se definen los *contratos* (como Repositorios y DataSources abstractos). El Dominio **dicta** qué acciones puede hacer la persistencia (buscar, actualizar, borrar), pero sin implementar el "cómo".
- **Casos de Uso (`Use Cases`)**: Funciones o clases que orquestan verbos o acciones altamente concretas solicitadas por nuestros clientes (ej. `CreateTodo`, `GetTodos`, `DeleteTodo`). Son el punto de entrada al negocio.

#### 2. Capa de Infraestructura (`/src/infrastructure`)
Es la capa externa encargada de conectar e implementar aquellas interfaces propuestas por el Dominio usando herramientas de terceros.
- **DataSources (Implementación)**: En esta aplicación, hace uso de **Prisma ORM** y la base de datos en sí misma para extraer los archivos, procesarlos y devolver siempre clases `Entity` validadas por el Dominio.
- **Repositories (Implementación)**: Intermediario que actúa entre los Casos de Uso y los DataSources. Su misión es recibir y despachar la data solicitada para los casos de uso.

#### 3. Capa de Presentación (`/src/presentation`)
Conforma tu puente con el exterior. Se encarga únicamente de recibir la petición HTTP y despachar una respuesta, siendo ignorante a nivel de negocio.
- **Controladores (`Controllers`)**: Extraen la información de `req.body` o `req.params`, generan arreglos o DTOs y llaman a los Casos de Uso enviándoles el repositorio a través de inyección de dependencias. Al terminar, despachan la respuesta `res.json()`.
- **Rutas (`Routes`)**: Endpoints de `Express` (`.get`, `.post`, etc.) mapeados a sus respectivos métodos Controladores.
- **Server**: Envoltorio de nuestro `Express.js`, middlewares y archivos estáticos.

---

## 🔥 Flujo de una Petición (Ejemplo práctico)

Para entender cómo fluye esta arquitectura, imaginemos una petición `POST /api/todos`:

1.  **Presentación:** El usuario envía un *Body*. El enrutador redirige la petición a `todoController.createTodo`.
2.  **Validación:** El Controlador usa el **DTO (`CreateTodoDto`)** para verificar los datos enviados de manera estricta. ¿Falla? retorna un error `400` automáticamente.
3.  **Ejecución:** Si las reglas pasan, el Controlador instancia el predefinido **Caso de Uso** `CreateTodoUseCase`, al cual se le "inyectan" las bases de datos (repositorio).
4.  **Lógica:** El Caso de Uso solicita a la **Infraestructura** realizar la tarea sobre PostgreSQL usando las funciones de *Prisma*. 
5.  **Cierre:** La *Infraestructura* recibe la respuesta, la transforma en una *Entidad de Dominio* blindada, y en cadena todo vuelve hasta devolvérsele finalmente al cliente en una respuesta JSON. 

Todos estos pasos, sin que los procesos cruzados sean codependientes entre sí.

---

## 📦 Scripts Recomendados

- `npm run dev`: Inicia el servidor usando entorno local detectando cambios `.ts` gracias a `tsx`.
- `npm run build`: Elimina las descargas obsoletas, recrea los clientes de prisma y compila vía TypeScript el output en `/dist`.
- `npm start`: Ideal para correr tu proyecto compilado y en producción, actualizando esquemas antes en la DB de Prisma.
