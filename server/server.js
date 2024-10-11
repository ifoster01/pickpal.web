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
    const { leagueId } = req.query;

    try {
        const data = await fetchWithRetry(`https://sportsbook.draftkings.com//sites/US-SB/api/v5/eventgroups/${leagueId}?format=json`);

        // getting all the props
        const categories = data.eventGroup.offerCategories;
        let propsList = [];
        for (const category of categories) {
            // extracting the category ids and name
            const { offerCategoryId, name } = category;
            
            // fetching the props for each category
            try {
                console.log(`Getting props for Category: ${name}, ID: ${offerCategoryId}`);
                const props = await fetchWithRetry(`https://sportsbook.draftkings.com/sites/US-SB/api/v5/eventgroups/${leagueId}/categories/${offerCategoryId}?format=json`);

                // finding the category in the data object
                for (const cat in props.eventGroup.offerCategories) {
                    const categoryData = props.eventGroup.offerCategories[cat]
                    if (categoryData.offerCategoryId !== offerCategoryId) continue;
                    console.log(`Found Category: ${name} which has ${categoryData.offerSubcategoryDescriptors.length} sub category types`);

                    // getting the offers for the current sub category
                    for (const subCat in categoryData.offerSubcategoryDescriptors) {
                        const subCatData = categoryData.offerSubcategoryDescriptors[subCat];
                        
                        // checking if the sub category has offers
                        if (subCatData.offerSubcategory === undefined) continue;
                        console.log(`Getting offers for Subcategory: ${subCatData.name}`);

                        // getting the offers for each subcategory
                        const offers = subCatData.offerSubcategory.offers;
                        for (const offer in offers) {
                            const eventsData = offers[offer];                            
                            for (const event in eventsData) {
                                const subOffer = eventsData[event];

                                // getting the name of the event
                                const eventId = subOffer.eventId;
                                let eventName = ''
                                let eventDate = new Date();
                                for (const eventIdx in props.eventGroup.events) {
                                    const eventData = props.eventGroup.events[eventIdx];
                                    if (eventData.eventId === eventId) {
                                        eventName = eventData.name;
                                        eventDate = new Date(eventData.startDate);
                                        break;
                                    }
                                }

                                // getting each actual prop
                                for (const outcome in subOffer.outcomes) {
                                    const prop = subOffer.outcomes[outcome];

                                    const leagueId = props.eventGroup.eventGroupId;
                                    const leagueName = props.eventGroup.name;
                                    const label = subOffer.label;
                                    const propLabel = prop.label;
                                    const americanOdds = prop.oddsAmerican;
                                    const line = prop.line;

                                    if (!leagueId || !leagueName || !label || !americanOdds) continue;
                                    
                                    // creating a new prop object
                                    const newProp = {
                                        leagueId,
                                        leagueName,
                                        eventName,
                                        eventDate,
                                        propLabel,
                                        label,
                                        americanOdds,
                                        line,
                                    };
                                    propsList.push(newProp);
                                }
                            }
                        }
                    }
                    break;
                }
                console.log('\n')
            } catch (error) {
                console.error(`Error fetching props for Category: ${name}, ID: ${offerCategoryId}: ${error.message}`);
            }
        }

        console.log("ALL PROPS FOUND:");
        for (prop in propsList) {
            console.log(propsList[prop]);
        }

        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching data', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});