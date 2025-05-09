import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { jsPDF } from "jspdf";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentAmount, setPaymentAmount] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setReceiptData(null);

    if (!stripe || !elements) {
      setError("Stripe is not ready.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Please enter card details.");
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paymentAmount, currency: "lkr" }),
      });

      const data = await res.json();
      if (!data.clientSecret) throw new Error("Client secret not received");

      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setSuccess(true);

        const paymentInfo = {
          paymentIntentId: paymentResult.paymentIntent.id,
          amount: paymentAmount,
          status: paymentResult.paymentIntent.status,
          date: new Date().toLocaleString(),
          studentId,
          studentName,
        };
        setReceiptData(paymentInfo);

        await fetch("http://localhost:5001/api/payment/save-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...paymentInfo,
            receipt_url: paymentResult.paymentIntent.charges?.data?.[0]?.receipt_url || "",
          }),
        });
      }
    } catch (err) {
      setError(err.message || "Payment failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Receipt ID: ${receiptData.paymentIntentId}`, 20, 40);
    doc.text(`Student Name: ${receiptData.studentName}`, 20, 50);
    doc.text(`Student ID: ${receiptData.studentId}`, 20, 60);
    doc.text(`Amount Paid: LKR ${receiptData.amount}`, 20, 70);
    doc.text(`Payment Status: ${receiptData.status}`, 20, 80);
    doc.text(`Date: ${receiptData.date}`, 20, 90);
    doc.text(`Institute: Pawara Institute`, 20, 100);

    doc.save("receipt.pdf");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Make a Payment</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Student ID
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Student Name
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter Student Name"
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Payment Amount (LKR)
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Enter amount in LKR"
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>Card Details</label>
        <div style={styles.cardContainer}>
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Payment Successful!</p>}

        {receiptData && (
          <button type="button" onClick={handleDownloadReceipt} style={styles.downloadBtn}>
            Download Receipt (PDF)
          </button>
        )}

        <button type="submit" disabled={!stripe || isProcessing} style={styles.button}>
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

const styles = {
  container: {
    maxWidth: "450px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  label: {
    display: "block",
    fontSize: "14px",
    marginBottom: "5px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  cardContainer: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "15px",
    minHeight: "50px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  downloadBtn: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default Payment;
