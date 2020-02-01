class DropBoxController {
    
    constructor(){

        this.btnSendFileEl  = document.querySelector("#btn-send-file");
        this.inputFilesEl   = document.querySelector("#files");
        this.snackModalEl   = document.querySelector("#react-snackbar-root");
        this.progressBarEl  = this.snackModalEl.querySelector(".mc-progress-bar-fg");
        this.nameFileEl     = this.snackModalEl.querySelector(".filename");
        this.timeLeftEl     = this.snackModalEl.querySelector(".timeleft");

        this.initEvents();

    }

    
    initEvents(){

        this.btnSendFileEl.addEventListener("click", event => {

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener("change", event => {

            this.uploadTask(event.target.files);

            this.modalShow();

            this.inputFilesEl.value = "";

        });

    }

    
    modalShow(show = true){
        
        this.snackModalEl.style.display = (show) ? "block" : "none";

    }

    
    uploadTask(files){

        let promises = [];

        //Files é uma coleção e não um array. Assim converte para array.
        [...files].forEach(file => {

            promises.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {

                    try {

                        resolve(JSON.parse(ajax.responseText));

                    } catch (e) {
                        
                        reject(e);

                    }

                    this.modalShow(false);

                }

                ajax.onerror = event => {

                    reject(event);

                    this.modalShow(false);

                };

                ajax.upload.onprogress = event =>  {

                    this.uploadProgress(event, file);

                }

                let formData =  new FormData();

                formData.append('input-file', file);

                this.startUploadTime = Date.now(); //em milesegundos

                ajax.send(formData);

            }));

        }); //End forEach in files

        return Promise.all(promises);

    } //End uploadTask

    
    uploadProgress(event, file){

        let timeSpent   = Date.now() - this.startUploadTime; //Tempo gasto = momento atual - momento inical
        let loaded      = event.loaded;
        let toal        = event.total;
        let porcent     = parseInt((loaded / toal) * 100);
        let timeLeft    = ( (100 - porcent) * timeSpent ) / porcent;

        this.progressBarEl.style.width = `${porcent}%`;

        this.nameFileEl.innerHTML = "<i>" + file.name + "</i>";
        this.timeLeftEl.innerHTML = "<b>" + this.formatTimeToHuman(timeLeft) + "</b>";

        console.log(timeSpent, timeLeft, porcent);

    } //End UploadProgress

    
    formatTimeToHuman(duration){

        let seconds = parseInt((duration / 1000) % 60);                 //milessegundos para segundos
        let minutes = parseInt((duration / (1000 * 60)) % 60);          //milessegundos para minutos
        let hours   = parseInt((duration / (1000 * 60 * 60)) % 24);     //milessegundos para horas

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos restantes`;
        }

        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos restantes`;
        }

        if (seconds > 0) {
            return `${seconds} segundos restantes`;
        }

        return ' processando';

    } //End formatTimeToHuman

} //End Class