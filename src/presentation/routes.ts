import { Router } from "express";
import { TodosController } from "./todos/controller.js";
import { TodoRoutes } from "./todos/routes.js";


export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        router.use('/api/todos', TodoRoutes.routes)  // (req, res) => todoController.getTodos(req, res)

        return router;
    }
}