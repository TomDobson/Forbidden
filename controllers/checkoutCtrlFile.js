const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { productList } = require('../products');
const Email = require('../utils/email');
const Order = require('../models/orderModel');

exports.checkoutCtrlFunction = async (req, res) => {
    try {
        const productsFromFrontend = req.body.products;

        function productsToBuy() {
            let products = [];
            
            productList.forEach( singleProductList => {
                productsFromFrontend.forEach(singleProductFrontend => {
                    if( singleProductList.tag === singleProductFrontend.tag ) {
                        products.push({
                            price_data: {
                                currency: 'gbp',
                                unit_amount: singleProductList.price * 100,
                                product_data: {
                                    name: singleProductList.name,
                                    description: singleProductList.description,
                                    images: [singleProductList.image],
                                },
                            },
                            quantity: singleProductFrontend.inCart,
                        })
                    }
                })
            })
            return products 
        }
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/cart`,
            shipping_address_collection: {
                allowed_countries: ['GB']
            },
            line_items: 
                productsToBuy()
        })
        res.status(200).json({
            status: "success",
            session: session
        })
    } catch (error) {
        console.log(error);
    }
}

exports.cartSuccessFunction = (req, res) => {
    res.render('thankyouPage');
}

exports.finishOrder = async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(
        req.params.id,
        {
            expand: ['line_items'],
        }
    );

    const lineLitems = session.line_items;

    //console.log("My payment was: ")
    //console.log(session);
    //console.log("My product was: ")
    //console.log(lineLitems.data);

    if(session.payment_status === "paid") {
        const purchasedProducts = lineLitems.data.map(product => (
            {
                productName: product.description,
                price: product.price.unit_amount / 100,
                quantity: product.quantity
            }
        ))

        //console.log(purchasedProducts);


        //save transaction into the database
        await Order.create({
            userName: session.customer_details.name,
            userEmail: session.customer_details.email,
            products: purchasedProducts,
            totalPrice: session.amount_total / 100
        })

        console.log("Purchase saved on Database");

        //send an email
        await new Email({
            name: session.customer_details.name,
            email: session.customer_details.email
        },  purchasedProducts, session.amount_total).sendThankYou();

        return res.status(200).json({
            success: true
        })
    }

    res.status(200).json({
        success: false
    })
}