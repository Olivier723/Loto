var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
function getElementfromID(id) {
    var temp = document.getElementById(id);
    if (temp === null) {
        console.error("Should not happen");
    }
    return temp;
}
var Loto = /** @class */ (function () {
    function Loto() {
    }
    Loto.showStopButton = function () {
        Loto.showElement(Loto.stopButton);
    };
    Loto.hideStopButton = function () {
        Loto.hideElement(Loto.stopButton);
    };
    Loto.stopTimerHandler = function () {
        Loto.stopButton.textContent = "Montrer les réponses";
        clearInterval(Loto.drawID);
        clearTimeout(Loto.timerID);
        Loto.progressBar.style.width = "100%";
        Loto.stopButton.removeEventListener("click", Loto.stopTimerHandler);
        Loto.stopButton.addEventListener("click", Loto.showAnswersHandler);
    };
    Loto.showAnswersHandler = function () {
        Loto.showAnswer();
        Loto.stopButton.removeEventListener("click", Loto.showAnswersHandler);
        Loto.hideStopButton();
        Loto.stopButton.textContent = "Arreter le décompte";
        Loto.showStartButton();
    };
    Loto.showStartButton = function () {
        Loto.showElement(Loto.startButton);
    };
    Loto.hideStartButton = function () {
        Loto.hideElement(Loto.startButton);
    };
    Loto.startButtonHandler = function () {
        if (Loto.questions.length == 0) {
            return;
        }
        Loto.selectedQuestion = Loto.questions.pop();
        if (Loto.selectedQuestion === undefined) {
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
        Loto.drawID = setInterval(Loto.drawProgressBar, 100, Loto.time * 1000);
        //Create the timer
        Loto.timerID = setTimeout(Loto.timerStop, Loto.time * 1000);
        Loto.stopButton.addEventListener("click", Loto.stopTimerHandler);
    };
    /**
     *
     * @param fileContent The contents of the file we want to build the questions from
     * @returns A list of questions
     */
    Loto.parseTextFile = function (fileContent) {
        var lines = fileContent.split("\n");
        lines.forEach(function (line) {
            line = line.trim();
            var qna = line.split("=");
            var question = qna.shift();
            var answersString = qna.pop();
            if (question != undefined && answersString != undefined) {
                var answers = answersString.split(";");
                answers.forEach(function (answer) {
                    answer = answer.trim();
                });
                Loto.questions.push({
                    question: question,
                    answers: answers
                });
            }
        });
    };
    /**
     * Modifies the questions array by shuffling the elements it contains
     */
    Loto.shuffleQuestions = function () {
        var counter = Loto.questions.length;
        while (counter > 0) {
            var index = Math.floor(Math.random() * counter);
            counter--;
            var temp = Loto.questions[counter];
            Loto.questions[counter] = Loto.questions[index];
            Loto.questions[index] = temp;
        }
    };
    /**
     * Shows the answer to the question that was asked in the answer box
     * */
    Loto.showAnswer = function () {
        var _a;
        var _b, _c;
        var questionContainer = getElementfromID("questions");
        var answers = [];
        (_b = Loto.selectedQuestion) === null || _b === void 0 ? void 0 : _b.answers.forEach(function (answer) {
            var newP = Loto.createP(answer);
            answers.push(newP);
        });
        (_a = Loto.answerBox).replaceChildren.apply(_a, answers);
        (_c = Loto.selectedQuestion) === null || _c === void 0 ? void 0 : _c.answers.forEach(function (answer) {
            var newP = Loto.createP(answer);
            newP.className = "finished";
            questionContainer.appendChild(newP);
        });
        Loto.startButton.style.visibility = "visible";
    };
    /**
     * Stops the timer in case it runs out
     * @param question the question that was drawn when the start button was clicked
     * @param drawID the ID the interval that draw the progress bar
     */
    Loto.timerStop = function () {
        clearInterval(Loto.drawID);
        Loto.stopButton.textContent = "Montrer les réponses";
        Loto.stopButton.removeEventListener("click", Loto.stopTimerHandler);
        Loto.stopButton.addEventListener("click", Loto.showAnswersHandler);
    };
    /**
     * Changes the time of the timer by reading the value from the roll-down menu
     */
    Loto.changeTime = function () {
        var tSelect = getElementfromID("timer-select");
        Loto.time = Number(tSelect.value) * 1000;
    };
    Loto.drawProgressBar = function () {
        Loto.time_elapsed += 100;
        if (Loto.time_elapsed >= Loto.time) {
            Loto.progressBar.style.width = "100%";
            Loto.timerStop();
            return;
        }
        var ratio = Loto.time_elapsed / Loto.time;
        Loto.progressBar.style.width = String(Math.floor(ratio * 100)) + "%";
    };
    Loto.showElement = function (elm) {
        elm.style.visibility = "visible";
    };
    Loto.hideElement = function (elm) {
        elm.style.visibility = "hidden";
    };
    /**
     * @param text a sting
     * @returns an HTML paragraph element with the text given as content
     */
    Loto.createP = function (text) {
        var p = document.createElement("p");
        p.textContent = text;
        return p;
    };
    Loto.init = function (fileContent) {
        //First we start by parsing and shuffling the questions
        Loto.parseTextFile(fileContent);
        Loto.shuffleQuestions();
        //Then we can update the UI
        Loto.showStartButton();
        //Add the handler to the start button
        Loto.startButton.addEventListener("click", Loto.startButtonHandler);
    };
    Loto.stopButton = getElementfromID("stpbtn");
    Loto.startButton = getElementfromID("strtbtn");
    Loto.questions = [];
    Loto.questionBox = getElementfromID("boiteQuestion");
    Loto.answerBox = getElementfromID("boiteReponseContainer");
    Loto.time = 15000;
    Loto.time_elapsed = 0;
    Loto.progressBar = getElementfromID("progressbar");
    return Loto;
}());
(_a = document.getElementById('fileInput')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', function (e) {
    var file = getElementfromID('fileInput');
    if (file == null) {
        return;
    }
    if (file.files == null) {
        return;
    }
    (function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, file[0].text()];
                    case 1:
                        fileContent = _a.sent();
                        Loto.init(fileContent);
                        return [2 /*return*/];
                }
            });
        });
    })(file.files);
});
