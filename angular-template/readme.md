
1. Install the packages 
$ npm install

2. Compile the Typescript with NGC (Ahead-of-Time)
$ npm run ngc

3. Transpile the source into ES2015 module for the Three-sharking
$ tsc -p tsconfig2015.json

4. Three-sharking
$ npm run rollup

5. Convert the result JS into ES5 module
$ npm run es5

6. Run the minify
$ npm run minify

7. Generate the GZIP
(With some custom tool)

8. Server
$ npm run serve






    "build_prod": "npm run build && browserify -s main dist/main.js > dist/bundle.js && npm run minify",


Blog com os procedimentos para optimização
http://blog.mgechev.com/2016/06/26/tree-shaking-angular2-production-build-rollup-javascript/


1. Run TSC to generate ES2015 module files

2. Use Rollup to generate entry files with minimal code "tree-sharking"

3. Use AoT

4. Optional. Use TSC again to generate ES5 compatible files

5. Minify

6. Gzip



{
    1. Compile our application (including templates) to TypeScript with ngc.
    
    2. Perform tree-shaking with rollup (this way we will get at least as small bundle as above).
    
    3. Transpile the bundle to ES5.
    
    4. Minify the bundle.
    
    5. Gzip it!
}