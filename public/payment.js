stage = 'live';
const host = stage === 'dev' ? 'http://localhost:5001' : 'https://dobsondesigns.co.uk';
const stripe = Stripe('pk_test_51Lehn0L1RAxSEJRTd4izpVFc41Goa6fAW0jdFHS0OqDEHrYw5DxgTPCH3YPJzuBRIrXVNlcJUbR0sjLTKNs2WQVV00fY5diRTi');

const startCheckout = document.getElementById('startCheckout');

startCheckout.addEventListener('click', () => {
    console.log("click");
    startCheckout.textContent = "Processing..."
    buyProducts(myProducts())
});

function myProducts() {
    const getProducts = JSON.parse(localStorage.getItem('productsInCart'));
    
    const products = [];
    for( const property in getProducts) {
        products.push({
            tag: getProducts[property].tag,
            inCart: getProducts[property].inCart
        })
    }
    console.log(products);
    return products;
}

async function buyProducts(cartProducts) {
    try {
        
        const body = JSON.stringify({
            products: cartProducts
        })

        const response = await axios.post(`${host}/checkout`, body, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })

        localStorage.setItem('sessionId', response.data.session.id);
        
        await stripe.redirectToCheckout({
            sessionId: response.data.session.id
        })

    } catch (error) {
        console.log(error);
    }
}