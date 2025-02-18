import { createPost, getPostById } from "./api.js"

const displayPost = (data) => {
    const MAIN_CONTAINER = document.querySelector("#main")
    const POST_CONTAINER = MAIN_CONTAINER.querySelector("#postContainer")
    if (POST_CONTAINER.classList.contains("hidden")) {
        POST_CONTAINER.classList.toggle("hidden")
    }

    const postHTML = `
    <div id="postInfo">
        <h1 id="postName">${data.name}</h1>
        <h2 id="postCreator">${data.creator}</h2>
    </div>

    <div id="postContent">
        <textarea name="" id="postText" maxlength="140" class="caveat-700" readonly>${data.content}</textarea>
    </div>`

    POST_CONTAINER.innerHTML = postHTML
}

document.addEventListener("DOMContentLoaded", async () => {
    const MAIN_CONTAINER = document.querySelector("#main")
    const POST_CONTROLS = MAIN_CONTAINER.querySelector("#postControls")
    const POST_CONTAINER = MAIN_CONTAINER.querySelector("#postContainer")

    // post find
    const POST_FIND = POST_CONTROLS.querySelector("#postFind")
    const POST_ID_INPUT = POST_FIND.querySelector("#postIdInput")
    const POST_FIND_BUTTON = POST_FIND.querySelector("#postFindButton")
    POST_FIND_BUTTON.onclick = async () => {
        const post = await getPostById(POST_ID_INPUT.value)
        
        if (post.name && post.creator && post.content) {
            displayPost(post)
        }
    }

    // post save
    const POST_CREATE = POST_CONTROLS.querySelector("#postCreate")
    const POST_NAME_INPUT = POST_CREATE.querySelector("#postNameInput")
    const POST_CREATOR_INPUT = POST_CREATE.querySelector("#postCreatorInput")
    const POST_CONTENT_INPUT = POST_CREATE.querySelector("#postContentInput")
    const POST_CREATE_BUTTON = POST_CREATE.querySelector("#postCreateButton")
    const POST_CREATE_NOTIF = POST_CREATE.querySelector("#postCreateNotification")
    POST_CREATE_BUTTON.onclick = async () => {
        const data = {
            name: POST_NAME_INPUT.value,
            creator: POST_CREATOR_INPUT.value,
            content: POST_CONTENT_INPUT.value
        }

        const result = await createPost(data)
        
        if (result) {
            POST_CREATE_NOTIF.innerHTML = `Postitus loodud! ID: ${result.id}`
            displayPost(result)
        }
    }
})