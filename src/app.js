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
let precio_air_jordan = "149.95€";   // Precio ficticio Zapatillas Air Jordan
let precio_real_madrid = "89.90€";  // Precio ficticio Camiseta Real Madrid
let precio_float_chaqueta = parseFloat(precio_chaqueta);
let precio_float_camiseta = parseFloat(precio_camiseta);
let precio_float_air_jordan = parseFloat(precio_air_jordan);
let precio_float_real_madrid = parseFloat(precio_real_madrid);
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
let oferta_activa = false; // indica si la cuenta atras esta corriendo

// Estado del carrito: unidades de cada producto y si el cupon esta aplicado
let carrito_chaqueta = 0;    // unidades de chaqueta en el carrito
let carrito_camiseta = 0;    // unidades de camiseta en el carrito
let carrito_air_jordan = 0;  // unidades de air jordan en el carrito
let carrito_real_madrid = 0; // unidades de camiseta real madrid en el carrito
let cupon_activo = false;    // indica si el cupon de oferta relampago esta aplicado

btn_oferta.addEventListener('click', () => {
    // FASE 2: Si el contador ya esta corriendo y el usuario pulsa para reclamar/activar la oferta
    if (oferta_activa && !cupon_activo) {
        cupon_activo = true; // El descuento SOLO se aplica cuando el usuario hace clic en activar oferta
        actualizarCarrito(); // Aplica el descuento al carrito inmediatamente
        btn_oferta.textContent = 'Oferta activada';
        btn_oferta.disabled = true;
        btn_oferta.className = 'oferta_relampago px-8 py-3 bg-emerald-600 border border-emerald-600 text-white text-sm font-medium tracking-wide transition-all cursor-default';
        return;
    }

    // Si ya esta corriendo y ya fue activada, evitar clics duplicados
    if (oferta_activa) return;

    // FASE 1: Activar el contador (marcha atras de 15 segundos)
    oferta_activa = true;
    cupon_activo = false; // AUN NO se aplica el descuento
    contador = 15;
    span_contador.textContent = contador;

    // El boton cambia a "Activar oferta" y permanece clickable durante los 15s
    btn_oferta.textContent = 'Activar oferta';
    btn_oferta.disabled = false;
    btn_oferta.className = 'oferta_relampago px-8 py-3 bg-white text-gray-900 border border-white text-sm font-bold tracking-wide hover:bg-gray-100 transition-all cursor-pointer shadow-lg';

    intervalo = setInterval(() => {
        contador--;
        span_contador.textContent = contador;

        if (contador === 0) {
            clearInterval(intervalo);
            intervalo = null;
            oferta_activa = false;

            // Si antes de los 15s NO se le dio al boton de activar oferta, NO se aplica el descuento
            if (!cupon_activo) {
                btn_oferta.textContent = 'Oferta expirada (No activada)';
                btn_oferta.disabled = true;
                btn_oferta.className = 'oferta_relampago px-8 py-3 border border-gray-700 text-gray-500 text-sm font-medium tracking-wide transition-all cursor-not-allowed';
            } else {
                btn_oferta.textContent = 'Oferta finalizada';
                btn_oferta.disabled = true;
                btn_oferta.className = 'oferta_relampago px-8 py-3 border border-emerald-700 text-emerald-400 text-sm font-medium tracking-wide transition-all cursor-not-allowed';
            }

            // Restaurar para futuras activaciones tras un breve lapso
            setTimeout(() => {
                span_contador.textContent = '—';
                btn_oferta.textContent = 'Iniciar oferta relámpago';
                btn_oferta.disabled = false;
                btn_oferta.className = 'oferta_relampago px-8 py-3 border border-white text-white text-sm font-medium tracking-wide hover:bg-white hover:text-gray-900 transition-all cursor-pointer';
            }, 2500);
        }
    }, 1000);
});

// BLOQUE 4: CREACION Y PUBLICACION DE RESEÑAS

// Formatea un timestamp (ms) al estilo: "0:53 a.m - 2/10/26"
function formatearFechaHora(timestamp) {
    const d = new Date(timestamp);
    let horas = d.getHours();
    const minutos = d.getMinutes().toString().padStart(2, '0');
    const periodo = horas < 12 ? 'a.m' : 'p.m';
    horas = horas % 12 || 12; // Convertir a formato 12h, sin padStart para que quede como "0:53"
    const dia = d.getDate();
    const mes = d.getMonth() + 1;
    const anio = d.getFullYear().toString().slice(2); // Solo los últimos 2 dígitos del año: "26"
    return `${horas}:${minutos} ${periodo} - ${dia}/${mes}/${anio}`;
}

// Crea y devuelve el elemento DOM de una reseña individual (con botones editar/eliminar)
function crearTarjetaResena(resena, indice_en_array) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'border-l-2 border-gray-900 pl-5 py-1 group';
    tarjeta.dataset.id = resena.id; // Guardamos el id para identificar la reseña

    // Cabecera: autor + fecha
    const cabecera = document.createElement('div');
    cabecera.className = 'flex items-start justify-between gap-4';

    const info = document.createElement('div');

    const titulo = document.createElement('p');
    titulo.className = 'font-semibold text-gray-900 text-sm';
    titulo.textContent = resena.usuario; // textContent para prevenir XSS

    const hora = document.createElement('p');
    hora.className = 'text-xs text-gray-400 mt-0.5 mb-3';
    hora.textContent = formatearFechaHora(resena.id); // textContent para prevenir XSS

    info.appendChild(titulo);
    info.appendChild(hora);

    // Botones: Editar y Eliminar (visibles solo en hover gracias a group)
    const acciones = document.createElement('div');
    acciones.className = 'flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0';

    const btn_editar = document.createElement('button');
    btn_editar.className = 'text-xs text-gray-400 hover:text-gray-900 transition-colors underline underline-offset-2';
    btn_editar.textContent = 'Editar';

    const btn_eliminar = document.createElement('button');
    btn_eliminar.className = 'text-xs text-gray-400 hover:text-red-600 transition-colors underline underline-offset-2';
    btn_eliminar.textContent = 'Eliminar';

    // ACCION: Eliminar reseña
    btn_eliminar.addEventListener('click', () => {
        let resenias = [];
        try {
            resenias = JSON.parse(localStorage.getItem('resenias')) ?? [];
            // Filtrar por id para eliminar la reseña correcta
            resenias = resenias.filter(r => r.id !== resena.id);
            localStorage.setItem('resenias', JSON.stringify(resenias));
        } catch (error) {
            console.error("Error al eliminar reseña:", error.message);
            return;
        }
        tarjeta.remove(); // Quitar del DOM directamente, sin re-renderizar todo
    });

    // ACCION: Editar reseña (convierte el comentario en textarea editable in-place)
    btn_editar.addEventListener('click', () => {
        const ya_editando = tarjeta.querySelector('.edit-textarea');
        if (ya_editando) return; // Evitar abrir varios editores en la misma tarjeta

        const texto_actual = comentario.textContent;
        const editor = document.createElement('textarea');
        editor.className = 'edit-textarea w-full p-2 text-sm border border-gray-300 focus:outline-none focus:border-gray-900 resize-none mt-1';
        editor.rows = 3;
        editor.value = texto_actual; // value para textarea (no textContent)

        const btn_guardar = document.createElement('button');
        btn_guardar.className = 'mt-2 px-4 py-1.5 bg-gray-900 text-white text-xs font-medium tracking-wide hover:bg-gray-700 transition-colors';
        btn_guardar.textContent = 'Guardar';

        const btn_cancelar = document.createElement('button');
        btn_cancelar.className = 'mt-2 ml-2 px-4 py-1.5 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-900 transition-colors';
        btn_cancelar.textContent = 'Cancelar';

        // Ocultar comentario original y mostrar editor
        comentario.classList.add('hidden');
        tarjeta.appendChild(editor);
        tarjeta.appendChild(btn_guardar);
        tarjeta.appendChild(btn_cancelar);
        editor.focus();

        // Cancelar edición: restaurar estado original
        btn_cancelar.addEventListener('click', () => {
            comentario.classList.remove('hidden');
            editor.remove();
            btn_guardar.remove();
            btn_cancelar.remove();
        });

        // Guardar cambios en localStorage y actualizar el DOM
        btn_guardar.addEventListener('click', () => {
            const nuevo_texto = editor.value.trim();
            if (!nuevo_texto) return;

            let resenias = [];
            try {
                resenias = JSON.parse(localStorage.getItem('resenias')) ?? [];
                const idx = resenias.findIndex(r => r.id === resena.id);
                if (idx !== -1) {
                    resenias[idx].comentario = nuevo_texto; // Actualizar solo el comentario
                    localStorage.setItem('resenias', JSON.stringify(resenias));
                }
            } catch (error) {
                console.error("Error al guardar edición:", error.message);
                return;
            }

            comentario.textContent = nuevo_texto; // textContent para prevenir XSS
            comentario.classList.remove('hidden');
            editor.remove();
            btn_guardar.remove();
            btn_cancelar.remove();
        });
    });

    acciones.appendChild(btn_editar);
    acciones.appendChild(btn_eliminar);
    cabecera.appendChild(info);
    cabecera.appendChild(acciones);

    // Comentario
    const comentario = document.createElement('p');
    comentario.className = 'text-gray-600 text-sm leading-relaxed';
    comentario.textContent = resena.comentario; // textContent para prevenir XSS

    tarjeta.appendChild(cabecera);
    tarjeta.appendChild(comentario);

    return tarjeta;
}

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

    // Insertar la nueva reseña al principio del historial (más reciente primero), sin limpiar todo
    const tarjeta = crearTarjetaResena(resena, resenias.length - 1);
    historial_resenias.insertBefore(tarjeta, historial_resenias.firstChild);

    text_resenias.value = '';
});

// CONECTAR DATOS CON HTML

function mostrarSesion() {
    // Si el usuario viene de la URL se muestra tal cual; si no, se usa el apodo por defecto ("Cliente VIP")
    document.querySelector('.user-name').textContent = user !== 'anonimo' ? user : apodo;
    document.querySelector('.user-id').textContent = id_cliente_formateado;
    document.querySelector('.role').textContent = role;
    // La membresía usa ?? por lo que si era undefined queda como "Basica"
    document.querySelector('.membresia').textContent = membresia;
    document.querySelector('.fecha_actual').textContent = date;
    document.querySelector('.idioma_navegador').textContent = lang;
}

function renderizarProductos() {
    const productosDiv = document.querySelector('.productos');
    // Usamos innerHTML aquí solo para el esqueleto estático de los productos
    // Los valores dinámicos de precio se inyectan via textContent desde actualizarCarrito
    productosDiv.innerHTML = `
        <div class="product-card border border-gray-100 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
            <div class="h-56 overflow-hidden bg-gray-50">
                <img src="../assets/images/chaqueta negra.jfif" alt="Chaqueta negra" class="w-full h-full object-cover">
            </div>
            <div class="p-5">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-1">Outerwear</p>
                <h3 class="text-base font-semibold text-gray-900">Chaqueta Negra</h3>
                <p class="product-precio-chaqueta text-2xl font-bold mt-2 mb-4"></p>
                <button class="btn-add-chaqueta w-full py-2 text-xs font-medium tracking-widest uppercase border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                    Añadir al carrito
                </button>
            </div>
        </div>
        <div class="product-card border border-gray-100 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
            <div class="h-56 overflow-hidden bg-gray-50">
                <img src="../assets/images/camiseta_miles_morales.jfif" alt="Camiseta Miles Morales" class="w-full h-full object-cover">
            </div>
            <div class="p-5">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-1">Tops</p>
                <h3 class="text-base font-semibold text-gray-900">Camiseta Miles Morales</h3>
                <p class="product-precio-camiseta text-2xl font-bold mt-2 mb-4"></p>
                <button class="btn-add-camiseta w-full py-2 text-xs font-medium tracking-widest uppercase border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                    Añadir al carrito
                </button>
            </div>
        </div>
        <div class="product-card border border-gray-100 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
            <div class="h-56 overflow-hidden bg-gray-50">
                <img src="../assets/images/miles morales air_jordan.jfif" alt="Miles Morales Air Jordan" class="w-full h-full object-cover">
            </div>
            <div class="p-5">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-1">Footwear</p>
                <h3 class="text-base font-semibold text-gray-900">Miles Morales Air Jordan</h3>
                <p class="product-precio-air-jordan text-2xl font-bold mt-2 mb-4"></p>
                <button class="btn-add-air-jordan w-full py-2 text-xs font-medium tracking-widest uppercase border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                    Añadir al carrito
                </button>
            </div>
        </div>
        <div class="product-card border border-gray-100 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200">
            <div class="h-56 overflow-hidden bg-gray-50">
                <img src="../assets/images/Real Madrid 2026-27 camiseta.jfif" alt="Camiseta Real Madrid 2026-27" class="w-full h-full object-cover">
            </div>
            <div class="p-5">
                <p class="text-xs uppercase tracking-widest text-gray-400 mb-1">Sportswear</p>
                <h3 class="text-base font-semibold text-gray-900">Camiseta Real Madrid 26/27</h3>
                <p class="product-precio-real-madrid text-2xl font-bold mt-2 mb-4"></p>
                <button class="btn-add-real-madrid w-full py-2 text-xs font-medium tracking-widest uppercase border border-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                    Añadir al carrito
                </button>
            </div>
        </div>
    `;

    // Inyectar precios via textContent (nunca innerHTML para datos dinámicos)
    document.querySelector('.product-precio-chaqueta').textContent   = formatter_EUR.format(precio_float_chaqueta);
    document.querySelector('.product-precio-camiseta').textContent   = formatter_EUR.format(precio_float_camiseta);
    document.querySelector('.product-precio-air-jordan').textContent = formatter_EUR.format(precio_float_air_jordan);
    document.querySelector('.product-precio-real-madrid').textContent = formatter_EUR.format(precio_float_real_madrid);

    // Listeners de "añadir al carrito" para cada producto
    document.querySelector('.btn-add-chaqueta').addEventListener('click', () => {
        carrito_chaqueta++; // Incrementar unidades de chaqueta
        actualizarCarrito();
    });
    document.querySelector('.btn-add-camiseta').addEventListener('click', () => {
        carrito_camiseta++; // Incrementar unidades de camiseta
        actualizarCarrito();
    });
    document.querySelector('.btn-add-air-jordan').addEventListener('click', () => {
        carrito_air_jordan++; // Incrementar unidades de air jordan
        actualizarCarrito();
    });
    document.querySelector('.btn-add-real-madrid').addEventListener('click', () => {
        carrito_real_madrid++; // Incrementar unidades de camiseta real madrid
        actualizarCarrito();
    });
}

function actualizarCarrito() {
    // Calcular el subtotal dinamicamente segun unidades en el carrito
    const subtotal_dinamico =
        (precio_float_chaqueta   * carrito_chaqueta)   +
        (precio_float_camiseta   * carrito_camiseta)   +
        (precio_float_air_jordan * carrito_air_jordan) +
        (precio_float_real_madrid * carrito_real_madrid);

    const hay_productos = carrito_chaqueta > 0 || carrito_camiseta > 0 || carrito_air_jordan > 0 || carrito_real_madrid > 0;

    // Logica de descuento de ecommerce escalonado por volumen:
    // Si el cupon esta activo y hay productos en el carrito:
    // - Para compras mayores o iguales a 500 €, descuento del 15% (paga el 0.85 del importe)
    // - Para compras entre 300 € y 499.99 €, descuento del 12%
    // - Para compras entre 150 € y 299.99 €, descuento del 10%
    // - Para compras entre 50 € y 149.99 €, descuento del 8%
    // - Para compras menores a 50 €, descuento del 5%
    let porcentaje_descuento = 0;
    let descuento_aplicado = 0;

    // Solo se calcula y muestra el descuento si el cupon esta activo Y hay productos anadidos
    if (cupon_activo && hay_productos && subtotal_dinamico > 0) {
        if (subtotal_dinamico >= 500) {
            porcentaje_descuento = 0.15; // 15% de descuento (factor 0.85)
        } else if (subtotal_dinamico >= 300) {
            porcentaje_descuento = 0.12; // 12% de descuento
        } else if (subtotal_dinamico >= 150) {
            porcentaje_descuento = 0.10; // 10% de descuento
        } else if (subtotal_dinamico >= 50) {
            porcentaje_descuento = 0.08; // 8% de descuento
        } else {
            porcentaje_descuento = 0.05; // 5% de descuento
        }
        descuento_aplicado = subtotal_dinamico * porcentaje_descuento;
    }

    const base = subtotal_dinamico - descuento_aplicado; // Base imponible real (nunca negativa)
    const iva_calculado = base > 0 ? base * iva : 0;    // IVA sobre la base (nunca negativo)
    const total_calculado = base + iva_calculado;

    // Renderizar lista de items del carrito
    const items_div = document.querySelector('.items-carrito');
    items_div.innerHTML = ''; // Limpiar antes de re-renderizar

    if (!hay_productos) {
        const vacio = document.createElement('p');
        vacio.className = 'text-xs text-gray-300 py-2';
        vacio.textContent = 'Tu carrito está vacío.'; // textContent para prevenir XSS
        items_div.appendChild(vacio);
    }

    // Definir los items a renderizar como array para evitar repeticion de codigo
    const items_carrito = [
        { nombre: 'Chaqueta Negra',              qty: carrito_chaqueta,    precio: precio_float_chaqueta   },
        { nombre: 'Camiseta Miles Morales',       qty: carrito_camiseta,    precio: precio_float_camiseta   },
        { nombre: 'Miles Morales Air Jordan',     qty: carrito_air_jordan,  precio: precio_float_air_jordan  },
        { nombre: 'Camiseta Real Madrid 26/27',   qty: carrito_real_madrid, precio: precio_float_real_madrid },
    ];

    items_carrito.forEach(({ nombre, qty, precio }) => {
        if (qty === 0) return; // Omitir productos sin unidades
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center text-sm py-1';
        const span_nombre = document.createElement('span');
        span_nombre.className = 'text-gray-600';
        span_nombre.textContent = `${nombre} ×${qty}`; // textContent para prevenir XSS
        const span_precio = document.createElement('span');
        span_precio.className = 'font-medium text-gray-900';
        span_precio.textContent = formatter_EUR.format(precio * qty); // textContent para prevenir XSS
        item.appendChild(span_nombre);
        item.appendChild(span_precio);
        items_div.appendChild(item);
    });

    // Actualizar el desglose financiero via textContent
    document.querySelector('.subtotal').textContent = formatter_EUR.format(subtotal_dinamico);
    document.querySelector('.descuentos').textContent = descuento_aplicado > 0
        ? `- ${formatter_EUR.format(descuento_aplicado)} (${Math.round(porcentaje_descuento * 100)}%)`
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
    resenias_orden_nuevo.forEach((resena, i) => {
        const tarjeta = crearTarjetaResena(resena, i);
        historial_resenias.appendChild(tarjeta);
    });
}

mostrarSesion();
renderizarProductos();
actualizarCarrito();
cargarResenasExistentes();