mkdir -p dist/lib/cjs
cp -R ./src/lib/* ./dist/lib/cjs
cd ./dist/lib/cjs
echo -----------
pwd
echo -----------
ls
echo -----------
npx tsc --project ./ --module commonjs