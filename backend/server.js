// server.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection ---
const MONGO_URI = "mongodb://127.0.0.1:27017"; // local Mongo
const DB_NAME = "aqib";
const COLLECTION_NAME = "listings";

let listingsCollection;

async function connectDB() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(DB_NAME);
    listingsCollection = db.collection(COLLECTION_NAME);
}

// --- CRUD ROUTES ---
app.get("/", (req, res) => {
    res.send("Real Estate Listings API is running.");
});
// Create listing
app.post("/api/listings", async (req, res) => {
    try {
        // no validation as requested – raw body straight into DB (not smart, but you asked)
        const listing = req.body;

        // You *should* at least normalize UAE-related fields (emirate, priceAED etc.), but skipping here
        const result = await listingsCollection.insertOne(listing);
        res.status(201).json({ _id: result.insertedId, ...listing });
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).json({ error: "Failed to create listing" });
    }
});

// Get all listings
app.get("/api/listings", async (req, res) => {
    try {
        const {
            emirate,
            city,
            community,
            propertyType,
            purpose,
            bedrooms,
            bathrooms,
            minPrice,
            maxPrice,
            isPublished,
        } = req.query;

        const query = {};

        // Text fields
        if (emirate) query["location.emirate"] = emirate;
        if (city) query["location.city"] = city;
        if (community) query["location.community"] = community;
        if (propertyType) query.propertyType = propertyType;
        if (purpose) query.purpose = purpose;

        // Boolean flags
        if (isPublished !== undefined) {
            query.isPublished = isPublished === "true";
        }

        // Numeric filters
        if (bedrooms) query.bedrooms = Number(bedrooms);
        if (bathrooms) query.bathrooms = Number(bathrooms);

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const listings = await listingsCollection.find(query).toArray();

        res.json(listings);
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});


// Get single listing by id
app.get("/api/listings/:id", async (req, res) => {
    try {
        const id = req.params.id;

        let listing;
        try {
            listing = await listingsCollection.findOne({ _id: new ObjectId(id) });
        } catch {
            return res.status(400).json({ error: "Invalid listing id" });
        }

        if (!listing) return res.status(404).json({ error: "Listing not found" });

        res.json(listing);
    } catch (err) {
        console.error("Error fetching listing:", err);
        res.status(500).json({ error: "Failed to fetch listing" });
    }
});

// Update listing (full/partial)
app.put("/api/listings/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body; // again, no validation
        delete updateData._id;
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return res.status(400).json({ error: "Invalid listing id" });
        }

        const result = await listingsCollection.findOneAndUpdate(
            { _id: objectId },
            { $set: updateData },
            { returnDocument: "after" }
        );

        if (!result) {
            return res.status(404).json({ error: "Listing not found" });
        }

        res.json(result);
    } catch (err) {
        console.error("Error updating listing:", err);
        res.status(500).json({ error: "Failed to update listing" });
    }
});

// Delete listing
app.delete("/api/listings/:id", async (req, res) => {
    try {
        const id = req.params.id;

        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return res.status(400).json({ error: "Invalid listing id" });
        }

        const result = await listingsCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Listing not found" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting listing:", err);
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

// --- Start server after DB is ready ---
const PORT = 4000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    });
