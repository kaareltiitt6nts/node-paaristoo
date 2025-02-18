import express from "express"
import fs from "fs/promises"
import crypto from "crypto"
import bodyParser from "body-parser"

const app = express()
const PORT = 3000
const POSTS_PATH = "./data/posts.json"
const POST_ID_LENGTH = 5

// Serve static files from the 'public' folder
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const isEmptyString = (input) => {
    return !input || input.trim() === ""
}

const generatePostId = async (length) => {
    let newPostId
    
    do {
        newPostId = crypto.randomBytes(length)
            .toString("base64")
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, length)
            .toLowerCase()
    } while (await getPostById(newPostId) !== undefined);

    return newPostId
}

const writePostToData = async (posts) => {
    try {
        await fs.writeFile(POSTS_PATH, JSON.stringify(posts, null, 2))
    } catch (error) {
        console.error("Error writing to file:", error)
    }
}

const isFileEmpty = async (path) => {
    try {
        const raw = await fs.readFile(path, "utf-8")
        return !raw.trim()
    } catch (error) {
        return true
    }
}

const createPost = async (name, creator, content) => {
    const postId = await generatePostId(POST_ID_LENGTH)
    const newPost = { id: postId, name, creator, content, timestamp: Date.now() }
    
    let posts = []
    if (!(await isFileEmpty(POSTS_PATH))) {
        const rawdata = await fs.readFile(POSTS_PATH, "utf-8")
        posts = JSON.parse(rawdata)
    }
    
    posts.push(newPost)
    await writePostToData(posts)
    return newPost
}

const getPostById = async (idToFind) => {
    if (await isFileEmpty(POSTS_PATH)) return undefined

    const rawdata = await fs.readFile(POSTS_PATH, "utf-8")
    const posts = JSON.parse(rawdata)
    return posts.find((post) => post.id === idToFind)
}

app.get("/api/posts/:id", async (req, res) => {
    try {
        const id = req.params.id
        const post = await getPostById(id)
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        res.setHeader("Content-Type", "application/json")
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
})

app.post("/api/posts/create", async (req, res) => {
    try {
        const { name, creator, content } = req.body || {};

        if (isEmptyString(name) || isEmptyString(creator) || isEmptyString(content)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newPost = await createPost(name, creator, content);

        res.setHeader("Content-Type", "application/json")
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

app.listen(PORT, () => {
    console.log(`Server started! Port:${PORT}`)
})