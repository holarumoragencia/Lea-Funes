# Animaciones · Leandro Funes (LinkedIn)

Videos animados para los posteos de LinkedIn de Leandro Funes, hechos con [Remotion](https://www.remotion.dev/) (videos programados en React). Todos son horizontales, 1920×1080, de 15 s a 30 fps.

## Videos

### `out/franquicia-reactivacion-2027.mp4`
Reacción al análisis de Tormo Franquicias Consulting sobre el último cuatrimestre de 2026.

| Tiempo | Escena |
|---|---|
| 0–3 s | Titular: «Septiembre y octubre reactivan la franquicia» |
| 3–8,5 s | El sector hoy: 1.328 enseñas, 92.129 establecimientos, 426.897 empleos, 38.591 M€ de facturación |
| 8,5–12,5 s | +9,3 % de unidades en el último ejercicio |
| 12,5–15 s | Cierre: «Las aperturas de 2027 se construyen hoy.» |

### `out/franquicia-aef-2026.mp4`
Reacción al informe «La Franquicia en España 2026» de la AEF (facturación +3 %, empleo +1,4 %, redes −6,5 %, establecimientos −1 %).

## Estética

Modo noche (#0C0C0E), rosa estilo Lovable (#FF3D8F) con degradé hasta crema (#F6E7D6), tipografías Inter Tight e Inter. La cabecera de perfil va arriba a la izquierda.

## Uso

```bash
npm install
npm run studio       # editor visual en el navegador, con vista previa en vivo
npm run render       # exporta el video de Tormo (reactivación 2027)
npm run render:aef   # exporta el video de la AEF
```

## Estructura

- `src/shared.tsx`: piezas comunes (paleta, fondo animado, cabecera de perfil, animaciones de entrada y barra de progreso).
- `src/FranquiciaReactivacion.tsx` y `src/FranquiciaAEF.tsx`: un archivo por video, con sus textos y cifras.
- `src/Root.tsx`: registra los videos.

Para hacer un video nuevo, copia uno de los archivos de video, cambia textos y cifras y regístralo en `src/Root.tsx`.
