import { products, categories } from "./products.js";

//-------------------------------------Selectores
//navbar
const navbar = document.querySelector('.navbar');
//seccion productos
const filterContainer = document.querySelector(".products-filter");
const cardContainer = document.querySelector(".card-container__products");
//carrito
//const cartCount =
const cart = document.querySelector(".cart-container");
const totalSpan = cart.querySelector('.total-number');
//navbar
const cartList = cart.querySelector(".cart-list");


//----------------------------------------------- local storage
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
    productsList.map(producto => {
        productsString += `
                            <li class="cart-item">
                            <img src="${producto.img}" alt="" class="item-img">
                            <span class="name">${producto.name}</span>
                            <button class="decrease-button" data-minus-id='${producto.id}'>-</button>
                            <span class="unidades">${producto.quantity}</span>
                            <button class="increase-button" data-plus-id='${producto.id}'>+</button>
                            <button class="delete" data-delete-id='${producto.id}'>eliminar</button>
                            <span class="subtotal">Subtotal:</span>
                            <span class="subtotal-number">${producto.price * producto.quantity}</span>
                            </li>
                            `
    }).join('');
    cartList.innerHTML = productsString;
    totalSpan.textContent = `$ ${carrito.total}`;

};


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

//------------------------------------Manejo de eventos

//mostrar el navbar al scrollear arriba
// const showNavbar = () => {
//     console.log("scrolleaste") //????????????
// };

//filtrado de productos
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

//------------------------------------Persistencia de datos

//------------------------------------Entry point

function app() {
    renderCategories(categories);
    renderProducts(products);
    renderCart(carrito.products) // por si ya tenia algo en el LS
    filterContainer.addEventListener('click', productsFilter);
    //window.onscroll = showNavbar
    cardContainer.addEventListener('click', addProduct);
};
//-----------------------------------Run the app
app();