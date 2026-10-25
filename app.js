class Carrito {

  constructor(productos, moneda) { // Tenemos que recibir los productos de la API de alguna manera 
    this.moneda = moneda;
    this.productos = productos.map(function (p) {
      return {
        sku: p.SKU,
        title: p.title,
        price: parseFloat(p.price), 
        quantity: 0
      };
    });
  }

 
  buscarProducto(sku) { // FIND <- Le damos el Sku para que nos devuelva el producto que tiene ese sku 
    return this.productos.find(function (p) {
      return p.sku === sku;
    });
  }

  
  actualizarUnidades(sku, unidades) {
    const producto = this.buscarProducto(sku);
    if (producto) {
      producto.quantity = Math.max(0, parseInt(unidades) || 0)
    }
  }

  
  obtenerInformacionProducto(sku) {  // CLAVE - VAAAAAAALOOOOOOOOOR
    const producto = this.buscarProducto(sku);
    if (!producto) {
      return null;
    }
    return {
      sku: producto.sku,
      title: producto.title,
      price: producto.price.toFixed(2),
      quantity: producto.quantity,
      subtotal: (producto.price * producto.quantity).toFixed(2)
    };
  }

  
  obtenerCarrito() {
    const productosEnCarrito = this.productos
      .filter(p => p.quantity > 0)
      .map(p => this.obtenerInformacionProducto(p.sku));

    let total = 0;
    productosEnCarrito.forEach(function (p) {
      total += parseFloat(p.subtotal);
    });

    return {
      total: total.toFixed(2),
      currency: this.moneda,
      products: productosEnCarrito
    };
  }
}



//CARRITO Y CANTIDADES (Y MODIFICACION DE LAS MISMAS)
let carrito;


function mostrarProductos() {
  const tbody = document.getElementById("lista-productos");
  tbody.innerHTML = ""; // vaciamos por si había algo

  carrito.productos.forEach(function (producto) {
    const info = carrito.obtenerInformacionProducto(producto.sku);

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>
        <strong>${info.title}</strong><br>
        <small>REF: ${info.sku}</small>
      </td>
      <td>
        <button class="menos">−</button>
        <span class="cantidad">${info.quantity}</span>
        <button class="mas">+</button>
      </td>
      <td>${info.price} ${carrito.moneda}</td>
      <td class="subtotal">${info.subtotal} ${carrito.moneda}</td>
    `;

    // Eventos de los botones de esta fila
    fila.querySelector(".menos").addEventListener("click", function () {
      cambiarCantidad(info.sku, -1, fila);
    });
    fila.querySelector(".mas").addEventListener("click", function () {
      cambiarCantidad(info.sku, 1, fila);
    });

    tbody.appendChild(fila);
  });
}


function cambiarCantidad(sku, cambio, fila) {

  const actual = carrito.obtenerInformacionProducto(sku).quantity;
  carrito.actualizarUnidades(sku, actual + cambio);


  const info = carrito.obtenerInformacionProducto(sku);
  fila.querySelector(".cantidad").textContent = info.quantity;
  fila.querySelector(".subtotal").textContent = `${info.subtotal} ${carrito.moneda}`;
  mostrarResumen();
}


function mostrarResumen() {
  const datos = carrito.obtenerCarrito();
  const lista = document.getElementById("resumen-productos");
  lista.innerHTML = "";

  datos.products.forEach(function (p) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${p.quantity} x ${p.title}</span>
                    <span>${p.quantity} x ${p.price} ${datos.currency}</span>`;
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = `${datos.total} ${datos.currency}`;
}

carrito = new Carrito([
  { SKU: "0K3QOSOV4V", title: "iPhone 13 Pro", price: "938.99" },
  { SKU: "TGD5XORY1L", title: "Cargador", price: "49.99" },
  { SKU: "IOKW9BQ9F3", title: "Funda de piel", price: "79.99" }
], "€");
mostrarProductos();
mostrarResumen();


// PEDIR PRODUCTOS DESDE LA API (REPASAR ESTO)
const URL_API = "api.php"; // Esta es la dirección de la API 

async function iniciar() {
  try {
    //Pedimos los datos a la API (petición GET)
    const respuesta = await fetch(URL_API);
    if (!respuesta.ok) {
      //Esto por si el servidor de error, es un catch, vamos
      throw new Error("Error HTTP " + respuesta.status);
    }

    //Convertimos la respuesta en un objeto JavaScript
    const datos = await respuesta.json();

    //Creamos el carrito con los productos recibidos ---> Tambien va a aparecer la página desde aqui 
    carrito = new Carrito(datos.products, datos.currency);
    mostrarProductos();
    mostrarResumen();

  } catch (error) { //Si algo falla, que avise y que no se rompa el solo 
    console.error("No se pudieron cargar los productos:", error);
    document.getElementById("lista-productos").innerHTML =
      '<tr><td colspan="4">No se pudieron cargar los productos.</td></tr>';
  }
}

iniciar(); // Esto pone en marcha la función de arriba, sin esto, no podría traer los objetos de la API. De hecho, no se llevaría a cabo nada. 