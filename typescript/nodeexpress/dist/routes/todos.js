"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
var todos = [];
router.get('/', function (req, res, next) {
    res.status(200).json({ todoList: todos });
});
router.post('/todo', function (req, res, next) {
    var body = req.body;
    var newTodo = {
        id: new Date().toISOString(),
        text: body.text,
    };
    todos.push(newTodo);
    res.status(201).json({ message: 'Added todo!', todo: todos });
});
router.delete('/todo/:todoId', function (req, res, next) {
    var params = req.params;
    var tid = params.todoId;
    todos = todos.filter(function (todo) { return todo.id !== tid; });
    res.status(200).json({ message: "Deleted todo!", todo: todos });
});
router.put('/todo/:todoId', function (req, res, next) {
    var body = req.body;
    var params = req.params;
    var tid = params.todoId;
    var todoIndex = todos.findIndex(function (todo) { return todo.id === tid; });
    if (todoIndex >= 0) {
        todos[todoIndex] = { id: tid, text: body.text };
        return res.status(200).json({ message: "Updated todo!", todo: todos });
    }
    res.status(400).json({ message: "Couldn't find todo!" });
});
exports.default = router;
