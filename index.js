import express from 'express';
import Client from 'voicevox-client';

const app = express();
const client = new Client("http://127.0.0.1:50021");

app.get('/', async (req, res) => {
    const text = req.query.text;
    const voice = req.query.voice;

    if (!text) {
        res.status(400).json('text is required');
        return;
    }
    if (!voice) {
        res.status(400).json('voice is required');
        return;
    }
    if (isNaN(voice)) {
        res.status(400).json('voice must be an integer');
        return;
    }
    
    try {
        const audioquery = await client.createAudioQuery(text, voice);
        const audio = await audioquery.synthesis(voice);

        res.set('Content-Type', 'audio/wav');
        res.send(audio);
    }
    catch (e) {
        res.status(500).json(e.message);
    }
});

app.get('/memoryUsage', async (req, res) => {
    const memoryUsage = process.memoryUsage();
    const memoryUsageString = JSON.stringify(memoryUsage);
    res.send(memoryUsageString);
});

app.listen(5001, () => {
    console.log('listening on port 5001');
})