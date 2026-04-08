# Webserver

## [HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status#informational_responses)

## http

**Http** es un modulo de nodejs que nos permite crear servidores web y escuchar peticiones


> Para escuchar un archivo, podemos crear un servidor con el metodo `http.createServer()` el cual recibira 2 argumentos, el `req` y el `res`
```ts
const server = http.createServer((req, res) => {
    console.log(req.url)

    res.write('Hola mundo')
    res.end();
})

server.listen(8080, () => {
    console.log('Server running on port 8080')
})
```

* `res.writeHead(status, contenido)`: Con este establecemos que codigo nos manda en este caso `200` o **OK** y el tipo de contenido
* `res.write()`: Con este escribimos el contenido que queremos mandar
* `res.end()`: Con este finalizamos la respuesta
* `req.url`: Con este obtenemos la url que estamos solicitando


```ts

    // En este codigo vemos varias maneras de responder a una peticion
    res.writeHead(200, { 'content-type': 'text/html' })
    res.write('<h1>Hola Mundo!</h1>');
    res.end()

    res.write('Hola mundo')
    res.end();

    const data = { name: 'John Doe', age: 30, city: 'New York' }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(data))

    // En este codigo vemos como podemos responder a una peticion dependiendo de la url y el tipo de contenido
    if (req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        res.writeHead(200, { 'content-type': 'text/html' })
        res.end(htmlFile)
        return
    }

    if (req.url?.endsWith('.css')) {
        res.writeHead(200, { 'content-type': 'text/css' })
    } else if (req.url?.endsWith('.js')) {
        res.writeHead(200, { 'content-type': 'application/js' })
    }
    const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8') 
    res.end(responseContent) // aqui mandamos el response con el contenido html, css y js
```

## http2

Para crear un servidor con https necesitamos un certificado y una llave privada 
```ts
const server = http2.createSecureServer(
    {
        key: fs.readFileSync('./keys/server.key'),
        cert: fs.readFileSync('./keys/server.crt')
    },
    (req, res) => {

    }
```

Para crear el certificado y la llave privada usamos este comando en el terminal:
```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt -days 365
```

necesitas tener openssl para poder crear el certificado y la llave privada 

## Express

Todo lo que es del framework de express va en la capa de `presentation`

> Un Middlewares es una funcion que ejecute siempre que se ejecute por una ruta

### Obtener la pagina

```ts
    this.app.use(express.static(this.publicPath))
```

### Refrescar una pagina y que se siga viendo
```ts
        //* SPA
    this.app.get('/*splat', (req, res) => {
        const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
        res.sendFile(indexPath)
    })
```

### Expresion `'*'` vs `'/*splat'` wildcard

En express despues de la version `5.2.1` el comodin `*` fue eliminado y ahora se usa `/*splat`, usar `*` para versiones anteriores

### Configuracion de variables de entorno

```ts
export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;

    constructor(options: Options) {
        const { port, public_path } = options
        this.port = port;
        this.publicPath = public_path

    }
}
```

Y luego procedemos a cambiar nuestras variables donde sea necesario
```ts

    async start() {

        //* Middleware
        //* Public Folder

        this.app.use(express.static(this.publicPath))

        this.app.get('/*splat', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath)
        })
        this.app.listen(this.port, () => {
            console.log(`Sever running on port ${this.port}`)
        })
    }

```
### Enviar un json desde un Endpoint

```ts
        this.app.get('/api/todos', (req, res) => {
            res.json([
                { id: 1, text: 'Buy Milk', createdAt: new Date() },
                { id: 2, text: 'Buy Bread', createdAt: new Date() },
                { id: 3, text: 'Buy Butter', createdAt: new Date() },
            ])
        })

```


## Express y MVC

El patrón MVC (Modelo-Vista-Controlador) es una arquitectura de software que separa la lógica de una aplicación en tres componentes principales.

El patrón MVC (Modelo-Vista-Controlador) es una arquitectura de software que separa la lógica de una aplicación en tres componentes principales. En Express.js, aunque el framework es "minimalista" y no te obliga a usar una estructura específica, implementar MVC es el estándar de oro para mantener el código organizado y escalable.

Aquí te explico cómo se divide cada pieza:

Los tres pilares del MVC
* Modelo (Model): Es la capa de los datos. Se encarga de interactuar con la base de datos (como MongoDB o PostgreSQL). Define la estructura de la información y las reglas de negocio.
    * En Express: Suele ser un archivo donde defines esquemas (por ejemplo, con Mongoose o Sequelize).

* Vista (View): Es la interfaz de usuario. Es lo que el cliente ve en su pantalla.
    * En Express: Si es una aplicación tradicional, usas motores de plantillas como EJS o Pug. Si es una API para una App de React/Angular, la "Vista" suele ser simplemente un archivo JSON que se envía al cliente.

* Controlador (Controller): Es el intermediario o "el cerebro". Recibe las peticiones del usuario a través de las rutas, pide los datos necesarios al Modelo y decide qué Vista mostrar (o qué JSON responder).
    * En Express: Son funciones que contienen la lógica que antes solías escribir directamente en el archivo de rutas.

### Archivo `routes.ts`

Aqui van a estar definidas todas las rutas de la aplicacion con el metodo `get routes(): Router` 
```ts
export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        router.use('/api/todos', TodoRoutes.routes)  // (req, res) => todoController.getTodos(req, res)

        return router;
    }
}
```
en este archivo se utiliza el metodo `router.use('/api/todos'), TodoRoutes.routes` el cual llama a `TodoRoutes.routes` donde se vera que peticion se esta utilizando y la llamara para que se ejecute

> El `router.use` llama a cualquier peticion `POST GET DELETE` etc suele usarse como un middleware

```ts
export class TodoRoutes {

    static get routes(): Router {

        const router = Router();
        const todoController = new TodosController

        router.get('/', todoController.getTodos)  // (req, res) => todoController.getTodos(req, res)

        return router;
    }

}
```

### Controladores

En los controladores por lo general vas a querer hacer inyecciones de dependencia por lo cual no sueles usar metodos estaticos
```ts
    public getTodos = (req: Request, res: Response) => {
        return res.json(todos)
    }

    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id!;

        if (isNaN(id)) {
            return res.status(404).json({ error: 'el ID debe ser un numero' })
        }
        const todo = todos.find(todo => todo.id === id);
        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` })
    }
```

### Buscar por id

Se utiliza el operador `+` para convertirlo en un numero ya que por defecto nos devuelve un string y el operador `!` porque nos puede dar undefined y con ese operador le aseguramos que siempre nos dara un numero, despues puedes hacer una validacion con el `if (isNaN(id))`


```ts
    // En Todos/routes.ts
    router.get('/:id', todoController.getTodoById)

    // En Todos/controller.ts
    public getTodoById = (req: Request, res: Response) => {
        const id = +req.params.id!;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'el ID debe ser un numero' }) // Validacion de numero
        }
        const todo = todos.find(todo => todo.id === id);
        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` }) // Validacion de undefined
    }
```

### Metodo post

```ts
    public createTodo = (req: Request, res: Response) => {

        const { text } = req.body;
        if (!text) res.status(400).json({ error: 'text property is required' })

        const newTodo = {
            id: todos.length + 1,
            text: text,
            createdAt: new Date()
        }
        todos.push(newTodo);
        res.json(newTodo)
    }
```

### Metodo Update

```ts
    public updateTodo = (req: Request, res: Response) => {
        const id = +req.params.id!;
        if (isNaN(id)) return res.status(404).json({ error: 'el ID debe ser un numero' })

        const todo = todos.find(todo => todo.id === id);
        if (!todo) return res.status(404).json({ error: `todo with ID${id} not found` })

        const { text, createdAt } = req.body
        todo.text = text || todo.text;
        (createdAt === 'null')
            ? todo.createdAt = null
            : todo.createdAt = new Date(createdAt || todo.createdAt)
        res.json(todo)
    }
```

### Metodo Delete
```ts
    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id!;
        if (isNaN(id)) return res.status(404).json({ error: 'el ID debe ser un numero' })

        const todo = todos.find(todo => todo.id === id);
        if (!todo) return res.status(404).json({ error: `todo with id ${id} not found` })

        todos.splice(todos.indexOf(todo), 1)

        res.json(todo)
    }
```

#### Recordatorio js `indexOf`

El index of  te devuelve el indice del elemento que coincida con el arreglo, y el segundo parametro es la cantidad de elementos a borrar a partir de ahi, sirve para eliminar elementos de un arreglo que se haya creado como `const`

```ts
todos.splice(todos.indexOf(todo), 1)

```

### Middlewares

Para que el body serialize el json dependiendo de la peticion que nos envie
```ts
    //* Middleware
    this.app.use(express.json()) // raw
    this.app.use(express.urlencoded({ extended: true})) // x-www-form-urlencoded
```

### DTO Data Transfer Object

Es un objeto diseñado específicamente para transportar datos entre diferentes partes de un sistema (por ejemplo, del backend al frontend o entre microservicios). Su única función es mover información, por lo que no debe contener lógica de negocio. Imagínalo como un sobre de mensajería: solo importa lo que hay dentro y que llegue a su destino de forma organizada.

> Nos puede servir para hacer validaciones de un tipo de dato, que se envie de la forma en que queremos

## Metodos con Prisma ORM 

### Metodo get

```ts
    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany()
        res.json(todos)
    }

    public getTodoById = async (req: Request, res: Response) => {
        const idTodo = +req.params.id!;
        if (isNaN(idTodo)) return res.status(404).json({ error: 'el ID debe ser un numero' })

        const todo = await prisma.todo.findUnique({
            where: {
                id: idTodo
            }
        });

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `Todo with id ${idTodo} not found` })
    }

```

### Metodo Post

```ts
    public createTodo = async (req: Request, res: Response) => {

        const { text, createdAt } = req.body;
        if (!text) res.status(400).json({ error: 'text property is required' })


        const todo = await prisma.todo.create({
            data: {
                text,
                createdAt: (createdAt) ? new Date(createdAt) : null

            }
        })

        res.json(todo)
    }
```

### Metodo Update
 
```ts

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id!;
        if (isNaN(id)) return res.status(404).json({ error: 'el ID debe ser un numero' })

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` })

        const { text, createdAt } = req.body

        const updateTodo = await prisma.todo.update({
            where: { id: id },
            data: {
                text: text,
                createdAt: (createdAt) ? new Date(createdAt) : null
            }
        })

        res.json(updateTodo)
    }
```

### Metodo Delete

```ts
    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id!;
        if (isNaN(id)) return res.status(404).json({ error: 'el ID debe ser un numero' })

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` })


        const deleteTodo = await prisma.todo.delete({
            where: {
                id: id
            }
        })

        res.json(todo)
    }
```