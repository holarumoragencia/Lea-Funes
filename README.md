# Animaciones · Leandro Funes (LinkedIn)

Videos animados para los posteos de LinkedIn de Leandro Funes, hechos con [Remotion](https://www.remotion.dev/) (videos programados en React).

## Video actual

**`out/franquicia-aef-2026.mp4`**: reacción al informe «La Franquicia en España 2026» de la AEF. Formato horizontal, 1920×1080, 15 s, 30 fps.

| Tiempo | Escena |
|---|---|
| 0–3 s | Titular: «La franquicia en España se consolida» |
| 3–8,5 s | Datos de cierre de 2025: facturación +3 %, empleo +1,4 %, número de redes −6,5 %, establecimientos −1 % |
| 8,5–12,5 s | «No es crisis. Es madurez.»: los 3 motivos y «menos locales, más rentables» |
| 12,5–15 s | Cierre: «Ganan las redes con modelo probado.» |

Estética: modo noche (#0C0C0E), rosa estilo Lovable (#FF3D8F) con degradé hasta crema (#F6E7D6), tipografía Inter Tight / Inter.

## Uso

```bash
npm install
npm run studio   # editor visual en el navegador, con vista previa en vivo
npm run render   # exporta out/franquicia-aef-2026.mp4
```

Los textos, las cifras y los colores están en `src/FranquiciaAEF.tsx` (la paleta está en la constante `C`).
