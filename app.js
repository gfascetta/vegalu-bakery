import { products, categories } from "./products.js";

//-------------------------------------Selectores
//seccion productos
const filterContainer = document.querySelector(".products-filter");
const cardContainer = document.querySelector(".card-container__products");
//const cartCount =
const cart = document.querySelector(".cart-container");
//navbar
const cartList = cart.querySelector(".cart-list");
//------------------------------------Renderizado de los componentes
const renderCategories = (categorias) => {
    let categoriasString = "";
    categorias.map(categoria => {
        categoriasString += `
        <span class="categories">${categoria}</span>
        `
    }).join('');
    filterContainer.innerHTML = categoriasString;
}



const renderProducts = (productos) => {
    let productosToRender = "";
    productos.map(producto => {
        productosToRender += `
        <div class="card">
                    <div class="card__img">
                        <img src=${producto.img} alt="">
                    </div>

                    <div class="card__description">
                        <h3 class="card-description__h3">${producto.name}</h3>
                        <p class="card-description__p">${producto.info}</p>
                        <p class="price__p">$ ${producto.price}</p>
                        <button class="buy-button">Comprar</button>
                    </div>
        </div>
        `
    }).join("");

    cardContainer.innerHTML = productosToRender;
}


//------------------------------------Manejo de eventos
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
    filterContainer.addEventListener('click', productsFilter);
};
//-----------------------------------Run the app
app();