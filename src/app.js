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
let oferta_activa = false
btn_oferta.addEventListener('click', () => {
    if (oferta_activa) return; // prevenir multiples clics
    oferta_activa = true;
    
    intervalo = setInterval(() => {
        contador--;
        span_contador.textContent = `Contador: ${contador}`;
        
        if (contador === 0) {
            clearInterval(intervalo);
            oferta_activa = false; // reset para futuras promociones
            span_contador.textContent = 'La oferta relampago ha expirado'; // notificar que expiro
        }
    }, 1000);
});

// BLOQUE 4: CREACION Y PUBLICACION DE RESEÑAS

btn_subir_resenia.addEventListener('click', () => {
    const textarea_valor = text_resenias.value;
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
    
    // Limpiar el contenedor antes de renderizar para evitar duplicados
    historial_resenias.innerHTML = '';
    
    resenias.forEach(resena => {
        const div_historia_resenias = document.createElement('article');
        div_historia_resenias.className = 'rounded-2xl border border-[#dedbd4] bg-white p-6 shadow-sm';
        
        const header_flex = document.createElement('div');
        header_flex.className = 'flex items-start justify-between gap-4';
        
        const user_info_flex = document.createElement('div');
        user_info_flex.className = 'flex items-center gap-4';
        
        const avatar = document.createElement('div');
        avatar.className = 'flex size-11 items-center justify-center rounded-full bg-[#e6d8cf] text-[11px] font-bold text-[#8a5938] uppercase flex-shrink-0';
        avatar.textContent = resena.usuario.substring(0, 2);
        
        const text_container = document.createElement('div');
        
        const titulo = document.createElement('h3');
        titulo.className = 'text-[14px] font-bold text-[#252321]';
        titulo.textContent = resena.usuario;
        
        const hora = document.createElement('p');
        hora.className = 'mt-1 flex items-center gap-1.5 text-[11px] text-[#99948b]';
        hora.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${resena.hora}`;
        
        const stars = document.createElement('div');
        stars.className = 'flex gap-1 text-[#a86b42]';
        stars.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'.repeat(5);
        
        text_container.appendChild(titulo);
        text_container.appendChild(hora);
        user_info_flex.appendChild(avatar);
        user_info_flex.appendChild(text_container);
        header_flex.appendChild(user_info_flex);
        header_flex.appendChild(stars);
        
        const comentario = document.createElement('p');
        comentario.className = 'mt-5 text-[14px] leading-relaxed text-[#666159]';
        comentario.textContent = resena.comentario;
        
        div_historia_resenias.appendChild(header_flex);
        div_historia_resenias.appendChild(comentario);
        
        historial_resenias.appendChild(div_historia_resenias);
    });
    text_resenias.value = '';
});

// BLOQUE 5: INICIALIZACIÓN DEL DOM (Conexión de datos)
document.addEventListener('DOMContentLoaded', () => {
    // Info de sesión
    document.querySelector('.user-name').textContent = user === 'anonimo' ? apodo : user;
    document.querySelector('.user-id').textContent = `ID ${id_cliente_formateado} · Customer`;
    document.querySelector('.fecha_actual').textContent = date;
    document.querySelector('.idioma_navegador').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        ${lang}
    `;

    // Totales del carrito
    document.querySelector('.subtotal').textContent = subtotal_formateado;
    document.querySelector('.descuentos').textContent = `- ${cupon_formateado}`;
    document.querySelector('.iva').textContent = iva_total_formateado;
    document.querySelector('.total').textContent = total_pago_formateado;
});
