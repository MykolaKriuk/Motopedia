const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = 5001;

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(bodyParser.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes.js');
const motorcycleRoutes = require('./routes/motorcycleRoutes.js');
const brandRoutes = require('./routes/brandRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

app.use('/auth', authRoutes);
app.use('/motorcycles', motorcycleRoutes);
app.use('/brands', brandRoutes);
app.use('/users', userRoutes);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});