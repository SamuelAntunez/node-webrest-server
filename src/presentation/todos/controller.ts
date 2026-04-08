import { Request, Response } from 'express'
import { prisma } from '../../data/postgres'
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos'

export class TodosController {


    //* DI
    constructor() { }


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

    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body)
        if (error) return res.status(400).json({ error })



        const todo = await prisma.todo.create({
            data: createTodoDto!
        })
        res.json(todo)
    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id!;

        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id })
        if (error) return res.json(400).json({ error })

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` })


        const updateTodo = await prisma.todo.update({
            where: { id: id },
            data: updateTodoDto!.values
        })

        res.json(updateTodo)
    }

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
}