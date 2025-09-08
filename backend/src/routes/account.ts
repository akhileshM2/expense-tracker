import express from "express"
import { prismaClient } from "../db"

const app = express()
app.use(express.json())

export const accountRouter = express.Router()

accountRouter.get("/items", async (req, res) => {
    const itemList = await prismaClient.items.findMany({
        where: {
            user: req.body.email
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
            user: req.body.email
        }
    })

    res.json({
        message: "Item added!",
        id: request.id
    })
})