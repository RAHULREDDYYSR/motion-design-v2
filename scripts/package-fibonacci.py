"""Archive an explicit allowlist of editable sources; omit credentials/caches."""
from pathlib import Path
import zipfile
import stat
import os

root=Path(__file__).resolve().parent.parent
destination=root/'output/fibonacci-source.zip'
items=['README.md','AGENTS.md','package.json','package-lock.json','.npmrc',
       '.gitignore','.env.example','skills-lock.json','.codex/config.toml',
       '.agents','scripts','tests','docs','plugins','rive','video',
       'videos/fibonacci-nature']
blocked={'.git','node_modules','work','output','__pycache__','.hyperframes',
         '.aws','.venv','.tools'}
written=set()
def add(z,p):
    relative=p.relative_to(root)
    if any(part in blocked for part in relative.parts):return
    if p.name.startswith('.env') and p.name!='.env.example':return
    name=str(Path('motion-design-v2')/relative)
    if name in written:return
    written.add(name)
    if p.is_symlink():
        info=zipfile.ZipInfo(name)
        info.create_system=3
        info.external_attr=(stat.S_IFLNK|0o777)<<16
        z.writestr(info,os.readlink(p))
    elif p.is_dir():
        for child in sorted(p.iterdir()):add(z,child)
    elif p.is_file():z.write(p,name)
with zipfile.ZipFile(destination,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for item in items:
        p=root/item
        if p.exists():add(z,p)
with zipfile.ZipFile(destination) as z:
    assert z.testzip() is None
    assert not any(Path(n).name=='.env' for n in z.namelist())
print(f'Source archive: {destination.name}; {destination.stat().st_size:,} bytes; ZIP integrity passed.')
