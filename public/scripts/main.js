const createPostElement = (data) => {
    const postHtml = `
        <h1>${data.title}</h1>
        <p>${data.content}</p>
        <p>id: ${data.id}</p>
    `

    const element = document.createElement("div")
    element.innerHTML = postHtml
    
    return element
}

document.addEventListener("DOMContentLoaded", async () => {
    const MAIN_CONTAINER = document.querySelector("#main")
    const POSTS = MAIN_CONTAINER.querySelector("#posts")
    const posts = await (await fetch("/posts/")).json()

    posts.forEach(element => {
        POSTS.appendChild(createPostElement(element))
    });
})