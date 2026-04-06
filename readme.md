# Webserver


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