import SnackOrder from "../Models/snackOrderModel.js";
import { Resend } from "resend";

// ============= Cloudinary Configuration =============

const resend = new Resend(process.env.RESEND_API_KEY);



export const placeSnackOrder = async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      userPhone,
      bookingId,
      Seats,
      items,
      totalAmount,
      movieName,
      showdate,
      showTime,
      userdetails,
    } = req.body;

    // ✅ Validation
    if (
      !userName ||
      !userEmail ||
      !bookingId ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalAmount ||
      !movieName ||
      !showdate ||
      !showTime
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // ✅ Create order document
    const order = new SnackOrder({
      userName,
      userEmail,
      userPhone,
      bookingId,
      Seats,
      items: items.map((i) => ({
        snackId: i.snackId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        lineTotal: i.lineTotal,
      })),
      totalAmount,
      movieName,
      showdate,
      showTime,
      userdetails,
    });

    await order.save();
      const formattedSeats = userdetails.seatNumbers
      .map((s) => `R${s.row}-S${s.seat}`)
      .join(", ");

    // ✅ Formatters
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const formatTime = (time) => {
      const [hour, minute] = time.split(":");
      const date = new Date();
      date.setHours(parseInt(hour), parseInt(minute));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    // ✅ Build readable snacks list
    const snacksHTML = items
      .map(
        (i) =>
          `<tr><td>${i.name}</td><td style="text-align:center;">${i.qty}</td><td style="text-align:right;">SEK ${i.lineTotal}</td></tr>`
      )
      .join("");

    // ✅ Email sending
    try {
      await resend.emails.send({
        from: "Sweden Tamil Film <noreply@tamilmovie.no>",
        to: userEmail,
        subject: `🎬 Booking Confirmation With Snacks— ${bookingId}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f6fa; padding: 25px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <div style="background: linear-gradient(135deg, #007bff, #00c6ff); color: white; text-align: center; padding: 18px 0;">
                <h2 style="margin: 0;">🎟️ Booking Confirmation</h2>
                <p style="margin: 0; font-size: 14px;">Booking ID: ${bookingId}</p>
              </div>

              <div style="padding: 25px; color: #333;">
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Thank you for your booking! Here are your complete details:</p>

                <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                  <tr><td><strong>🎬 Movie:</strong></td><td>${movieName}</td></tr>
                  <tr><td><strong> Date:</strong></td><td>${formatDate(showdate)}</td></tr>
                  <tr><td><strong> Time:</strong></td><td>${formatTime(showTime)}</td></tr>
                  <tr><td><strong> Seats:</strong></td><td>${formattedSeats}</td></tr>
                  <tr><td><strong> Phone:</strong></td><td>${userPhone || "N/A"}</td></tr>
                  <tr><td><strong> Email:</strong></td><td>${userEmail}</td></tr>
                </table>

                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

                <h3 style="margin-bottom: 10px;">🍿 Snack Order Details</h3>
                <table style="width:100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f0f4ff; text-align:left;">
                      <th style="padding: 8px;">Item</th>
                      <th style="padding: 8px; text-align:center;">Qty</th>
                      <th style="padding: 8px; text-align:right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>${snacksHTML}</tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="text-align:right; padding:8px;"><strong>Total:</strong></td>
                      <td style="text-align:right; padding:8px;"><strong>SEK ${totalAmount}</strong></td>
                    </tr>
                  </tfoot>
                </table>

                <p style="margin-top:20px; color:#555; font-size:13px;">
                  Please show this email at the counter when collecting your snacks or tickets.
                </p>
              </div>

              <div style="background:#f1f1f1; text-align:center; padding:10px; font-size:12px; color:#666;">
                © ${new Date().getFullYear()} Sweden Tamil Film. All rights reserved.
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Snack order placed successfully and confirmation email sent!",
      order,
    });
  } catch (error) {
    console.error("❌ Error placing snack order:", error);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};





// ✅ Get all snack orders (for admin)
export const getAllSnackOrders = async (req, res) => {
  try {
    const orders = await SnackOrder.find()
      .populate("items.snackId", "name category image") // optional
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};






// payment for snacks

// ✅ 1️⃣ Get snack orders by bookingId
export const getSnacksByBookingId = async (req, res) => {
  try {
    const { bookingid } = req.params;

    if (!bookingid)
      return res.status(400).json({ success: false, message: "Booking ID is required" });

    const orders = await SnackOrder.find({ bookingId: bookingid });

    if (!orders || orders.length === 0)
      return res.status(404).json({ success: false, message: "No snack orders found for this booking" });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching snacks by bookingId:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ Update snack payment status & send confirmation email
export const updateSnackPaymentStatus = async (req, res) => {
  try {
    const { bookingid } = req.params;
    const { collectorType, collectorId } = req.body;

    if (!bookingid)
      return res.status(400).json({ success: false, message: "Booking ID is required" });

    const order = await SnackOrder.findOneAndUpdate(
      { bookingId: bookingid },
      {
        paymentStatus: "paid",
        collectorType: collectorType || "",
        collectorId: collectorId || "",
      },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Snack order not found" });

    // ✅ Email after payment update
    try {
      const formattedSeats = order.userdetails?.seatNumbers
        ?.map((s) => `R${s.row}-S${s.seat}`)
        ?.join(", ") || "N/A";

      const snacksHTML = order.items
        .map(
          (i) =>
            `<tr><td>${i.name}</td><td style="text-align:center;">${i.qty}</td><td style="text-align:right;">SEK ${i.lineTotal}</td></tr>`
        )
        .join("");

      const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

      const formatTime = (time) => {
        const [hour, minute] = time.split(":");
        const date = new Date();
        date.setHours(parseInt(hour), parseInt(minute));
        return date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      await resend.emails.send({
        from: "Sweden Tamil Film <noreply@tamilmovie.no>",
        to: order.userEmail,
        subject: `🍿 Snack Payment Confirmed — ${order.bookingId}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f6fa; padding: 25px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <div style="background: linear-gradient(135deg, #28a745, #00c853); color: white; text-align: center; padding: 18px 0;">
                <h2 style="margin: 0;">✅ Snack Payment Confirmed</h2>
                <p style="margin: 0; font-size: 14px;">Booking ID: ${order.bookingId}</p>
              </div>

              <div style="padding: 25px; color: #333;">
                <p>Hi <strong>${order.userName}</strong>,</p>
                <p>Your snack payment has been received successfully! 🍿</p>

                <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                  <tr><td><strong>🎬 Movie:</strong></td><td>${order.movieName}</td></tr>
                  <tr><td><strong>📅 Date:</strong></td><td>${formatDate(order.showdate)}</td></tr>
                  <tr><td><strong>🕒 Time:</strong></td><td>${formatTime(order.showTime)}</td></tr>
                  <tr><td><strong>🎟️ Seats:</strong></td><td>${formattedSeats}</td></tr>
                </table>

                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

                <h3 style="margin-bottom: 10px;">Snack Order Summary</h3>
                <table style="width:100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f0f4ff; text-align:left;">
                      <th style="padding: 8px;">Item</th>
                      <th style="padding: 8px; text-align:center;">Qty</th>
                      <th style="padding: 8px; text-align:right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>${snacksHTML}</tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="text-align:right; padding:8px;"><strong>Total:</strong></td>
                      <td style="text-align:right; padding:8px;"><strong>SEK ${order.totalAmount}</strong></td>
                    </tr>
                  </tfoot>
                </table>

                <p style="margin-top:20px; color:#555; font-size:13px;">
                  Please show this email at the snack counter for collection.
                </p>
              </div>

              <div style="background:#f1f1f1; text-align:center; padding:10px; font-size:12px; color:#666;">
                © ${new Date().getFullYear()} Sweden Tamil Film. All rights reserved.
              </div>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("❌ Snack payment email failed:", emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "Payment marked as paid and confirmation email sent.",
      updatedOrder: order,
    });
  } catch (err) {
    console.error("Error updating snack payment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



