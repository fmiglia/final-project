import Stripe from 'stripe'; // Importing Stripe SDK
import express from 'express'; // Importing Express for creating API routes
import config from '../config.js'; // Importing configuration file
import Order from '../models/orderModel.js'; // Importing Order model
import { isAuth } from '../utils.js';

// Verifica della configurazione di Stripe
if (!config.STRIPE_SECRET_KEY || config.STRIPE_SECRET_KEY === 'your_stripe_secret_key') {
  console.error('ERRORE: Chiave segreta di Stripe non configurata correttamente');
  throw new Error('Stripe secret key non configurata');
}

console.log('Configurazione Stripe:', {
  hasSecretKey: !!config.STRIPE_SECRET_KEY,
  secretKeyLength: config.STRIPE_SECRET_KEY?.length,
  hasPublishableKey: !!config.STRIPE_PUBLISHABLE_KEY,
  publishableKeyLength: config.STRIPE_PUBLISHABLE_KEY?.length
});

// Initializing Stripe with the secret key from the configuration
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Specifica la versione dell'API
});

// Creating an instance of Express router for handling Stripe-related routes
const stripeRouter = express.Router();

// Route to retrieve the client secret for a payment intent
stripeRouter.get('/secret/:id', isAuth, async (req, res) => {
  try {
    console.log('=== INIZIO PROCESSO DI PAGAMENTO ===');
    console.log('Richiesta ricevuta per l\'ordine:', req.params.id);
    console.log('Utente autenticato:', {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });

    // Verifica che l'ID dell'ordine sia valido
    if (!req.params.id || req.params.id.length !== 24) {
      console.log('ERRORE: ID ordine non valido:', req.params.id);
      return res.status(400).send({ error: 'ID ordine non valido' });
    }

    // Find the order by ID and populate user information
    const order = await Order.findById(req.params.id).populate(
      'user',
      '_id name email'
    );

    console.log('Ordine trovato:', order ? {
      id: order._id,
      user: order.user._id,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      items: order.orderItems.length
    } : 'No');

    if (order) {
      console.log('Dettagli ordine:', {
        id: order._id,
        user: order.user._id,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid
      });
    }

    // If order is not found, return 404 status with an error message
    if (!order) {
      console.log('Ordine non trovato nel database');
      return res.status(404).send({ error: 'Order not found' });
    }

    // Verifica che l'ordine appartenga all'utente autenticato
    if (order.user._id.toString() !== req.user._id) {
      console.log('L\'ordine non appartiene all\'utente');
      console.log('ID utente ordine:', order.user._id);
      console.log('ID utente autenticato:', req.user._id);
      return res.status(403).send({ error: 'Not authorized to access this order' });
    }

    // Verifica che l'ordine non sia già stato pagato
    if (order.isPaid) {
      console.log('L\'ordine è già stato pagato');
      return res.status(400).send({ error: 'Order already paid' });
    }

    // Verifica che il prezzo totale sia valido
    if (!order.totalPrice || order.totalPrice <= 0) {
      console.log('Prezzo totale non valido:', order.totalPrice);
      return res.status(400).send({ error: 'Invalid order total price' });
    }

    const amount = Math.round(order.totalPrice * 100);
    console.log('Creazione PaymentIntent con importo:', amount);

    // Create a payment intent with the order total price
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: { 
        integration_check: 'accept_a_payment',
        order_id: order._id.toString(),
        user_id: req.user._id
      },
    });

    console.log('PaymentIntent creato con successo:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status
    });

    // Non aggiorniamo l'ordine come pagato qui, lo faremo solo dopo la conferma del pagamento
    // Invece, salviamo solo il paymentIntent ID per riferimento
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    console.log('Ordine aggiornato con paymentIntentId');

    // Send the order details and client secret to the client
    res.send({ 
      order: {
        _id: order._id,
        user: order.user,
        totalPrice: order.totalPrice,
        isPaid: order.isPaid
      }, 
      client_secret: paymentIntent.client_secret 
    });

    console.log('=== FINE PROCESSO DI PAGAMENTO ===');
  } catch (err) {
    console.error('=== ERRORE DURANTE IL PAGAMENTO ===');
    console.error('Tipo di errore:', err.name);
    console.error('Messaggio di errore:', err.message);
    console.error('Stack trace:', err.stack);
    console.error('=== FINE ERRORE ===');
    
    res.status(500).send({ 
      error: 'Failed to retrieve client secret',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Route to retrieve the publishable key for Stripe
stripeRouter.get('/key', (req, res) => {
  res.send(config.STRIPE_PUBLISHABLE_KEY); // Send the publishable key to the client
});

export default stripeRouter; // Exporting the router for use in other modules
