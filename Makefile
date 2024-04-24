install:
	npm ci

build:
	npm run build

lint:
	npx eslint frontend/src

start-frontend:
	npm -C frontend start

start-backend:
	npx start-server

start:
	npx start-server -s ./frontend/build

run:
	make start-backend & make start-frontend
