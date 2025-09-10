import express from "express"
import { prismaClient } from "../db"

const app = express()
app.use(express.json())

export const accountRouter = express.Router()

accountRouter.get("/items", async (req, res) => {
    const itemList = await prismaClient.items.findMany({
        where: {
            userId: req.body.email
        },
        select: {
            id: true,
            item: true,
            cost: true
        }
    })

    res.status(200).json({
        items: itemList.map(items => ({
            id: items.id,
            item: items.item,
            cost: items.cost
        }))
    })
})

accountRouter.post("/additem", async (req, res) => {
    const request = await prismaClient.items.create({
        data: {
            item: req.body.item,
            cost: req.body.cost,
            userId: req.body.email
        }
    })

    res.json({
        message: "Item added!",
        id: request.id
    })
})

accountRouter.put("/changeitem", async (req, res) => {
    const userId = await prismaClient.items.findUnique({
        where: {
            item: req.body.item,
            userId: req.body.email
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