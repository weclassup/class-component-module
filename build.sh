rm -rf ./dist || true
echo Build CJS
sh ./build-cjs.sh
echo Build ESM
sh ./build-esm.sh
mv ./dist/lib/ ./
cd lib
echo "---------remove *.ts|tsx except *.d.ts---------"
ls
find ./ -type f \( -name '*[^.d].ts' -o -name '*.tsx' \) -delete
# find ./ -type f -name '*[^.d].ts' -o -name '*.tsx'
