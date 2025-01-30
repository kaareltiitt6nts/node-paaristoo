import express from "express"
import fs from "fs/promises"

const app = express()
const PORT = 3000
const POSTS_PATH = "./data/posts.json"

// public kaust html jms failide jaoks
app.use(express.static("public"))

const isFileEmpty = async (path) => {
    try {
        const raw = await fs.readFile(path, "utf-8")
        return !raw.trim()
    } catch (error) {
        console.error("lugemisel tekkis viga")
        return true
    }
}

const getPosts = async () => {
    const fileEmpty = await isFileEmpty(POSTS_PATH)
    if (fileEmpty) {
        console.log("fail on tyhi")
        return
    }

    const rawdata = await fs.readFile(POSTS_PATH, "utf-8")
    const posts = JSON.parse(rawdata)

    return posts
}

const getPostById = async (id) => {
    const fileEmpty = await isFileEmpty(POSTS_PATH)
    if (fileEmpty) {
        console.log("fail on tyhi")
        return
    }

    const idToFind = parseInt(id)
    const rawdata = await fs.readFile(POSTS_PATH, "utf-8")
    const posts = JSON.parse(rawdata)
    const post = posts.find((post) => post.id === parseInt(idToFind))

    return post
}

app.get("/posts", async (req, res) => {
    const posts = await getPosts()

    if (posts) {
        res.status(200).json(posts)
    }
    else {
        res.status(500)
    }
})

app.get("/posts/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const post = await getPostById(id)

        res.status(200).json(post)
    } catch (error) {
        res.status(500)
    }
})

app.listen(PORT, () => {
    console.log(`Server started! Port:${PORT}`)
})