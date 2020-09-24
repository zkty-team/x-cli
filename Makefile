help:
	@ts-node src/index.ts  --help

install:
	npm install
	npm run build  && npm link

model:
	@ts-node src/index.ts  model --name ./model.ts

watch:
	# brew install watchexec
	watchexec -c --exts ts make model
