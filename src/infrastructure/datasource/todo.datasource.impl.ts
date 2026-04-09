import { prisma } from "../../data/postgres";
import { CreateTodoDto, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";


export class TodoDataSourceImpl implements TodoDatasource {


    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {

        const todo = await prisma.todo.create({
            data: createTodoDto!
        })

        return TodoEntity.fromObjet(todo)
    }

    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany()
        return todos.map(todo => TodoEntity.fromObjet(todo));
    }

    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        if (!todo) throw `Todo with id ${id} not found `
        return TodoEntity.fromObjet(todo)
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {

        await this.findById(updateTodoDto.id)

        const updateTodo = await prisma.todo.update({
            where: { id: updateTodoDto.id },
            data: updateTodoDto!.values
        })
        return TodoEntity.fromObjet(updateTodo)
    }

    async deleteById(id: number): Promise<TodoEntity> {

        const todo = await this.findById(id)
        const deleteTodo = await prisma.todo.delete({
            where: {
                id: id
            }
        })
        return TodoEntity.fromObjet(todo)

    }
}