const paypal = require('@paypal/checkout-server-sdk');

// Set up PayPal SDK
const client = new paypal.core.PayPalHttpClient({
    clientId: 'ASeiqCtGJqjsLN8e4VhAHIGUsSG4UJoVH3Lr6n5siVrj0mgYlX3uMk4bSAsdBA9DMRv9wZuN1Tly3A3E',
    clientSecret: 'ECWe0vJjln0B595pTl8N4Y2JwZGUY2YJUc6rJtfozqv26UgG_HbE21gV75DhljdtXAV1nEd81GUBu5RE',
    environment: paypal.core.Environment.Sandbox // or Production for live environment
});

// Function to verify payment details on the server
async function verifyPayment(orderID) {
    try {
        const request = new paypal.orders.OrdersGetRequest(orderID);
        const response = await client.execute(request);
        console.log('Payment details:', response.result);
        return response.result;
    } catch (error) {
        console.error('Error verifying payment:', error.message);
        throw error;
    }
}

// Example usage
const orderID = 'YOUR_ORDER_ID'; // Replace with the actual order ID
verifyPayment(orderID);
