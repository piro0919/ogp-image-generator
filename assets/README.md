# assets

The face drawn into the Open Graph card (`src/app/[locale]/opengraph-image.tsx`).

Noto Sans JP is the same face the site uses, and it covers both the Latin and
the Japanese copy, so the card needs no fallback. It is cut down to the
characters the card actually shows.

Any character missing from it silently falls back to a different face, so when
the card's copy changes, rebuild the subsets:

```sh
curl -sL -o /tmp/NotoSansJP.ttf \
  "https://github.com/google/fonts/raw/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf"

# Noto Sans JP ships as a variable font. satori wants a fixed weight, so pin it first.
python3 - <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
for wght, out in [(400, "/tmp/NotoSansJP-400.ttf"), (700, "/tmp/NotoSansJP-700.ttf")]:
    f = TTFont("/tmp/NotoSansJP.ttf")
    instancer.instantiateVariableFont(f, {"wght": wght}, inplace=True)
    f.save(out)
PY

TEXT="OGP Image Generator Make social preview images in your browser. kkweb.io OGP画像もアイコンもブラウザだけで作る"
UNI="U+0020-007E,U+00A0-00FF,U+2010-2027,U+3000-303F,U+30FB"

pyftsubset /tmp/NotoSansJP-400.ttf --text="$TEXT" --unicodes="$UNI" \
  --output-file=assets/NotoSansJP-Regular-subset.ttf --no-hinting --desubroutinize --layout-features=''
pyftsubset /tmp/NotoSansJP-700.ttf --text="$TEXT" --unicodes="$UNI" \
  --output-file=assets/NotoSansJP-Bold-subset.ttf --no-hinting --desubroutinize --layout-features=''
```
