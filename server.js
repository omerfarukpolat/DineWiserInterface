const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 5001;

app.use(bodyParser.json());
app.use(cors());

const venvPython = path.join(__dirname, 'myenv', 'bin', 'python3'); // Path to the virtual environment's Python executable

app.post('/api/find-restaurant', (req, res) => {

    const { currentLat, currentLon, cuisine, maxBudget, maxTime } = req.body;

    const pythonProcess = spawn(venvPython, ['/Users/polato/PycharmProjects/pythonProject/project.py', currentLat, currentLon, cuisine, maxBudget, maxTime]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const results = JSON.parse(dataString);
            res.json(results);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

app.get('/api/cuisines', (req, res) => {
    const pythonProcess = spawn(venvPython, ['/Users/polato/PycharmProjects/pythonProject/get_cuisines.py']);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stdout.on('end', () => {
        try {
            const cuisines = JSON.parse(dataString);
            res.json(cuisines);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Error parsing JSON' });
        }
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

