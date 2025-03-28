import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Load Stripe with Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentAmount, setPaymentAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedCardType, setSelectedCardType] = useState("Visa"); // Default card type

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);
        setSuccess(false);

        if (!stripe || !elements) {
            setError("Stripe has not loaded yet. Please try again.");
            setIsProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Please enter your card details.");
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/payment/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: paymentAmount, currency: "lkr" }),
            });

            const data = await response.json();
            if (!data.clientSecret) {
                throw new Error("Failed to get client secret from backend.");
            }

            const clientSecret = data.clientSecret;

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (paymentResult.error) {
                setError(paymentResult.error.message);
            } else if (paymentResult.paymentIntent.status === "succeeded") {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.message || "Payment failed, please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>💳 Make a Payment</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
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

                {/* Select Card Type */}
                <label style={styles.label}>
                    Card Type
                    <select
                        value={selectedCardType}
                        onChange={(e) => setSelectedCardType(e.target.value)}
                        style={styles.select}
                    >
                        <option value="Visa">Visa</option>
                        <option value="MasterCard">MasterCard</option>
                        <option value="American Express">American Express</option>
                        <option value="Discover">Discover</option>
                    </select>
                </label>

                <label style={styles.label}>Card Details</label>
                <div style={styles.cardContainer}>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": {
                                        color: "#aab7c4",
                                    },
                                },
                                invalid: {
                                    color: "#ff6347",
                                },
                            },
                        }}
                    />
                </div>

                {error && <p style={styles.errorText}>{error}</p>}
                {success && <p style={styles.successText}>✅ Payment Successful!</p>}

                <button type="submit" disabled={!stripe || isProcessing} style={styles.button}>
                    {isProcessing ? "Processing..." : `Pay Now with ${selectedCardType}`}
                </button>
            </form>
        </div>
    );
};

// Stripe Wrapper
const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

const styles = {
    container: {
        maxWidth: "500px",
        margin: "50px auto",
        padding: "25px",
        border: "1px solid #e1e1e1",
        borderRadius: "12px",
        boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fefefe",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
        fontWeight: "bold",
        fontSize: "24px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        marginBottom: "8px",
        color: "#333",
        fontWeight: "bold",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px",
        transition: "border 0.3s",
    },
    select: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "16px",
        backgroundColor: "#fff",
        cursor: "pointer",
    },
    cardContainer: {
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "15px",
        backgroundColor: "#f9f9f9",
    },
    button: {
        padding: "14px",
        backgroundColor: "#4caf50",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        cursor: "pointer",
        transition: "0.3s",
    },
    errorText: {
        color: "red",
        fontSize: "14px",
        marginTop: "5px",
        textAlign: "center",
    },
    successText: {
        color: "green",
        fontSize: "14px",
        marginTop: "5px",
        textAlign: "center",
    },
};

export default Payment;
