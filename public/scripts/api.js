export const getPostById = async (postId) => {
    const result = await fetch(`/api/posts/${postId}`)
    return result.json()
}

export const createPost = async (data) => {
    const result = await fetch(`/api/posts/create`, {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: data.name,
            creator: data.creator,
            content: data.content
        })
    })
    return result.json()
}