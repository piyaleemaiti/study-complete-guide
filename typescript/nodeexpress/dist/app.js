"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var todos_1 = __importDefault(require("./routes/todos"));
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(todos_1.default);
app.listen(8080);
