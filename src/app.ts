import { envs } from './config/envs.js';
import { AppRoutes } from './presentation/routes.js';
import { Server } from './presentation/server.js';



(async () => {
    await main()
})()

async function main() {
    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        routes: AppRoutes.routes,
    })
    server.start()
}


