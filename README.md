# Animaciones · Leandro Funes (LinkedIn)

Videos animados para los posteos de LinkedIn de Leandro Funes, hechos con [Remotion](https://www.remotion.dev/) (videos programados en React). Los horizontales son de 1920×1080 y 15 s; el vertical es de 1080×1920 y 23,5 s, con música. Todos van a 30 fps.

## Videos

### `out/franquicia-mundo-2025.mp4` (vertical, fondo claro, con música)
Reacción al informe «La Franquicia Española en el Mundo 2025» (AEF, con ICEX y Cajamar). Plan de contenidos: id i04. Las escenas cambian en cada compás de la música (~117,5 BPM).

| Tiempo | Escena |
|---|---|
| 0–4 s | De 1.144 redes españolas, solo 314 salen fuera (rejilla de 1.144 puntos) |
| 4–8 s | 27,4 % opera en el exterior; +0,96 % en un año (311 → 314) |
| 8–12 s | Mapa: 139 países, 18.929 locales; Portugal 176, México 101, Andorra 95 |
| 12–16 s | Mapa de España: Cataluña lidera (106 de 320 centrales), Madrid 90 de 423 |
| 16–20 s | Aquí tu Reforma: catalana, en 9 países |
| 20–23,5 s | Cierre: «Salir fuera no es copiar y pegar la tienda. Seguimos.» |

Música: `public/audio/future-minimal.mp3`.

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
npm run render:mundo # exporta el vertical de la franquicia en el mundo
```

## Estructura

- `src/shared.tsx`: piezas comunes (paleta, fondo animado, cabecera de perfil, animaciones de entrada y barra de progreso).
- `src/FranquiciaReactivacion.tsx`, `src/FranquiciaAEF.tsx` y `src/FranquiciaMundo.tsx`: un archivo por video, con sus textos y cifras. El vertical tiene su propia paleta clara.
- `src/Root.tsx`: registra los videos.

Para hacer un video nuevo, copia uno de los archivos de video, cambia textos y cifras y regístralo en `src/Root.tsx`.
