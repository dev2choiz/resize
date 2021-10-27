
help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

vendor: ## Install go vendor
	go mod vendor

gen-wasm: ## Generate main.wasm file
	GOARCH=wasm GOOS=js go build -o main.wasm main.go

start: ## Start a server listening on :8080
	go run server.go
