#! /bin/bash
hulk ./src/views/*.mustache   > ./src/js/views.js
minify ./src/js/berryTables.js ./src/js/utils.js ./src/js/collection.js ./src/js/view.js ./src/js/views.js > ./bin/js/berryTables.min.js
cat ./src/js/berryTables.js ./src/js/utils.js ./src/js/collection.js ./src/js/view.js ./src/js/views.js > ./bin/js/berryTables.full.js
cp ./bin/js/berryTables.full.js ./docs/assets/js/