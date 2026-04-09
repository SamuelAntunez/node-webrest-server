import express, { Router } from 'express'
import path from 'node:path';

interface Options {
    port: number;
    public_path: string;
    routes: Router;
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, public_path, routes } = options
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes

    }

    async start() {

        //* Middleware
        this.app.use(express.json()) // raw
        this.app.use(express.urlencoded({ extended: true })) // x-www-form-urlencoded

        //* Public Folder - use absolute path from project root
        const publicPath = path.resolve(process.cwd(), this.publicPath)
        console.log('CWD:', process.cwd())
        console.log('Public Path:', publicPath)
        console.log('Public folder exists:', require('fs').existsSync(publicPath))

        this.app.use(express.static(publicPath))

        //* Routes
        this.app.use(this.routes)

        //* SPA - serve index.html for all non-API routes
        this.app.get(/^\/(?!api).*/, (req, res) => {
            const indexPath = path.resolve(publicPath, 'index.html')
            console.log('Serving index.html from:', indexPath)
            console.log('Index.html exists:', require('fs').existsSync(indexPath))
            res.sendFile(indexPath, (err) => {
                if (err) {
                    console.error('Error sending index.html:', err)
                    res.status(500).send('Error loading application')
                }
            })
        })

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`)
        })
    }

}