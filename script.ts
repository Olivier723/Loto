type Question = {
    question : string,
    answers : string[]
};

function getElementfromID<T>(id :string) : T{
    const temp = document.getElementById(id);
    if(temp === null){
        console.error("Should not happen");
    }
    return temp as T;
}

class Loto{
    public static stopButton : HTMLButtonElement = getElementfromID("stpbtn");
    public static showStopButton() : void {
        Loto.showElement(Loto.stopButton);
    }

    public static hideStopButton() : void {
        Loto.hideElement(Loto.stopButton);
    }

    public static stopTimerHandler() : void {
        Loto.stopButton.textContent = "Montrer les réponses";
        clearInterval(Loto.drawID);
        clearTimeout(Loto.timerID);
        Loto.progressBar.style.width = "100%";
        Loto.stopButton.removeEventListener("click", Loto.stopTimerHandler);
        Loto.stopButton.addEventListener("click", Loto.showAnswersHandler);
    }

    public static showAnswersHandler() : void {
        Loto.showAnswer();
        Loto.stopButton.removeEventListener("click", Loto.showAnswersHandler);
        Loto.hideStopButton();
        Loto.stopButton.textContent = "Arreter le décompte";
        Loto.showStartButton();
    }

    public static startButton : HTMLButtonElement = getElementfromID("strtbtn");
    public static showStartButton(){
        Loto.showElement(Loto.startButton);
    }

    public static hideStartButton(){
        Loto.hideElement(Loto.startButton);
    }

    private static startButtonHandler(){
        if(Loto.questions.length == 0){
            return;
        }
        Loto.selectedQuestion = Loto.questions.pop();
        if(Loto.selectedQuestion === undefined){
            return;
        }

        //Reset the time elapsed since the last timer
        Loto.time_elapsed = 0;

        //Reset the contents of the answer box
        Loto.answerBox.textContent = "";

        //Hide the button
        Loto.hideStartButton();

        //Show the question
        Loto.questionBox.replaceChildren(Loto.createP(Loto.selectedQuestion.question));

        //Show the button that can end the timer
        Loto.showStopButton();

        //Create the interval that draws the progress bar
        Loto.drawID = setInterval(Loto.drawProgressBar, 100 ,Loto.time * 1_000);

        //Create the timer
        Loto.timerID = setTimeout(Loto.timerStop, Loto.time * 1_000);

        Loto.stopButton.addEventListener("click", Loto.stopTimerHandler);

    }

    public static questions : Question[] = [];
    /**
     * 
     * @param fileContent The contents of the file we want to build the questions from
     * @returns A list of questions
     */
    public static parseTextFile(fileContent:string) : void{
        const lines = fileContent.split("\n");
        lines.forEach((line) => {
            line = line.trim();
            const qna = line.split("=");
            const question = qna.shift();
            const answersString = qna.pop();
            if(question != undefined && answersString != undefined){
                const answers = answersString.split(";")
                answers.forEach(answer => {
                    answer = answer.trim();
                });
                Loto.questions.push({
                    question,
                    answers
                });
            }
        });
    }

    /**
     * Modifies the questions array by shuffling the elements it contains
     */
    public static shuffleQuestions() : void{
        let counter = Loto.questions.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = Loto.questions[counter];
            Loto.questions[counter] = Loto.questions[index];
            Loto.questions[index] = temp;
        }
    }
    
    /**
     * Shows the answer to the question that was asked in the answer box
     * */
    public static showAnswer(){
        const questionContainer : HTMLDivElement = getElementfromID("questions");
        const answers : HTMLParagraphElement[] = [];
        Loto.selectedQuestion?.answers.forEach((answer) =>{
            const newP = Loto.createP(answer);
            answers.push(newP);
        })
        Loto.answerBox.replaceChildren(...answers);
        Loto.selectedQuestion?.answers.forEach((answer) => {
            const newP = Loto.createP(answer);
            newP.className = "finished";
            questionContainer.appendChild(newP);
        })
        Loto.startButton.style.visibility = "visible";
    }

    /**
     * The question that was drawn by clicking the start button
     */
    public static selectedQuestion : Question | undefined;

    private static questionBox : HTMLDivElement = getElementfromID("boiteQuestion");

    private static answerBox : HTMLDivElement = getElementfromID("boiteReponseContainer");

    private static drawID : number;

    private static timerID : number;

    /**
     * Stops the timer in case it runs out
     * @param question the question that was drawn when the start button was clicked
     * @param drawID the ID the interval that draw the progress bar
     */
    public static timerStop() {
        clearInterval(Loto.drawID);
        Loto.stopButton.textContent = "Montrer les réponses";
        Loto.stopButton.removeEventListener("click", Loto.stopTimerHandler)
        Loto.stopButton.addEventListener("click", Loto.showAnswersHandler);
    }

    public static time : number = 15_000;
    /**
     * Changes the time of the timer by reading the value from the roll-down menu
     */
    public static changeTime(){
        let tSelect : HTMLSelectElement = getElementfromID("timer-select");
        Loto.time = Number(tSelect.value) * 1000;
    }

    public static time_elapsed = 0;

    public static progressBar : HTMLDivElement = getElementfromID("progressbar");

    public static drawProgressBar() {
        Loto.time_elapsed += 100;
        if(Loto.time_elapsed >= Loto.time){
            Loto.progressBar.style.width = "100%";
            Loto.timerStop();
            return;
        }
        let ratio = Loto.time_elapsed / Loto.time;
        Loto.progressBar.style.width = String(Math.floor(ratio * 100)) + "%";
    }

    private static showElement(elm : HTMLElement){
        elm.style.visibility = "visible";
    }

    private static hideElement(elm : HTMLElement){
        elm.style.visibility = "hidden";
    }

    /**
     * @param text a sting
     * @returns an HTML paragraph element with the text given as content
     */
    public static createP(text:string) : HTMLParagraphElement{
        let p = document.createElement("p");
        p.textContent = text;
        return p;
    }

    public static init(fileContent: string) : void{
        //First we start by parsing and shuffling the questions
        Loto.parseTextFile(fileContent);
        Loto.shuffleQuestions();

        //Then we can update the UI
        Loto.showStartButton();

        //Add the handler to the start button
        Loto.startButton.addEventListener("click", Loto.startButtonHandler);
    }
}

document.getElementById('fileInput')?.addEventListener('change', function(e) {
    const file : HTMLInputElement = getElementfromID('fileInput');
    if(file == null){
        return;
    }
    if(file.files == null){
        return;
    }
    (async function (file:FileList){
        const fileContent = await file[0].text();
        Loto.init(fileContent);
    })(file.files);    
});