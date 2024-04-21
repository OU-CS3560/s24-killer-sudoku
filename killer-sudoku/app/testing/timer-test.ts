export function timer() {

    let timeStart = new Date().getTime();
    return {

        get seconds(){
            const seconds = Math.floor(((new Date().getTime() - timeStart) / 1000) % 60) + 's';
            return seconds;
        },

        get minutes(){

            const minutes = Math.floor((new Date().getTime() - timeStart ) / 60000) + ' minutes';
            return minutes;
            

        },

        set reset(value: boolean){

            if(value){

                timeStart = new Date().getTime();

            }
            

        }

    }

}