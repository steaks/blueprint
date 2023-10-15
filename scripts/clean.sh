cd server && rm -rf node_modules && rm -rf build && rm -rf types && cd ..
cd diagram && rm -rf node_modules && rm -rf build && rm -rf types && cd ..
cd clients && make clean && cd ..
cd examples/userprofile && make clean && cd ../..
cd examples/citifakebank && make clean && cd ../..
