// const express = require('express');
const express = require(`express`);
const cors = require('cors');
const cookieParser = require("cookie-parser");

const connectMongoDB = require('./database');


const usersRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");
const artistsRoutes = require("./routes/artistsRoutes");
const artworksRoutes = require("./routes/artworksRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '172.20.10.4';

connectMongoDB();

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors());
const angularDistPath = path.join(__dirname, 'public/frontend/browser');

app.use(express.static(angularDistPath));

// app.get('/', (req, res) => {
//     res.send('Welcome to the page!');
// })

app.use('/auth', authRoutes);
app.use('/user', usersRoutes);
app.use('/search', searchRoutes);
app.use('/artists', artistsRoutes);
app.use('/artworks', artworksRoutes);
app.use('/category', categoryRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(angularDistPath, 'index.html'));
});

app.use((req, res) => {
   res.status(404).send('404 Not Found');
});

// app.listen(port, host => {
//     console.log(`Express server listening on port http://localhost:${port}`);
// })
// app.listen(PORT, HOST, () => {
//     console.log(`Express server running at: http://${HOST}:${PORT}`);
// });

app.listen(PORT, () => {
    console.log(`Express server running at PORT ${PORT}.`)
})
