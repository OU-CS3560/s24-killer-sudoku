
.PHONY: run version

run:
	npm run build
	npm run start

version:
	@printf "node: %s\n" "$(shell node -v)"
	@printf "npm : %s\n" "$(shell npm -v)"
	@printf "tailwindcss: %s\n" "$(shell npm view tailwindcss version)"