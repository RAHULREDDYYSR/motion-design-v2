// Localize generated workflow output; leave the vendored plugin unchanged.
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const project=path.join(root,'videos/fibonacci-nature');
for(const f of ['index.html','compositions/captions.html']){
 const p=path.join(project,f);let h=readFileSync(p,'utf8');
 h=h.replace(/<script\s+src="https:\/\/cdn\.jsdelivr\.net\/npm\/gsap[^>]*><\/script>/g,'<script src="assets/gsap.min.js"></script>');
 if(f==='index.html')h=h.replace('</head>',`<style>${readFileSync(path.join(project,'assets/fonts.css'),'utf8')}</style></head>`).replace('id="el-captions"','id="el-captions" data-track-kind="captions"');
 // Font matching is guaranteed by the host stylesheet; suppress fallback network imports.
 h=h.replace(/@import\s+url\([^)]*\);/g,'');
 // Preset's faint upcoming text fails small-text contrast. Keep all words readable.
 if(f.includes('captions'))h=h.replace('</template>','<style>.caption-word{color:#1a1a17}.caption-word.is-active{background:#e89cb1;color:#1a1a17;box-shadow:none}.caption-pill{border-color:#2e4a2a}.caption-stage{top:1570px;height:180px}</style></template>');
 writeFileSync(p,h);
}
console.log('Localized GSAP/fonts and set accessible caption contrast.');
