mkdir -p dist/lib/esm
cp -R ./src/lib/* ./dist/lib/esm
cd ./dist/lib/esm
echo -----------
pwd
echo -----------
ls
echo -----------
npx tsc --project ./