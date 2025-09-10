"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.userRouter = express_1.default.Router();
const signupSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string()
});
exports.userRouter.get('/bulk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.prismaClient.user.findMany({
        where: {
            name: req.body.name
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });
    res.status(200).json({
        user: users.map(user => ({
            name: user.name,
            email: user.email,
            id: user.id
        }))
    });
}));
exports.userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }
    else {
        const user = yield db_1.prismaClient.user.findUnique({
            where: {
                email: req.body.email
            },
            select: {
                id: true,
                name: true
            }
        });
        if (user) {
            res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            });
        }
        const request = yield db_1.prismaClient.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: request.id }, config_1.JWT_SECRET);
        res.json({
            message: "Signed Up!",
            id: request.id,
            key: token
        });
    }
}));
const signinSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8)
});
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const request = yield db_1.prismaClient.user.findUnique({
        where: {
            email: req.body.email,
            password: req.body.password
        },
        select: {
            id: true,
            name: true
        }
    });
    const userId = request ? request.id : null;
    if (!userId) {
        res.status(411).json({
            message: "User does not exist, please try again!"
        });
    }
    else {
        const token = jsonwebtoken_1.default.sign({ userId }, config_1.JWT_SECRET);
        res.status(200).json({
            token: token,
            name: request ? request.name : null
        });
    }
}));
