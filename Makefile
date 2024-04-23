
.PHONY: run server t test tl testlogs v version

run:
	@(cd killer-sudoku; npm run build && npm run start)

server:
	@(git pull; cd killer-sudoku; npm run build && npm run start)

t: test

test:
	@(cd killer-sudoku; npm run test)

tlDir = ./app/testing/logs

tl: testlogs

testlogs: 
	@(	\
		cd killer-sudoku; \
		npm run test . 2>&1 | tee $(tlDir)/LogAll.txt; \
		npm run test Difficulty.test.tsx 2>&1 | tee $(tlDir)/DifficultyLog.txt; \
		npm run test Generation.test.tsx 2>&1 | tee $(tlDir)/GenerationLog.txt; \
		npm run test Sudoku.test.tsx 2>&1 | tee $(tlDir)/SudokuLog.txt; \
		npm run test Timer.test.tsx 2>&1 | tee $(tlDir)/TimerLog.txt; \
	);

v: version

version:
	@printf "node        : %s\n" "$(shell node -v | cut -d'v' -f2-     2> /dev/null)"
	@printf "npm         : %s\n" "$(shell npm -v                       2> /dev/null)"
	@printf "tailwind    : %s\n" "$(shell npm view tailwind version    2> /dev/null)"
	@printf "tailwindcss : %s\n" "$(shell npm view tailwindcss version 2> /dev/null)"
	@printf "Brew        : %s\n" "$(shell brew -v | cut -d' ' -f2-     2> /dev/null)"
	@printf "nvm         : %s\n" "$(shell nvm -v                       2> /dev/null)"