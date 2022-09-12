let carts = document.querySelectorAll('.add-cart');
let stage = 'live';
let products = [];

async function getProducts() {
    const host = stage === 'dev' ? 'http://localhost:5001' : 'https://dobsondesigns.co.uk';
    const response = await axios.get(`${host}/products`);
    products = response.data.products;

    populateProducts();
}
getProducts();

function populateProducts() {
    const container = document.querySelector('.container');

    const productsHtml = products.map((product, i) => {
        return (
            `
                <div class="image">
                    <img src="${product.image}" alt="${product.description}">
                    <h3>${product.name}</h3>
                    <h3>£${product.price}</h3>
                    <a class="add-cart cart${i}" href="#">Add to Cart</a>
                </div>
            `
        )
    })

    if (container) {
        container.innerHTML += productsHtml.toString().replaceAll(',', '');
        addCartAction();
    }

}

function addCartAction() {
    const hoverProducts = document.getElementsByClassName('image');
    let carts = document.querySelectorAll('.add-cart');

    for (let i = 0; i < hoverProducts.length; i++) {
        hoverProducts[i].addEventListener('mouseover', () => {
            carts[i].classList.add('showAddCart');
        })
        hoverProducts[i].addEventListener('mouseout', () => {
            carts[i].classList.remove('showAddCart');
        })
        carts[i].addEventListener('click', () => {
            cartNumbers(products[i]);
            totalCost(products[i]);
        })
    }
}

for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (action == "decrease") {
        localStorage.setItem('cartNumbers', productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
    } else if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }

    setItems(product);
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    //console.log("My cart Items are", cartItems);
    if (cartItems != null) {
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product, action) {
    let cartCost = localStorage.getItem('totalCost');

    if (action == "decrease") {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost - product.price);
    } else if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price)
    } else {
        localStorage.setItem('totalCost', product.price);
    }
    //console.log("The total price is", cartCost);
    //console.log(typeof cartCost);
}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
            <div class="product">
                <ion-icon name="close-circle"></ion-icon>
                <img src="${item.image}">
                <span>${item.name}</span> 
            </div>
            <div class="price">£${item.price}.00</div>

            <div class="quantity">
                <ion-icon class="decrease" name="caret-back-circle-sharp"></ion-icon>
                <span>${item.inCart}</span>
                <ion-icon class="increase" name="caret-forward-circle-sharp"></ion-icon>
            </div>

            <div class="total">
                £${item.inCart * item.price}.00
            </div>
            `;
        });

        productContainer.innerHTML += `
        <div class="basketTotalContainer">
            <h4 class="basketTotalTitle">
                Basket total:
            </h4>
            <h4 class="basketTotal">
                £${cartCost}.00
            </h4>
        `
    }

    deleteButtions();
    manageQuantity();
}

function deleteButtions() {
    let deleteButtions = document.querySelectorAll('.product ion-icon');
    let productName;
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let cartCost = localStorage.getItem('totalCost');

    for (let i = 0; i < deleteButtions.length; i++) {
        deleteButtions[i].addEventListener('click', () => {
            productName = deleteButtions[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');

            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);

            localStorage.setItem('totalCost', cartCost - (cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();

            //console.log(productName);
            //console.log(cartItems[productName].name + " " + cartItems[productName].inCart);
            //console.log("We have "+ productNumbers + " products in cart");
        })
    }
}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let cartItems = localStorage.getItem('productsInCart');
    let currentQuantity = 0;
    let currentProduct = "";
    cartItems = JSON.parse(cartItems);
    console.log(cartItems);


    for (let i = 0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            //console.log("Decrease button");
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            //console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            //console.log(currentProduct);

            if (cartItems[currentProduct].inCart > 1) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        })
    }

    for (let i = 0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            //console.log("Increase button");
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            //console.log(currentQuantity);
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            //console.log(currentProduct);

            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        })
    }
}

onLoadCartNumbers();
displayCart();
