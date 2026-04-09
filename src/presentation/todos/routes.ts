import { Router } from "express";
import { TodosController } from "./controller.js";
import { TodoDataSourceImpl } from "../../infrastructure/datasource/todo.datasource.impl.js";
import { TodoRepositoryImpl } from "../../infrastructure/repository/todo.repository.impl.js";



export class TodoRoutes {

    static get routes(): Router {

        const datasource = new TodoDataSourceImpl();
        const todoRepository = new TodoRepositoryImpl(
            datasource
        )

        const router = Router();
        const todoController = new TodosController(todoRepository)

        router.get('/', todoController.getTodos)  // (req, res) => todoController.getTodos(req, res)
        router.get('/:id', todoController.getTodoById)
        router.post('/', todoController.createTodo)
        router.put('/:id', todoController.updateTodo)
        router.delete('/:id', todoController.deleteTodo)

        return router;
    }

}