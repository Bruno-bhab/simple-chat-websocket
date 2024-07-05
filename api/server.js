import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors());

const port = 3000
const messages = [
    {
        nick: "system",
        color: "#158",
        message: "Olá",
    },
    {
        nick: "Operador",
        color: "#395",
        message: "Bem vindo ao chat",
    },
    {
        nick: "Moderador",
        color: "#913",
        message: "Sinta-se a vontade para mandar uma mensagem",
    }
]

app.get('/message', (req, res) => {
    return res.json(messages)
})

app.post('/message', (req, res) => {
    messages.push(req.body)
    return res.send('ok')
})

app.listen(port, () => console.log("Server Running"))