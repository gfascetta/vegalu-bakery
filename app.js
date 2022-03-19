import { products, categories } from "./products.js";

//-------------------------------------Selectores
//navbar
const navbar = document.querySelector('.navbar');
//seccion productos
const filterContainer = document.querySelector(".products-filter");
const cardContainer = document.querySelector(".card-container__products");
//carrito
const cart = document.querySelector(".cart-container");
const totalSpan = cart.querySelector('.total-number');
const cartCount = document.querySelector('.carrito-count');
const countContainer = cartCount.querySelector('.count-container');
const cartIcon = cartCount.querySelector('#cart-icon');
const confirmPurchaseBtn = cart.querySelector('.confirm-purchase');

//navbar
const cartList = cart.querySelector(".cart-list");


//----------Persistencia de datos---------- local storage
let carrito = JSON.parse(localStorage.getItem("carrito")) || {
    products: [],
    quantity: 0,
    total: 0
};
localStorage.setItem("carrito", JSON.stringify(carrito));

//------------------------------------Renderizado de los componentes
//mostrar categorias
const renderCategories = (categorias) => {
    let categoriasString = "";
    categorias.map(categoria => {
        categoriasString += `
        <span class="categories">${categoria}</span>
        `
    }).join('');
    filterContainer.innerHTML = categoriasString;
};
//mostrar los productos
const renderProducts = (productos) => {
    let productosToRender = "";
    productos.map(producto => {
        productosToRender += `
        <div class="card">
        <div class="card__img">
        <img src=${producto.img} alt="">
        </div>
        
        <div class="card__description"
                         data-product-id='${producto.id}'
                         data-product-img='${producto.img}'
                         data-product-name='${producto.name}'
                         data-product-info='${producto.info}'
                         data-product-price='${producto.price}'>
                         <h3 class="card-description__h3">${producto.name}</h3>
                         <p class="card-description__p">${producto.info}</p>
                         <p class="price__p">$ ${producto.price}</p>
                         <button class="buy-button ${carrito.products.some(product => product.name===producto.name)
                                                     ? 'disabled' 
                                                     : ''}">Comprar</button>
                         </div>
                         </div>
                         `
    }).join("");

    cardContainer.innerHTML = productosToRender;
};



//renderizar carrito

const renderCart = (productsList) => {
    let productsString = '';

    //primero ordeno la lista que recibo (esto lo saque de mdn)
    productsList.sort(function(a, b) {
        if (a.id > b.id) {
            return 1;
        }
        if (a.id < b.id) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });

    //lo mapeo ordenado
    productsList.map(producto => {
        productsString += `
                            <li class="cart-item">
                            <img src="${producto.img}" alt="" class="item-img">
                            <span class="name">${producto.name}</span>
                            <button class="decrease-button ${producto.quantity === 1? 'disabled' : ''}" data-minus-id='${producto.id}'>-</button>
                            <span class="unidades">${producto.quantity}</span>
                            <button class="increase-button" data-plus-id='${producto.id}'>+</button>
                            <button class="delete" data-delete-id='${producto.id}' data-quantity='${producto.quantity}'><i class="fa fa-trash" data-delete-id='${producto.id}' data-quantity='${producto.quantity}' aria-hidden="true"></i></button>
                            <span class="subtotal">Subtotal:</span>
                            <span class="subtotal-number">${producto.price * producto.quantity}</span>
                            </li>
                            `
    }).join('');


    cartList.innerHTML = productsString;

    totalSpan.textContent = `$ ${carrito.total}`;

    renderCartNumber();

};

const renderCartNumber = () => {
    countContainer.innerHTML = `<div ${carrito.quantity===0 ? 'class=hidden' : 'class=cart-count'}>${carrito.quantity}</div>`
}



//------------------------------------Manejo de eventos

//agregar un producto al carrito
const addProduct = ({ target }) => {
    if (target.nodeName.toLowerCase() !== 'button' || target.classList.contains('disabled')) {
        return
    };
    let cartProductActual = {
        id: target.parentElement.dataset.productId,
        img: target.parentElement.dataset.productImg,
        name: target.parentElement.dataset.productName,
        quantity: 1,
        price: parseInt(target.parentElement.dataset.productPrice),
    };
    //console.dir(target.parentElement.childNodes[1].innerText)
    //observacion: el traversing the DOM no seria tan mala idea si no fuera porque el precio es "$xx"

    carrito.products.push(cartProductActual);

    //agrego uno al total items comprados
    carrito.quantity++;
    //calcular total
    carrito.total += cartProductActual.price;

    //actualizar ls
    localStorage.setItem("carrito", JSON.stringify(carrito));

    //desactivo el boton de comprar de la card que toque
    target.classList.add('disabled');


    renderCart(carrito.products);

};


//----filtrado de productos
const productsFilter = ({ target }) => {
    if (target.nodeName.toLowerCase() !== 'span') {
        return
    };
    let productsFiltrados = products.filter(producto => {
        return producto.category === target.textContent
    });
    if (target.textContent === "Todos") {
        productsFiltrados = products;
    };
    renderProducts(productsFiltrados);
};

//----sumar o restar productos
const plusOrMinusOneProduct = ({ target }) => {

    if (!target.classList.contains('increase-button') && !target.classList.contains('decrease-button') && target.classList.contains('disabled')) {
        return
    };
    console.log(target);
    console.dir(target);
    // ubicar mi producto

    if (target.classList.contains('increase-button')) {
        let productoSeleccionado = carrito.products.find(producto => producto.id === target.dataset.plusId);

        //actualizar precio y subtotal
        productoSeleccionado.quantity++;
        carrito.total += productoSeleccionado.price;
        carrito.products = carrito.products.filter(producto => producto.id !== productoSeleccionado.id);
        carrito.products.push(productoSeleccionado);
        console.log(carrito.products);

        //sumar uno al carrito.quantity
        carrito.quantity++
    }

    if (target.classList.contains('decrease-button')) {
        let productoSeleccionado = carrito.products.find(producto => producto.id === target.dataset.minusId);

        if (productoSeleccionado.quantity === 2) {
            target.classList.add('disabled');
        };

        if (productoSeleccionado.quantity > 1) {
            //actualizar precio y subtotal
            productoSeleccionado.quantity--;
            carrito.total -= productoSeleccionado.price;
            carrito.products = carrito.products.filter(producto => producto.id !== productoSeleccionado.id);
            carrito.products.push(productoSeleccionado);

            //restar uno al carrito.quantity
            carrito.quantity--
        }
    }

    //actualizar local storage
    localStorage.setItem("carrito", JSON.stringify(carrito));


    renderCart(carrito.products);
}

const deleteProduct = ({ target }) => {
    //si no toque en el div del tacho o en el tacho que no haga nada
    if (!target.classList.contains('delete') && !target.classList.contains('fa-trash')) {
        return;
    };

    console.log(target);

    let productoSeleccionado = carrito.products.find(producto => producto.id === target.dataset.deleteId);

    carrito.products = carrito.products.filter(producto => producto.id !== target.dataset.deleteId);

    //calcular nuevo total del objeto carrito
    carrito.total = carrito.total - productoSeleccionado.price * parseInt(target.dataset.quantity);

    //actualizar la cantidad del objeto carrito
    carrito.quantity = carrito.quantity - parseInt(target.dataset.quantity);

    //actualizar local storage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCart(carrito.products);
}


//mostrar ocultar carrito

const showCart = ({ target }) => {
    cart.classList.toggle('cart-active')
}

// finalizar compra
const confirmPurchase = (e) => {
    if (carrito.quantity === 0) {
        window.alert('no seleccionaste ningun producto');
    }
    console.dir(e.target)

    //window confirm y limpiar LS (removeItem carrito)
    //recargar la pagina window.location.replace

};


//---------------------menu hamburguesa

//menu hamburguesa
const renderBurgerMenu = () => {
    navbar.innerHTML += `
    <div class='burger-container'>
    <i class="fas fa-bars"></i>
    </div>
    `
}

const showBurgerMenu = ({ target }) => {
    if (target.tagName !== 'I') {
        return;
    };
    target.parentElement.parentElement.childNodes[1].classList.toggle('menu-active')
}

const burgerMenu = () => {
    if (window.screen.width > 900) {
        return;
    };
    renderBurgerMenu()
    let burgerContainer = navbar.querySelector('.burger-container');
    burgerContainer.addEventListener('click', showBurgerMenu)
}

//------------------------------------Entry point

function app() {

    burgerMenu();
    renderCategories(categories);
    renderProducts(products);
    renderCart(carrito.products) // por si ya tenia algo en el LocalStorage
    filterContainer.addEventListener('click', productsFilter);
    cardContainer.addEventListener('click', addProduct);
    cartList.addEventListener('click', plusOrMinusOneProduct);
    cartList.addEventListener('click', deleteProduct);
    //mostrarOcultar carrito
    cartIcon.addEventListener('click', showCart);
    //confirmar compra
    confirmPurchaseBtn.addEventListener('click', confirmPurchase);
};
//-----------------------------------Run the app
app();