// utils/razorpayInstance.js
import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

const razorpay = new Razorpay({
  key_id: "rzp_test_eh4eCol0GXNXUS",
  key_secret: "br31ViuH329G0OwBaXJ2eMQl",
});

export default razorpay;
