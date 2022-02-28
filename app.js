import { products } from "./products.js";

//-------------------------------------Selectores
const cardContainer = document.querySelector(".card-container__products");
//const cartCount =
//const cart = 

//------------------------------------Renderizado de los componentes
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

//------------------------------------Persistencia de datos

//------------------------------------Entry point

function app() {
    renderProducts(products);
};
//-----------------------------------Run the app
app();