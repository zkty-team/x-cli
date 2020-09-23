help:
	@ts-node src/index.ts  --help

install:
	npm install
	npm run build  && npm link

