// BLOQUE 1

'use strict';
const params =  new URLSearchParams(window.location.search); // Obtenmos el URL del navegador
const user = params.get('user')  ?? 'anonimo'; // Obtenemos el usuario de la URL y si no tiene se le asigna 'anonimo' por defecto
const role = params.get('role')  ?? 'invitado'; //  Obtenemos el role y si no tiene se le asigna 'invitado' por defecto
const lang = navigator.language; // Aqui definimos una constante para que almacene el idioma del navegador
const id = crypto.randomUUID(); // Creamos un ID unico y seguro con la api de crypto
const email = " enmanuellemos.f@gmail.com ";
const id_cliente = "42";
const btn_oferta = document.querySelector('.oferta_relampago');
const span_contador = document.querySelector('.contador_oferta');
const historial_resenias = document.querySelector('.historial_resenias');
const text_resenias = document.querySelector('.text_resenias');
const btn_subir_resenia = document.querySelector('.anyadir_resenia');

// Constante para definir el formato de como queremos la fecha
const date = new Date().toLocaleDateString("es-ES",{
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

const estado_conexion = navigator.onLine ? 'Conectado' : 'Desconectado'; // Constante para devolver el estado de conexion del navegador
const email_limpio = email.trim().toLowerCase(); // Limpiamos los espacios del email y lo pasamos a minusculas
let id_cliente_formateado = id_cliente.padStart(6, "0"); // Y formateamos el id para que tenga 6 digitos con ceros ala izquierda
const partes_email = email_limpio.split("@"); // Seleccionamos el usario antes del @, ej: enma.garcia@gmail.com => seria: enma.garcia
// Sellecionamos el usuario antes del @ y el dominio del corrio despues del @
const usuario_email = partes_email[0]; 
const dominio_email = partes_email[1];

// Asignaciones por defecto
let apodo = "";       
let membresia = undefined;
let saldo = null;      
apodo = apodo || "Cliente VIP";
membresia = membresia ?? "Basica";
saldo = saldo ?? 2;

// BLOQUE 2 - CATALOGO Y OPERACIONES FINANCIERAS

let precio_chaqueta = "59.90€";
let precio_camiseta = "19.99€";
let precio_float_chaqueta = parseFloat(precio_chaqueta);
let precio_float_camiseta = parseFloat(precio_camiseta);
let subtotal = precio_float_camiseta + precio_float_chaqueta;
const iva = 0.21;
let base_imponible = 0;
let iva_total = 0;
let total_pago = 0;
let cupon = "90€";

cupon = parseFloat(cupon);
if (!isNaN(subtotal)) { // Verificamos si subtotal es un numero
    base_imponible = subtotal - cupon; // La base imponible de una factura es el importe neto de la venta o servicio antes de aplicar impuestos como el IVA o retenciones como el IRPF
    iva_total = base_imponible * iva;
    total_pago = base_imponible + iva_total;
    console.log(total_pago);
} else {
    console.log("No es un numero");
}

let numero_pedido = 0;
numero_pedido ++;

// Formateamos de manera regional con la funcion Intl.NumberFormat, esto formatea de manera automatica a la moneda del pais
// en este caso España 'es-ES'. Ej: '123456.789' => '123.456,79 €'
const formatter_EUR = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
});
const subtotal_formateado = formatter_EUR.format(subtotal);
const cupon_formateado = formatter_EUR.format(cupon);
const iva_total_formateado = formatter_EUR.format(iva_total);
const total_pago_formateado = formatter_EUR.format(total_pago);

// BLOQUE 3: OFERTA RELAMPAGO Y TEMPORIZADOR

let contador = 15;
let intervalo = null; // aqui guardaremos el setInterval
let oferta_activa = false;

// Estado del carrito: unidades de cada producto y si el cupon esta aplicado
let carrito_chaqueta = 0; // unidades de chaqueta en el carrito
let carrito_camiseta = 0; // unidades de camiseta en el carrito
let cupon_activo = false; // indica si el cupon de oferta relampago esta aplicado

btn_oferta.addEventListener('click', () => {
    if (oferta_activa) return; // prevenir multiples clics
    oferta_activa = true;
    btn_oferta.textContent = 'Oferta activa...';
    btn_oferta.disabled = true;
    btn_oferta.classList.add('opacity-50', 'cursor-not-allowed');

    intervalo = setInterval(() => {
        contador--;
        span_contador.textContent = contador;

        // Mientras el temporizador corre y hay productos en el carrito, aplicar cupon
        if (contador > 0 && (carrito_chaqueta > 0 || carrito_camiseta > 0)) {
            cupon_activo = true;
            actualizarCarrito(); // Recalcular con descuento en tiempo real
        }

        if (contador === 0) {
            clearInterval(intervalo);
            oferta_activa = false; // reset para futuras promociones
            span_contador.textContent = '0';
            btn_oferta.textContent = 'Oferta expirada';
            btn_oferta.classList.remove('border-white', 'hover:bg-white', 'hover:text-gray-900');
            btn_oferta.classList.add('border-gray-600', 'text-gray-500', 'cursor-not-allowed');
        }
    }, 1000);
});

// BLOQUE 4: CREACION Y PUBLICACION DE RESEÑAS

btn_subir_resenia.addEventListener('click', () => {
    const textarea_valor = text_resenias.value;
    if (!textarea_valor.trim()) return; // No publicar reseñas vacías

    const resena = {
        id: new Date().getTime(),
        usuario: user, 
        hora: new Date().toLocaleTimeString('es-ES'),
        comentario: textarea_valor
    };
    let resenias = [];
    try {
        resenias = JSON.parse(localStorage.getItem('resenias')) ?? []; //  Recuperar reseñas existentes (puede que no haya ninguna todavía)
        resenias.push(resena); //  Añadir la nueva reseña
        localStorage.setItem('resenias', JSON.stringify(resenias)); //  Guardar array actualizado
    } catch (error) {
        // Verificar si es error de espacio lleno
        if (error.name === "QuotaExceededError" ||  
            error.code === 22 || 
            error.name === "NS_ERROR_DOM_QUOTA_REACHED" || 
            error.code === 1014) {
            console.error("Error: Espacio de almacenamiento lleno.");
        } else {
            console.error("Error al acceder a localStorage:", error.message); // Capturar otros errores (ej. modo privado, políticas de seguridad)
        }
        return false;
    }

    // Limpiar y re-renderizar el historial completo en orden más reciente primero
    historial_resenias.innerHTML = '';
    const resenias_orden_nuevo = [...resenias].reverse(); // Más reciente primero, sin mutar el array original
    resenias_orden_nuevo.forEach(resena => {
        const div_hsitoria_resenias = document.createElement('div');
        div_hsitoria_resenias.className = 'border-l-2 border-gray-900 pl-5 py-1';

        const titulo = document.createElement('p');
        titulo.className = 'font-semibold text-gray-900 text-sm';
        titulo.textContent = `${resena.usuario}`; // textContent para prevenir XSS

        const hora = document.createElement('p');
        hora.className = 'text-xs text-gray-400 mt-0.5 mb-3';
        hora.textContent = `${resena.hora}`; // textContent para prevenir XSS

        const comentario = document.createElement('p');
        comentario.className = 'text-gray-600 text-sm leading-relaxed';
        comentario.textContent = resena.comentario; // textContent para prevenir XSS

        div_hsitoria_resenias.appendChild(titulo);
        div_hsitoria_resenias.appendChild(hora);
        div_hsitoria_resenias.appendChild(comentario);
        historial_resenias.appendChild(div_hsitoria_resenias);
    });

    text_resenias.value = '';
});

// CONECTAR DATOS CON HTML

function mostrarSesion() {
    document.querySelector('.user-name').textContent = user;
    document.querySelector('.user-id').textContent = id_cliente_formateado;
    document.querySelector('.role').textContent = role;
    document.querySelector('.fecha_actual').textContent = date;
    document.querySelector('.idioma_navegador').textContent = lang;
}

function renderizarProductos() {
    const productosDiv = document.querySelector('.productos');
    // Usamos innerHTML aquí solo para el esqueleto estático de los productos
    // Los valores dinámicos de precio se inyectan via textContent desde actualizarCarrito
    productosDiv.innerHTML = `
        <div class="product-card border border-gray-100 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
            <div class="bg-gray-50 h-48 flex items-center justify-center">
                <span class="text-5xl">🧥</span>
            </div>
            <div class="p-5">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-1">Outerwear</p>
                <h3 class="text-base font-semibold text-gray-900">Chaqueta Denim</h3>
                <p class="product-precio-chaqueta text-2xl font-bold mt-2 mb-4"></p>
                <button
                    class="btn-add-chaqueta w-full py-2 text-xs font-medium tracking-widest uppercase border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                    Añadir al carrito
                </button>
            </div>
        </div>
        <div class="product-card border border-gray-100 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
            <div class="bg-gray-50 h-48 flex items-center justify-center">
                <span class="text-5xl">👕</span>
            </div>
            <div class="p-5">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-1">Tops</p>
                <h3 class="text-base font-semibold text-gray-900">Camiseta Urban</h3>
                <p class="product-precio-camiseta text-2xl font-bold mt-2 mb-4"></p>
                <button
                    class="btn-add-camiseta w-full py-2 text-xs font-medium tracking-widest uppercase border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                    Añadir al carrito
                </button>
            </div>
        </div>
    `;

    // Inyectar precios via textContent (nunca innerHTML para datos dinámicos)
    document.querySelector('.product-precio-chaqueta').textContent = formatter_EUR.format(precio_float_chaqueta);
    document.querySelector('.product-precio-camiseta').textContent = formatter_EUR.format(precio_float_camiseta);

    // Listeners de "añadir al carrito" para cada producto
    document.querySelector('.btn-add-chaqueta').addEventListener('click', () => {
        carrito_chaqueta++; // Incrementar unidades de chaqueta
        actualizarCarrito();
    });
    document.querySelector('.btn-add-camiseta').addEventListener('click', () => {
        carrito_camiseta++; // Incrementar unidades de camiseta
        actualizarCarrito();
    });
}

function actualizarCarrito() {
    // Calcular el subtotal dinamicamente segun unidades en el carrito
    const subtotal_dinamico = (precio_float_chaqueta * carrito_chaqueta) + (precio_float_camiseta * carrito_camiseta);

    // Calcular el descuento: cupon activo solo si hay productos y la oferta esta activa
    const descuento_aplicado = (cupon_activo && subtotal_dinamico > 0) ? cupon : 0;

    const base = subtotal_dinamico - descuento_aplicado; // Base imponible real
    const iva_calculado = base > 0 ? base * iva : 0; // IVA sobre la base (nunca negativo)
    const total_calculado = base + iva_calculado;

    // Renderizar lista de items del carrito
    const items_div = document.querySelector('.items-carrito');
    items_div.innerHTML = ''; // Limpiar antes de re-renderizar

    if (carrito_chaqueta === 0 && carrito_camiseta === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'text-xs text-gray-300 py-2';
        vacio.textContent = 'Tu carrito está vacío.'; // textContent para prevenir XSS
        items_div.appendChild(vacio);
    }

    if (carrito_chaqueta > 0) {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center text-sm py-1';
        const nombre = document.createElement('span');
        nombre.className = 'text-gray-600';
        nombre.textContent = `Chaqueta Denim ×${carrito_chaqueta}`; // textContent para prevenir XSS
        const precio = document.createElement('span');
        precio.className = 'font-medium text-gray-900';
        precio.textContent = formatter_EUR.format(precio_float_chaqueta * carrito_chaqueta); // textContent para prevenir XSS
        item.appendChild(nombre);
        item.appendChild(precio);
        items_div.appendChild(item);
    }

    if (carrito_camiseta > 0) {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center text-sm py-1';
        const nombre = document.createElement('span');
        nombre.className = 'text-gray-600';
        nombre.textContent = `Camiseta Urban ×${carrito_camiseta}`; // textContent para prevenir XSS
        const precio = document.createElement('span');
        precio.className = 'font-medium text-gray-900';
        precio.textContent = formatter_EUR.format(precio_float_camiseta * carrito_camiseta); // textContent para prevenir XSS
        item.appendChild(nombre);
        item.appendChild(precio);
        items_div.appendChild(item);
    }

    // Actualizar el desglose financiero via textContent
    document.querySelector('.subtotal').textContent = formatter_EUR.format(subtotal_dinamico);
    document.querySelector('.descuentos').textContent = descuento_aplicado > 0
        ? `- ${formatter_EUR.format(descuento_aplicado)}`
        : '—';
    document.querySelector('.iva').textContent = formatter_EUR.format(iva_calculado);
    document.querySelector('.total').textContent = formatter_EUR.format(total_calculado);
}

function cargarResenasExistentes() {
    let resenias = [];
    try {
        resenias = JSON.parse(localStorage.getItem('resenias')) ?? [];
    } catch (error) {
        console.error("Error al cargar reseñas:", error.message);
    }

    // Mostrar en orden más reciente primero (reverse) sin mutar el array guardado
    const resenias_orden_nuevo = [...resenias].reverse();
    resenias_orden_nuevo.forEach(resena => {
        const div_hsitoria_resenias = document.createElement('div');
        div_hsitoria_resenias.className = 'border-l-2 border-gray-900 pl-5 py-1';

        const titulo = document.createElement('p');
        titulo.className = 'font-semibold text-gray-900 text-sm';
        titulo.textContent = resena.usuario; // textContent para prevenir XSS

        const hora = document.createElement('p');
        hora.className = 'text-xs text-gray-400 mt-0.5 mb-3';
        hora.textContent = resena.hora; // textContent para prevenir XSS

        const comentario = document.createElement('p');
        comentario.className = 'text-gray-600 text-sm leading-relaxed';
        comentario.textContent = resena.comentario; // textContent para prevenir XSS

        div_hsitoria_resenias.appendChild(titulo);
        div_hsitoria_resenias.appendChild(hora);
        div_hsitoria_resenias.appendChild(comentario);
        historial_resenias.appendChild(div_hsitoria_resenias);
    });
}

mostrarSesion();
renderizarProductos();
actualizarCarrito();
cargarResenasExistentes();