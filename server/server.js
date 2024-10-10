const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ keepAlive: true }),
    timeout: 10000, // 10 seconds timeout
});

const retryDelay = (retryNumber = 0) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    return delays[retryNumber] || 30000;
};

const fetchWithRetry = async (url, retries = 3) => {
    try {
        const response = await axiosInstance.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://sportsbook.draftkings.com/',
                'Origin': 'https://sportsbook.draftkings.com',
            },
        });
        return response.data;
    } catch (error) {
        if (retries > 0 && (error.code === 'ECONNRESET' || error.response?.status >= 500)) {
            console.log(`Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, retryDelay(3 - retries)));
            return fetchWithRetry(url, retries - 1);
        }
        throw error;
    }
};

app.get('/api/draftkings', async (req, res) => {
    // extract the query parameters
    const { url, sportId, categoryId } = req.query;

    try {
        const data = await fetchWithRetry('https://sportsbook.draftkings.com//sites/US-NY-SB/api/v5/eventgroups/88808/categories/1000?format=json');
        // const data = await fetchWithRetry('https://sportsbook.draftkings.com//sites/US-NY-SB/api/v5/eventgroups/88808/categories/1000/subcategories/1003?format=json');

        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});