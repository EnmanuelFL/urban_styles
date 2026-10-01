// BLOQUE 1

'use strict';
const params =  new URLSearchParams(window.location.search);
const user = params.get('user')  ?? 'anonimo';
const role = params.get('role')  ?? 'invitado';
const lang = navigator.language;
const id = crypto.randomUUID();
const email = " enmanuellemos.f@gmail.com ";
const id_cliente = "42";

const btn_oferta = document.querySelector('.oferta_relampago');
const span_contador = document.querySelector('.contador_oferta');
const historial_resenias = document.querySelector('.historial_resenias');
const text_resenias = document.querySelector('.text_resenias');
const btn_subir_resenia = document.querySelector('.anyadir_resenia');

const date = new Date().toLocaleDateString("es-ES",{
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

const estado_conexion = navigator.onLine ? 'Conectado' : 'Desconectado';
const email_limpio = email.trim().toLowerCase();
let id_cliente_formateado = id_cliente.padStart(6, "0");
const partes_email = email_limpio.split("@");
const usuario_email = partes_email[0]; 
const dominio_email = partes_email[1];

let apodo = "";       
let membresia = undefined;
let saldo = null;      
apodo = apodo || "Cliente VIP";
membresia = membresia ?? "Basica";
saldo = saldo ?? 2;

// BLOQUE 2 - CATALOGO Y OPERACIONES FINANCIERAS

// Estado del carrito y productos
let precio_chaqueta = "129.99€"; // Ajustado al valor visual del diseño, aunque parsearemos
let precio_camiseta = "39.99€";
let precio_float_chaqueta = parseFloat(precio_chaqueta);
let precio_float_camiseta = parseFloat(precio_camiseta);

let qty_jacket = 1;
let qty_tshirt = 1;
const iva = 0.21;
let flash_sale_active = false;
let discount_applied = false;

// Variables de totales (globales por si se necesitan)
let subtotal = 0;
let base_imponible = 0;
let iva_total = 0;
let total_pago = 0;
let cupon_descuento = 0;

let numero_pedido = 0;
numero_pedido ++;

const formatter_EUR = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
});

function renderCart() {
    // Calculamos el subtotal de los productos seleccionados
    subtotal = (precio_float_chaqueta * qty_jacket) + (precio_float_camiseta * qty_tshirt);
    
    // Si la oferta flash fue activada (y no recargada)
    if (discount_applied) {
        cupon_descuento = subtotal * 0.15; // 15% de descuento
    } else {
        cupon_descuento = 0;
    }

    if (!isNaN(subtotal)) {
        base_imponible = subtotal - cupon_descuento;
        iva_total = base_imponible * iva;
        total_pago = base_imponible + iva_total;
    }

    // Actualizar DOM
    if(document.querySelector('.qty-jacket')) {
        document.querySelector('.qty-jacket').textContent = qty_jacket;
        document.querySelector('.item-total-jacket').textContent = formatter_EUR.format(precio_float_chaqueta * qty_jacket);
    }
    if(document.querySelector('.qty-tshirt')) {
        document.querySelector('.qty-tshirt').textContent = qty_tshirt;
        document.querySelector('.item-total-tshirt').textContent = formatter_EUR.format(precio_float_camiseta * qty_tshirt);
    }
    
    if(document.querySelector('.subtotal')) document.querySelector('.subtotal').textContent = formatter_EUR.format(subtotal);
    if(document.querySelector('.descuentos')) document.querySelector('.descuentos').textContent = cupon_descuento > 0 ? `- ${formatter_EUR.format(cupon_descuento)}` : '0,00 €';
    if(document.querySelector('.iva')) document.querySelector('.iva').textContent = formatter_EUR.format(iva_total);
    if(document.querySelector('.total')) document.querySelector('.total').textContent = formatter_EUR.format(total_pago);
}

// Botones de incremento/decremento
document.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    if (target.classList.contains('btn-plus-jacket')) { qty_jacket++; renderCart(); }
    if (target.classList.contains('btn-minus-jacket') && qty_jacket > 0) { qty_jacket--; renderCart(); }
    if (target.classList.contains('btn-plus-tshirt')) { qty_tshirt++; renderCart(); }
    if (target.classList.contains('btn-minus-tshirt') && qty_tshirt > 0) { qty_tshirt--; renderCart(); }
});

// BLOQUE 3: OFERTA RELAMPAGO Y TEMPORIZADOR

let contador = 15;
let intervalo = null;

// Verifica si la oferta ya se agotó en esta sesión/recarga
let oferta_agotada = false;

btn_oferta.addEventListener('click', () => {
    if (oferta_agotada) return; // Si ya se acabó el tiempo, no hacer nada.
    
    // Si ya está corriendo, se aplica el descuento
    if (intervalo !== null) {
        if (!discount_applied) {
            discount_applied = true;
            renderCart();
            btn_oferta.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Activado`;
        }
        return; 
    }
    
    // Iniciar temporizador
    intervalo = setInterval(() => {
        contador--;
        span_contador.textContent = contador;
        
        if (contador <= 0) {
            clearInterval(intervalo);
            oferta_agotada = true;
            span_contador.textContent = '0';
            document.querySelector('.oferta-container').innerHTML = '<span class="text-white/80 font-bold text-sm">Oferta expirada</span>'; // Elimina el botón
        }
    }, 1000);
});

// BLOQUE 4: CREACION Y PUBLICACION DE RESEÑAS

function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'hace un momento';
    if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `hace ${days} día${days > 1 ? 's' : ''}`;
    
    const d = new Date(timestamp);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function renderReviews() {
    let resenias = [];
    try {
        resenias = JSON.parse(localStorage.getItem('resenias')) ?? [];
    } catch (e) {
        resenias = [];
    }

    historial_resenias.innerHTML = '';
    
    // Mostrar reseñas por defecto si no hay ninguna
    if(resenias.length === 0) {
        resenias = [
            { id: Date.now() - 7200000, usuario: "Sofia M.", comentario: "La calidad es increíble y el ajuste es exactamente lo que estaba buscando." },
            { id: Date.now() - 86400000, usuario: "Daniel R.", comentario: "Entrega rápida, un empaquetado hermoso y la chaqueta se siente premium." }
        ];
    }

    resenias.forEach(resena => {
        const div = document.createElement('article');
        div.className = 'rounded-2xl border border-[#dedbd4] bg-white p-6 shadow-sm';
        
        const header = document.createElement('div');
        header.className = 'flex items-start justify-between gap-4';
        
        const user_info = document.createElement('div');
        user_info.className = 'flex items-center gap-4';
        
        const avatar = document.createElement('div');
        avatar.className = 'flex size-11 items-center justify-center rounded-full bg-[#e6d8cf] text-[11px] font-bold text-[#8a5938] uppercase flex-shrink-0';
        avatar.textContent = resena.usuario.substring(0, 2);
        
        const text_container = document.createElement('div');
        const titulo = document.createElement('h3');
        titulo.className = 'text-[14px] font-bold text-[#252321]';
        // Proteger contra XSS: textContent neutraliza etiquetas
        titulo.textContent = resena.usuario;
        
        const hora = document.createElement('p');
        hora.className = 'mt-1 flex items-center gap-1.5 text-[11px] text-[#99948b]';
        hora.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${formatTimeAgo(resena.id)}`;
        
        const stars = document.createElement('div');
        stars.className = 'flex gap-1 text-[#a86b42]';
        stars.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'.repeat(5);
        
        text_container.appendChild(titulo);
        text_container.appendChild(hora);
        user_info.appendChild(avatar);
        user_info.appendChild(text_container);
        header.appendChild(user_info);
        header.appendChild(stars);
        
        const comentario = document.createElement('p');
        comentario.className = 'mt-5 text-[14px] leading-relaxed text-[#666159]';
        comentario.textContent = resena.comentario;
        
        div.appendChild(header);
        div.appendChild(comentario);
        
        historial_resenias.appendChild(div);
    });
}

btn_subir_resenia.addEventListener('click', () => {
    const textarea_valor = text_resenias.value.trim();
    if(!textarea_valor) return;

    // Encontrar el usuario actual (desde params o por defecto)
    const nombreUsuario = user === 'anonimo' ? apodo : user;

    const resena = {
        id: Date.now(), // Marca de tiempo exacta
        usuario: nombreUsuario, 
        comentario: textarea_valor
    };
    
    let resenias = [];
    try {
        resenias = JSON.parse(localStorage.getItem('resenias')) ?? [];
        resenias.unshift(resena); // Añadir al principio
        localStorage.setItem('resenias', JSON.stringify(resenias));
    } catch (error) {
        console.error("Error al acceder a localStorage:", error.message);
        return false;
    }
    
    renderReviews();
    text_resenias.value = '';
});

// BLOQUE 5: INICIALIZACIÓN DEL DOM
document.addEventListener('DOMContentLoaded', () => {
    // Info de sesión
    if(document.querySelector('.user-name')) {
        document.querySelector('.user-name').textContent = user === 'anonimo' ? apodo : user;
        document.querySelector('.user-id').textContent = `ID ${id_cliente_formateado}`;
        document.querySelector('.fecha_actual').textContent = date;
    }
    
    if(document.querySelector('.idioma_navegador')) {
        document.querySelector('.idioma_navegador').innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            ${lang}
        `;
    }

    // Inicializar totales visuales
    renderCart();

    // Renderizar reseñas
    renderReviews();
});
