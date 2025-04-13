const productos = [
  { id: 1, nombre: "Consulta Jurídica Laboral", precio: 150000, imagen: "https://st4.depositphotos.com/13193658/22026/i/950/depositphotos_220266824-stock-photo-high-angle-view-lawyer-client.jpg", categoria: "consulta" },
  { id: 2, nombre: "Revisión de Contrato", precio: 300000, imagen: "https://www.gchnicaragua.com/wp-content/uploads/2024/05/contratos-bahia-blanca.jpg", categoria: "contrato" },
  { id: 3, nombre: "Representación en Juicio", precio: 500000, imagen: "https://www.legaltoday.com/wp-content/uploads/2020/12/sala-juicio.jpg", categoria: "juicio" },
  { id: 4, nombre: "Asesoría por Despido Injustificado", precio: 250000, imagen: "https://fc-abogados.com/wp-content/uploads/2014/06/Imagenes-para-post-52.jpg", categoria: "despido" },
  { id: 5, nombre: "Capacitación a Recursos Humanos", precio: 600000, imagen: "https://www.bizneo.com/blog/wp-content/uploads/2020/01/area-de-recursos-humanos-810x455.jpg", categoria: "capacitacion" },
  { id: 6, nombre: "Auditoría Legal Laboral", precio: 380000, imagen: "https://www.bufetegodinezyasociados.com/portals/0/ThemePluginPro/uploads/2021/5/25/AuditoriaLegal-01.jpg", categoria: "auditoria" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total");
const cantidadCarrito = document.getElementById("cantidad-carrito");

function mostrarProductos(filtro = "todas") {
  contenedorProductos.innerHTML = "";
  const filtrados = filtro === "todas" ? productos : productos.filter(p => p.categoria === filtro);
  filtrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio.toLocaleString()}</p>
      <button class="agregar" onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

function filtrarCategoria() {
  const filtro = document.getElementById("categoria").value;
  mostrarProductos(filtro);
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const item = carrito.find(i => i.id === id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;
  let cantidad = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}`;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
    cantidad += item.cantidad;
  });
  totalCarrito.textContent = total.toLocaleString();
  cantidadCarrito.textContent = cantidad;
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
  if (confirm("¿Vaciar el carrito?")) {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
  }
}

function finalizarCompra() {
  alert("✅ Gracias por tu compra. Nos contactaremos pronto.");
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

paypal.Buttons({
  createOrder: (data, actions) => {
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    return actions.order.create({
      purchase_units: [{
        amount: { value: (total / 4000).toFixed(2) } // Asumiendo tasa COP→USD
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(() => finalizarCompra());
  }
}).render("#paypal-button-container");

mostrarProductos();
actualizarCarrito();
