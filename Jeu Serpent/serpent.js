window.onload = function(){
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30; // Taille d'un block : 30 px * 30 px
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d'); // Dessiner en deux dimensions
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    let delay;
    let Snakey;
    let pomme;
    let score;
    let timeout;
    let GameInPause = false;

    init();

    function init(){ // Permet d'initialiser la fonctio
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border ="30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas); // Permet d'attacher le canvas à la page web
       launch();
    }

    function launch(){
        Snakey = new Snake([[6,4], [5,4], [4,4]], "right"); // Position des cases du corps du serpent initial
        pomme = new Apple([10,10]);
        score = 0;
        delay = 100;
        clearTimeout(timeout); // Evite d'avoir plusieurs setTimeout en même temps après avoir recommencé
        refreshCanvas();
    }

    function refreshCanvas(){
        if(!GameInPause){ // Jeu en cours
            Snakey.advance();
            if(Snakey.checkCollision()){
                gameOver();
            }
            else{
                if(Snakey.isEatingApple(pomme)){
                    score++;
                    Snakey.ateApple = true;
                    delay *= 0.95; 
                    do{
                        pomme.setNewPosition();
                    }
                    while(pomme.isOnSnake(Snakey)) // Do avant while permet d'effectuer l'action une fois avant de passer au while.
                }
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                drawScore();
                Snakey.draw();
                pomme.draw();
            }
        }
        else{ // Jeu en pause
            Snakey.pause();
        }
        timeout = setTimeout(refreshCanvas, delay); // Permet d'exécuter une certaine fonction après un delai.  
    }

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
            ctx.save(); // Sauvegarder le contenu du canvas.
            ctx.fillStyle = "#ff0000";
            for(let i = 0 ; i < this.body.length ; i++){
                drawBlock(ctx, this.body[i]); // Dessine sur le canvas les cases du corps;
            }
            ctx.restore();
        };
        this.advance = function(){
            const nextPosition = this.body[0].slice(); // Créer une copie de l'élément
            //nextPosition[0]++; // Sans le .slice(), l'élément du tableau this.body aurait aussi été modifié !
            switch(this.direction){
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++; // Attention ++ et pas --
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw("Invalid direction"); // Renvoie un message d'erreur
            }
            this.body.unshift(nextPosition); // La fonction unshift permet de rajouter un élément dans un tableau en première position sans rien supprimer.
            if(!this.ateApple){ // Le serpent n'a pas mangé de pomme
                this.body.pop(); // Supprime le dernier élément.
            }
            else{ // Le serpent a mangé une pomme
                this.ateApple = false;
            }
            
        }

        this.setDirection = function(newDirection){
            let allowedDirection;
            switch(this.direction){ // Le serpent ne peut pas aller dans toutes les directions lors d'un changement de direction
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("Invalid direction"); // Renvoie un message d'erreur
            }
            if(allowedDirection.indexOf(newDirection) > -1){ // Si le tableau allowedDirection contient l'élément newDirection
                this.direction = newDirection;
            }
        }

        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
            const head = this.body[0];
            const rest = this.body.slice(1); // Copie tout le reste à partir de la deuxième valeur
            const headX = head[0];
            const headY = head[1];
            if(headX < 0 || headX > widthInBlocks - 1 || headY < 0 || headY > heightInBlocks -1){
                wallCollision = true;
            }
            for(let i = 0 ; i < rest.length ; i++){
                if(head.join() == rest[i].join()){
                    snakeCollision = true;
                }
            }
            return snakeCollision || wallCollision;

        };

        this.isEatingApple = function(pomme){
            const head = this.body[0];
            return head.join() == pomme.position.join(); // Pour comparer deux tableaux, il faut utiliser pour les deux la méthode .join() sinon la comparaison renvoie TOUJOURS false.
        }

        this.pause = function(){
            ctx.save();
            ctx.font = "bold 70px sans-serif";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.strokeText("Pause", centreX, centreY - 180);
            ctx.fillText("Pause", centreX, centreY - 180);
            ctx.font = "bold 30px sans-serif";
            ctx.strokeText("Appuyer sur la touche Echap pour continuer", centreX, centreY - 120);
            ctx.fillText("Appuyer sur la touche Echap pour continuer", centreX, centreY - 120);
            ctx.restore();
        }
    }

    function drawBlock(ctx, position){
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize); // fillRect permet de dessiner un rectangle de sommet haut gauche (x, y) et de longueur vers la droite le troisième argument et de hauteur vers le bas le quatrième argument.
    }

    function Apple(){
        const positionX = Math.round(Math.random() * (widthInBlocks - 1));
        const positionY = Math.round(Math.random() * (heightInBlocks - 1));
        const radius = blockSize/2;
        this.position = [positionX, positionY];
        this.draw = function(){
            ctx.save(); // Sauvegarde les options du ctx
            ctx.fillStyle = "#33cc33";
            ctx.beginPath(); // Dessiner un rond
            const x = this.position[0] * blockSize + radius;
            const y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill(); // Remplir le cercle
            ctx.restore(); // Remet au ctx les options sauvegardées
        };
        this.setNewPosition = function(){
            const newX = Math.round(Math.random() * (widthInBlocks - 1));
            const newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }
        this.isOnSnake = function(serpent){
            let isOnSnake = false;
            for(let i = 0 ; i < serpent.body.length ; i++){
                if(this.position.join() == serpent.body[i].join()){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000"; //Texte en noir
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = "1.5 ";
        ctx.fillText("Game Over", centreX, centreY - 180); // Permet d'écrire du texte à partir de la position (x,y);
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 40px sans-serif";
        ctx.fillText("Appuyer sur Espace pour rejouer", centreX, centreY - 120);
        ctx.strokeText("Appuyer sur Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle ="gray"; //Couleur avec laquelle on écrit
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; // L'affichage du texte au milieu. Attention à l'écriture
        ctx.fillText(score.toString(), centreX , centreY); // Permet d'écrire du texte à partir de la position (x,y);
        ctx.restore();
    }

    document.onkeydown = function handleKeyDown(e){  // Lorsque l'utilisateur appuie sur une touche de son clavier
        const key = e.keyCode; // Code de la touche appuyée
        let newDirection;
        switch(key){
            case 37: // Touche de gauche
                newDirection = "left";
                break;
            case 38: // Touche du haut
                newDirection = "up";
                break;
            case 39: // Touche de droite
                newDirection = "right";
                break;
            case 40: // Touche du bas
                newDirection = "down";
                break;
            case 32 : // Touche Espace pour recommencer
                launch();
                return;
            case 27 : // Touche Echap pour mettre en pause
                GameInPause = !GameInPause;
            default:
                return;
        }
        Snakey.setDirection(newDirection);
    }
}