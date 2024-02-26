
.PHONY: run server u update v version

run:
	@(cd killer-sudoku; npm run build; npm run start)

server:
	@(git pull; cd killer-sudoku; npm run build; npm run start)

u: update

update:
	@sudo apt update
	@sudo apt-get upgrade

v: version

version:
	@printf "node        : %s\n" "$(shell node -v | cut -d'v' -f2-     2> /dev/null)"
	@printf "npm         : %s\n" "$(shell npm -v                       2> /dev/null)"
	@printf "tailwind    : %s\n" "$(shell npm view tailwind version    2> /dev/null)"
	@printf "tailwindcss : %s\n" "$(shell npm view tailwindcss version 2> /dev/null)"
	@printf "Brew        : %s\n" "$(shell brew -v | cut -d' ' -f2-     2> /dev/null)"
	@printf "nvm         : %s\n" "$(shell nvm -v                       2> /dev/null)"