
help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

vendor: ## Install go vendor
	docker run -v `pwd`:`pwd` -w `pwd` --user 1000:1000 golang:1.17 go mod tidy
	docker run -v `pwd`:`pwd` -w `pwd` --user 1000:1000 golang:1.17 go mod vendor

gen-wasm: ## Generate main.wasm file
	docker run -v `pwd`:`pwd` -w `pwd` --user 1000:1000 -e GOARCH=wasm -e GOOS=js -e XDG_CACHE_HOME=/tmp/.cache golang:1.17 go build -o main.wasm main.go

start: ## Start a server listening on :8080
	docker run -v `pwd`:`pwd` -w `pwd` --user 1000:1000 -e XDG_CACHE_HOME=/tmp/.cache -p 8080:8080 golang:1.17 go run server.go

.PHONY: vendor
