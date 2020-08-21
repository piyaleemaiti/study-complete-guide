import { Router } from 'express';
import { Todo } from '../models/todo';

const router = Router();

let todos: Todo[] = [];
type RequestBody = { text: string };
type RequestParams = { todoId: string };

router.get('/', (req, res, next) => {
  res.status(200).json({ todoList: todos });
});

router.post('/todo', (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };
  todos.push(newTodo);
  res.status(201).json({ message: 'Added todo!', todo: todos });
});

router.delete('/todo/:todoId', (req, res, next) => {
  const params = req.params as RequestParams;
  const tid = params.todoId;
  todos = todos.filter((todo) => todo.id !== tid);
  res.status(200).json({ message: "Deleted todo!", todo: todos });
});

router.put('/todo/:todoId', (req, res, next) => {
  const body = req.body as RequestBody;
  const params = req.params as RequestParams;
  const tid = params.todoId;
  const todoIndex = todos.findIndex((todo) => todo.id === tid);
  if(todoIndex >= 0) {
    todos[todoIndex] = { id: tid, text: body.text };
    return res.status(200).json({ message: "Updated todo!", todo: todos });
  } 
  res.status(400).json({ message: "Couldn't find todo!" });
});

export default router;