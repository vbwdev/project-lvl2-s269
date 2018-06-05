install:
	npm install

lint:
	npm run eslint src

publish:
	@read -p "Enter type of version (major | minor | patch): " type; \
	npm version $$type
	npm publish
	git push

run:
	npm run babel-node -- src/bin/gendiff.js

build:
	rm -rf dist
	npm run build
