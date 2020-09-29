help:
	@ts-node src/index.ts  --help

install:
	npm install
	npm run build  && npm link

model:
	@ts-node src/index.ts  model ./model.ts

watch:
	# brew install watchexec
	watchexec -c --exts ts make modules_install

module_install:
	@ts-node src/index.ts  module install camera

init:
	@ts-node src/index.ts  app init demo
