APP_NAME=discord-bot
PORT=4000

dev-build:
	docker build --build-arg NODE_ENV=development -t $(APP_NAME) .

dev-start:
	docker run --rm -it -v $(pwd):/app -e NODE_ENV=development -p=$(PORT):$(PORT) --name="$(APP_NAME)" $(APP_NAME)

prod-build:
	docker build --build-arg NODE_ENV=production -t $(APP_NAME) .

prod-start:
	docker run --rm -it -v $(pwd):/app -e NODE_ENV=production -p=$(PORT):$(PORT) --name="$(APP_NAME)" $(APP_NAME)

stop:
	docker stop $(APP_NAME); docker rm $(APP_NAME)