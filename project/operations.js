import mysql from 'mysql2';

const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '167q5a0231',
    database: 'social_media1'
}).promise()

export async function readPost() {
    const output = await connection.query("SELECT * FROM posts")
    return output[0]
}

export async function readPosts(profile) {
    const output = await connection.query("select * from users where profile='"+profile+"'")
    return output[0]
}
export async function readUser(profile) {
    const output = await connection.query("select * from users where profile='"+profile+"'")
    return output[0]
}

export async function insertUser(name, profile, password, headline) {
    const output = await connection.query("insert into users (name, profile, password, headline) values('"+name+"','"+profile+"','"+password+"','"+headline+"')")
}

export async function insertPost(profile, content) {
    const output = await connection.query("insert into posts (profile, content, likes, shares) values('"+profile+"','"+content+"', 0,0)")
}

export async function likeFun(content) {
    const output = await connection.query("select likes from posts where content ='"+content+"'")
    const likes = output[0][0].likes
    const incLikes = likes + 1
    await connection.query("update posts set likes=" +incLikes+" where content='"+content+"'")
    
}

export async function shareFun(content) {
    const output = await connection.query("select shares from posts where content ='"+content+"'")
    const shares = output[0][0].shares
    const incShares = shares + 1
    await connection.query("update posts set likes=" +incShares+" where content='"+content+"'")
}