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
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
exports.accountRouter = express_1.default.Router();
exports.accountRouter.get("/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemList = yield db_1.prismaClient.items.findMany({
        where: {
            userId: req.body.email
        },
        select: {
            id: true,
            item: true,
            cost: true
        }
    });
    res.status(200).json({
        items: itemList.map(items => ({
            id: items.id,
            item: items.item,
            cost: items.cost
        }))
    });
}));
exports.accountRouter.post("/additem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield db_1.prismaClient.items.create({
        data: {
            item: req.body.item,
            cost: req.body.cost,
            userId: req.body.email
        }
    });
    res.json({
        message: "Item added!",
        id: request.id
    });
}));
exports.accountRouter.put("/changeitem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield db_1.prismaClient.items.findUnique({
        where: {
            item: req.body.item,
            userId: req.body.email
        },
        select: {
            id: true
        }
    });
    if (!userId) {
        res.status(411).json({
            message: "User not found. Please try again."
        });
    }
    const request = yield db_1.prismaClient.items.update({
        where: {
            id: userId === null || userId === void 0 ? void 0 : userId.id,
            userId: req.body.email
        },
        data: {
            item: req.body.newItemName,
            cost: req.body.cost
        }
    });
    res.status(200).json({
        message: "Item updated!",
        id: request.id,
        item: request.item,
        cost: request.cost
    });
}));
