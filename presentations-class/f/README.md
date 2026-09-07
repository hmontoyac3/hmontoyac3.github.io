# El enlace del día · seminario 20941

A donde apuntan **todos** los QR del deck. Un solo destino: el alumno escanea una
vez, deja la pestaña abierta, y elige de la lista el formulario que toca.

- `index.html` · el hub y los diez formularios, en una sola página
- `form.js` · el `ENDPOINT` y la definición de los diez formularios
- `APPS_SCRIPT_ADD_DOPOST.gs` · lo único que falta en el backend

## Estado, a 7 de septiembre de 2026

| Pieza | Estado |
|---|---|
| El hub y los diez formularios | **Funcionando**, servido en `/presentations-class/f/` |
| Lectura del endpoint, `GET ?slot=` | **Funcionando.** Comprobados los once slots |
| Escritura, `POST` | **NO existe.** Es lo que falta |

El Web App que ya tienes desplegado solo implementa `doGet`. Un POST devuelve la
página de Google y no añade ninguna fila, así que **hoy los formularios no pueden
entregar nada**. Los datos que hay en las pestañas se metieron a mano.

Para arreglarlo: pegar `APPS_SCRIPT_ADD_DOPOST.gs` al final de tu proyecto de
Apps Script y volver a implementar **editando la implementación existente**, que
así la URL no cambia. Las instrucciones están dentro del archivo. No borra ni
toca tu `doGet`.

## El contrato

Estas son las cabeceras **reales** de las pestañas, leídas una a una del endpoint,
no supuestas. El deck las busca **por nombre y en minúsculas**: renombrar una
columna sin tocar el deck deja la slide en blanco sin ningún aviso.

| Slot | Columnas | Quién lo lee en el deck |
|---|---|---|
| `q1-fin`, `q1-afm` | `companies` `timing` | el mapa de calor y TIP 3a |
| `q2` | `what` `word` | la nube |
| `q3` | `names` `idea` `conflict` | la cosecha de TIP 2 |
| `q4` | `number` `against` | el gráfico horrible |
| `q5` | `version` `why` | A o B |
| `q6` | `sentence` | TIP 4 |
| `q7` | `pause_self` `pause_other` `eyes_self` `eyes_other` | la asimetría |
| `q8` | `group` `awk_pred` `ok_pred` `depth_real` `depth_want` | No Small Talk, antes |
| `q9` | `awk_real` `ok_real` `remember` `held_back` | No Small Talk, después |
| `q10` | `commit` | el cierre |

Cuatro detalles que parecen manías y no lo son:

- **`companies` es UNA columna, no tres.** El formulario 1 tiene tres casillas por
  comodidad, pero las junta con punto y coma antes de mandarlas. El deck parte la
  celda por `,`, `;` o `|` para contar los votos.
- **`timing` va la última en `q1`.** El deck lee la última columna de la fila para
  el histograma de los 24 días. Si añades una columna detrás, lee la equivocada.
- **No hay columna de hora, y mejor así.** El recuento del mapa de calor cuenta
  todas las celdas como nombres de empresa, y una fecha saldría en pantalla como
  si alguien quisiera trabajar en «2026-09-11».
- **Los rangos de tiempo dicen «week», «month» y «year» a propósito.** Es lo que
  hace que el recuento de empresas los ignore. Reescritos como «2-4 sem»
  empezarían a contarse como si fueran empresas.

## `q1-afm` está sin cabecera

Nunca ha recibido nada. La función `ensureSheets` del archivo `.gs` la crea. Si no
se crea, la clase de AFM proyecta un mapa de calor vacío toda la tarde.

## Antes del viernes, y de verdad

1. Pegar el `doPost` y volver a implementar.
2. Abrir `f/` en el móvil, elegir clase, y mandar los diez formularios con datos
   de prueba dos o tres veces cada uno.
3. Abrir el deck con `?teach` y recorrer las slides de datos. Cada una tiene que
   encender el indicador verde `● en vivo` abajo a la derecha.
4. Ejecutar `wipeSlots` antes de la clase de verdad, para borrar las pruebas.
5. **Y otra vez entre FIN y AFM.** `q1` se separa por clase, pero de `q2` a `q10`
   comparten pestaña: si no se vacía, AFM ve las respuestas de FIN.

El panel D del deck sigue siendo el plan B: si el endpoint no responde, se pega a
mano y la clase sigue.
