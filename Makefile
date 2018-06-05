install:
	npm install

lint:
	npm run eslint .

publish:
	@read -p "Enter type of version (major | minor | patch): " type; \
	npm version $$type
	npm publish
	git push

start:
	npm run babel-node -- src/bin/gendiff.js
