# El enlace del día · seminario 20941

Esta carpeta es a donde apuntan **todos** los QR del deck. Un solo destino: el
alumno escanea una vez, deja la pestaña abierta, y elige de la lista el
formulario que toca.

- `index.html` · el hub y los diez formularios, en una sola página
- `form.js` · el `ENDPOINT` y la definición de los diez formularios
- `APPS_SCRIPT.gs` · el backend, para pegar en Apps Script

## Puesta en marcha, una vez

1. Crea una hoja de cálculo nueva en Drive. **Extensiones > Apps Script**.
2. Pega `APPS_SCRIPT.gs` encima de lo que haya. Guarda.
3. Ejecuta a mano la función `setUp`. Acepta los permisos. Debe crear once
   pestañas, una por slot, con sus cabeceras.
4. **Implementar > Nueva implementación > Aplicación web.** Ejecutar como *yo*,
   acceso **cualquier persona**. Copia la URL que acaba en `/exec`.
5. Pega esa URL en `ENDPOINT`, en **los dos** archivos:
   - `f/form.js`
   - `deck_friday.html`

   Si no son idénticas, el alumno escribe en un sitio y la slide lee de otro.

## El contrato con el deck

El deck busca las columnas **por nombre y en minúsculas**. Renombrar un campo
sin tocar los tres archivos deja la slide en blanco, y sin ningún aviso.

| Slot | Columnas | Lo lee |
|---|---|---|
| `q1-fin`, `q1-afm` | `company1` `company2` `company3` `timing` | mapa de calor y TIP 3a |
| `q2` | `stopped` `word` | la nube |
| `q3` | `names` `idea` `conflict` | la cosecha de TIP 2 |
| `q4` | `number` `against` | el gráfico horrible |
| `q5` | `version` `why` | A o B |
| `q6` | `sentence` | TIP 4 |
| `q7` | `pause_self` `pause_other` `eyes_self` `eyes_other` | la asimetría |
| `q8` | `group` `awk_pred` `ok_pred` `depth_real` `depth_want` | No Small Talk, antes |
| `q9` | `awk_real` `ok_real` `remember` `almost` | No Small Talk, después |
| `q10` | `commit` | el cierre |

Tres detalles que parecen manías y no lo son:

- **`timing` va última en `q1`.** El deck lee la última columna de esa fila para
  el histograma de los 24 días. Si metes una columna detrás, lee la equivocada.
- **La hora se guarda pero no se devuelve.** El GET la salta a propósito: la
  slide del mapa de calor cuenta todas las celdas como nombres de empresa, y una
  fecha aparecería en pantalla como si alguien quisiera trabajar en «2026-09-11».
- **Los rangos de tiempo llevan «week», «month» o «year» a propósito.** Es lo que
  hace que el recuento de empresas los ignore. Si los reescribes como «2-4 sem»,
  empiezan a contarse como empresas.

## Antes del viernes, y de verdad

1. Abre `f/` en el móvil. Elige clase. Manda los diez formularios con datos de
   prueba, dos o tres veces cada uno.
2. Abre el deck con `?teach` y recorre las slides de datos. Cada una debe
   encender el indicador verde **en vivo** abajo a la derecha.
3. Vacía las hojas con `wipeAll` antes de la clase de verdad.
4. Y otra vez lo mismo **entre FIN y AFM**: `q1` se separa por clase, pero de
   `q2` a `q10` comparten hoja. Si no vacías, AFM ve las respuestas de FIN.

El panel D del deck sigue siendo el plan B: si el endpoint no responde, se pega
a mano y la clase sigue.
