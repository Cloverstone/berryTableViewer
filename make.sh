#! /bin/bash
hulk ./src/views/*.mustache   > ./src/js/views.js
minify ./src/js/bread.js ./src/js/utils.js ./src/js/collection.js ./src/js/view.js ./src/js/views.js > ./bin/js/bread.min.js
