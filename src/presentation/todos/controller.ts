import { Request, Response } from 'express'


let todos = [
    { id: 1, text: 'Buy Milk', createdAt: new Date() },
    { id: 2, text: 'Buy Bread', createdAt: null },
    { id: 3, text: 'Buy Butter', createdAt: new Date() },
]


export class TodosController {


    //* DI
    constructor() { }


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

    public deleteTodo = (req: Request, res: Response) => {
        const id = +req.params.id!;
        if (isNaN(id)) return res.status(404).json({ error: 'el ID debe ser un numero' })

        const todo = todos.find(todo => todo.id === id);
        if (!todo) return res.status(404).json({ error: `todo with id ${id} not found` })

        todos.splice(todos.indexOf(todo), 1)

        res.json(todo)
    }
}