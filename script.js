const SUPABASE_URL = 'https://qvhffjyegpnzwkvhnluq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OTZDadqew4q4FCjQvabLqw_T--s4doZ';

//? Encabezados obligatorios para que Supabase te dé permiso y entienda el formato
const encabezado = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation' // Le pide a Supabase que devuelva los datos tras actualizar
};

async function obtenerInfo() {
    //? Obtiene la informacion necesaria como los datos de supabase y los retorna
    var respuesta = await fetch(`${SUPABASE_URL}/rest/v1/inventario?id=eq.1`, {headers : encabezado}) 
    var datos = await respuesta.json();
    return datos[0].datos
    
}

async function mas(evento) {
    //? Funcion que suma 1 a la cantidad total

    var datos = await obtenerInfo();

    var quien_presiono = evento.target.className;
    ////console.log(`Sumando 1 a ${quien_presiono}, ${typeof quien_presiono}`);
    ////console.log(`Datos : ${datos.Helados_Vaso[quien_presiono]}`);
    datos.Helados_Vaso[quien_presiono] += 1;
    ////console.log(`Datos : ${datos.Helados_Vaso[quien_presiono]}`);

    var actualizar = await fetch(`${SUPABASE_URL}/rest/v1/inventario?id=eq.1`,
        {
            method:'PATCH',
            headers:encabezado,
            body:JSON.stringify({datos})
        });

    console.log(`Actualizado : [Helado : ${quien_presiono}] [Cantidad : ${datos.Helados_Vaso[quien_presiono]}]`);

}

async function menos(evento) {
    //? Funcion que resta 1 a la cantidad total

    var datos = await obtenerInfo();

    var quien_presiono = evento.target.className;
    datos.Helados_Vaso[quien_presiono] -= 1;

    var actualizar = await fetch(`${SUPABASE_URL}/rest/v1/inventario?id=eq.1`,
        {
            method:'PATCH',
            headers:encabezado,
            body:JSON.stringify({datos})
        });

    console.log(`Actualizado : [Helado : ${quien_presiono}] [Cantidad : ${datos.Helados_Vaso[quien_presiono]}]`);

}

async function enviar(evento) {
    //? Funcion que envia establece la cantidad total

    var datos = await obtenerInfo();

    var quien_presiono = evento.target.className;
    var cuanto = await document.getElementById(`Cc_${quien_presiono.slice(2)}`)
    
    datos.Helados_Vaso[quien_presiono] = cuanto.value;

    var actualizar = await fetch(`${SUPABASE_URL}/rest/v1/inventario?id=eq.1`,
        {
            method:'PATCH',
            headers:encabezado,
            body:JSON.stringify({datos})
        });

    console.log(`Actualizado : [Helado : ${quien_presiono}] [Cantidad : ${datos.Helados_Vaso[quien_presiono]}]`);
    
    location.reload();

}

async function main() {
    
    function varHelados() {
       for(helado in datos.Helados_Vaso){
        if (helado.slice(0,2) == 'H_'){
            vasos[helado.slice(2)] = datos.Helados_Vaso[helado];
            }
        }

        for(helado in datos.Helados_Cono){
            if (helado.slice(0,2) == 'C_'){
                conos[helado.slice(2)] = datos.Helados_Cono[helado];
            }
        }

    }   

    async function CargarDatos() {
        var respuesta = await fetch('./db/quant.json');
        var datos = await respuesta.json()

        return datos

    }

    var cuerpo = document.getElementById('cuerpo');
    var datos = await obtenerInfo();

    var vasos = {};
    var conos = {};

    varHelados();
    var vasos_c = document.getElementById('vasos_c')

    for(helados in vasos){
        vasos_c.innerHTML += `
        <div class="cl_${helados}">
        <img src="./images/${helados}.png" id="I_H_${helados}">
            <h2 id="t_${helados}">Hay : x${vasos[helados]}</h2>
            <h2 id="t_${helados}">${helados}</h2>
        </img>

        <button type="submit" onclick="mas(event);" class="H_${helados}" id="B_mas">+</button>
        <button type="submit" onclick="menos(event);" class="H_${helados}" id="B_menos">-</button>
        <input class="Cc_cantidad" id="Cc_${helados}" type="text" value=${vasos[helados]}></input>
        <button onclick="enviar(event);" type="submit" class="H_${helados}" id="B_enviar">-></button>
        </div>
        `

    }

}

main()