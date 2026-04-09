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
        const publicPath = path.join(process.cwd(), this.publicPath)
        this.app.use(express.static(publicPath))

        //* Routes
        this.app.use(this.routes)

        //* SPA - serve index.html for all non-API routes
        this.app.get(/^\/(?!api).*/, (req, res) => {
            const indexPath = path.join(publicPath, 'index.html')
            res.sendFile(indexPath)
        })
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`)
        })
    }

}