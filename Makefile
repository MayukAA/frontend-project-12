install:
	npm ci

lint:
	npx eslint frontend/src

start-frontend:
	npm -C frontend start

start-backend:
	npx start-server

start:
	make start-backend & make start-frontend

build:
	npm run build
