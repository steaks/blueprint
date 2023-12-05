cd server && rm -rf node_modules && rm -rf build && rm -rf types && cd ..
cd diagram && rm -rf node_modules && rm -rf build && rm -rf types && cd ..
cd clients && make clean && cd ..
cd examples/userprofile && make clean && cd ../..
cd examples/citifakebank && make clean && cd ../..
cd templates/helloWorld && make clean && cd ../..
cd templates/skeleton && make clean && cd ../..
cd templates/userProfile && make clean && cd ../..
