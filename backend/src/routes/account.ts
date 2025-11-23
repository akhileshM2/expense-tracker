import express from "express"
import { prismaClient } from "../db"
import redis from "../redisClient"
import { Prisma } from "@prisma/client"

const app = express()
app.use(express.json())

export const accountRouter = express.Router();

accountRouter.get("/items", async (req, res) => {
    const itemList = await prismaClient.items.findMany({
        where: {
            userId: req.body.email
        },
        select: {
            itemNo: true,
            item: true,
            cost: true
        }
    })

    res.status(200).json({
        items: itemList.map(items => ({
            id: items.itemNo,
            item: items.item,
            cost: items.cost
        }))
    })
})

accountRouter.post("/additem", async (req, res) => {
    const key = `user:${req.body.email}:itemCounter`;
    const nextItemNo = await redis.incr(key);
    const request = await prismaClient.items.create({
        data: {
            item: req.body.item,
            itemNo: nextItemNo,
            cost: req.body.cost,
            userId: req.body.email
        }
    })

    res.json({
        message: "Item added!",
        id: request.itemNo
    })
})

accountRouter.put("/changeitem", async (req, res) => {
    const key = `user:${req.body.email}:itemCounter`;
    const value = Number(await redis.get(key));
    
    if (!req.body.id && req.body.id != value) {
        res.status(411).json({
            message: "User not found. Please try again."
        })
    }

    const userId = await prismaClient.items.findUnique({
        where: {
            item: req.body.item,
            userId_itemNo: {
                userId: req.body.email,
                itemNo: value
            }
        },
        select: {
            id: true
        }
    })

    if (!userId) {
        res.status(411).json({
            message: "User not found. Please try again."
        })
    }

    const request = await prismaClient.items.update({
        where: {
            id: userId?.id,
            userId: req.body.email
        },
        data: {
            item: req.body.newItemName,
            cost: req.body.cost
        }
    })

    res.status(200).json({
        message: "Item updated!",
        id: request.id,
        item: request.item,
        cost: request.cost
    })
})

accountRouter.delete("/removeitem/user/:userId/items/:itemNo", async (req, res) => {
    const {userId, itemNo} = req.params

    try {
        const request = await prismaClient.items.delete({
            where: {
                userId_itemNo: {
                    userId: userId,
                    itemNo: Number(itemNo)
                }
            }
        })

        res.status(200).json({
            message: "Item deleted!",
            itemNo: request.itemNo 
        })
    } catch (err) {
        res.status(411).json({
            message: "Item not found. Please try again."
        })
    }
})