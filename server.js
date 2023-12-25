import express from "express";

const app = express();


app.get("/", (req, res) => {
    res.send("Server is ready")
})

app.get("/api/jokes", (req, res) => {

    const jokes = [
        {
            id: 1,
            title: "Classic Joke",
            description: "Why did the scarecrow win an award? Because he was outstanding in his field!",
        },
        {
            id: 2,
            title: "Punny Joke",
            description: "I told my wife she should embrace her mistakes. She gave me a hug.",
        },
        {
            id: 3,
            title: "Tech Joke",
            description: "Why do programmers prefer dark mode? Because light attracts bugs!",
        },

    ]

    res.send(jokes)
})

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})