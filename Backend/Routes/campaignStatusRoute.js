import express from "express";
import CampaignStatus from "../Models/CampaignStatus.js";
import CampaignMail from "../Models/campaignmail.js";

const Campaignrouter = express.Router();

// ✅ GET current campaign email status
Campaignrouter.get("/status", async (req, res) => {
  try {
    let statusDoc = await CampaignStatus.findOne();
    if (!statusDoc) {
      statusDoc = new CampaignStatus(); // default false
      await statusDoc.save();
    }
    res.status(200).json({ notifyLeads: statusDoc.notifyLeads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch campaign status" });
  }
});

// ✅ PUT - update campaign notification status
Campaignrouter.put("/update", async (req, res) => {
  try {
    const { notifyLeads } = req.body;

    let statusDoc = await CampaignStatus.findOne();
    if (!statusDoc) {
      statusDoc = new CampaignStatus({ notifyLeads });
    } else {
      statusDoc.notifyLeads = notifyLeads;
    }

    await statusDoc.save();
    res.status(200).json({ success: true, notifyLeads: statusDoc.notifyLeads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update campaign status" });
  }
});

// ✅ GET - unsubscribe a user (no email sent)
Campaignrouter.get("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).send(`
        <html><body style="font-family: Arial; text-align:center; padding:50px;">
        <h2 style="color:red;">❌ Email required</h2>
        <p>Please provide a valid email in the link (e.g. ?email=test@example.com).</p>
        </body></html>
      `);
    }

    const user = await CampaignMail.findOne({ email });

    if (!user) {
      return res.status(404).send(`
        <html><body style="font-family: Arial; text-align:center; padding:50px;">
        <h2 style="color:red;">⚠️ Email not found</h2>
        <p>No subscription found for ${email}.</p>
        </body></html>
      `);
    }

    user.subcribe = false;
    await user.save();

    return res.send(`
      <html>
        <body style="font-family: Arial; text-align:center; background:#f8f9fa; padding:50px;">
          <h2 style="color:#d90429;">✅ You’ve successfully unsubscribed!</h2>
          <p style="font-size:16px;">${email} will no longer receive updates.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return res.status(500).send(`
      <html><body style="font-family: Arial; text-align:center; padding:50px;">
      <h2 style="color:red;">Server Error</h2>
      <p>Something went wrong. Please try again later.</p>
      </body></html>
    `);
  }
});

export default Campaignrouter;
