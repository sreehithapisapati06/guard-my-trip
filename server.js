const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Allows your HTML frontend to fetch data from this server
app.use(express.json());

// --- Mock Database (In-Memory Data Store) ---
// In production, this data would be fetched from a MongoDB or PostgreSQL database.
const safetyDatabase = {
    us: {
        countryName: "United States",
        riskLevel: "Low",
        riskScore: 15,
        emergency: { police: "911", ambulance: "911", fire: "911" },
        advisory: "Exercise normal safety precautions. Keep an eye on local weather alerts."
    },
    uk: {
        countryName: "United Kingdom",
        riskLevel: "Low",
        riskScore: 18,
        emergency: { police: "999", ambulance: "999", fire: "999" },
        advisory: "Standard security awareness recommended. Monitor local transit system adjustments."
    },
    jp: {
        countryName: "Japan",
        riskLevel: "Low",
        riskScore: 8,
        emergency: { police: "110", ambulance: "119", fire: "119" },
        advisory: "Extremely low crime index. Familiarize yourself with local earthquake evacuation protocols."
    },
    fr: {
        countryName: "France",
        riskLevel: "Moderate",
        riskScore: 35,
        emergency: { police: "17", ambulance: "15", fire: "18" },
        advisory: "Increased risk of petty theft/pickpocketing around high-density tourist hubs in Paris."
    },
    au: {
        countryName: "Australia",
        riskLevel: "Low",
        riskScore: 12,
        emergency: { police: "000", ambulance: "000", fire: "000" },
        advisory: "Safe urban environments. Prioritize safety signage along beaches and rural outback routes."
    }
};

// --- API Endpoints ---

// 1. Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "active", timestamp: new Date() });
});

// 2. Get All Supported Countries (Useful for populating dropdown lists dynamically)
app.get('/api/countries', (req, res) => {
    const summaryList = Object.keys(safetyDatabase).map(key => ({
        code: key,
        name: safetyDatabase[key].countryName
    }));
    res.status(200).json(summaryList);
});

// 3. Get Specific Destination Data
app.get('/api/safety/:countryCode', (req, res) => {
    const code = req.params.countryCode.toLowerCase();
    const destinationData = safetyDatabase[code];

    if (!destinationData) {
        return res.status(404).json({
            success: false,
            message: `Country profile configuration matching code '${code}' not found.`
        });
    }

    res.status(200).json({
        success: true,
        data: destinationData
    });
});

// --- Start Server Listening Protocol ---
app.listen(PORT, () => {
    console.log(`Guard My Trip backend service running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
