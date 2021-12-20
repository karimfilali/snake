var Str = "Hello John";
var entier = 12;
var position = Str.indexOf("John");
var newString = Str.replace("John", "Tim");
var conc = Str + " " + newString;
console.log(conc);
console.log(3!=5);
// Commentaire 1

/* 
Commentaire 2
*/

var fruits = ["Pomme","Banane","Orange","Citron"];
console.log(fruits[2]);
fruits.push("Kiwi"); // Permet de rajouter un élément
fruits.pop(); // Enlève la dernière valeur
var agrumes = fruits.slice(1,3); // Retourne le sous-tableau des valeurs 1 à (3-1) du tableau fruits

var dog = { // Type Object : var dog = new Object();
    name : "Chien",
    color : "white",
    age : 4,
    aboie : function(){console.log("Whaouf")}
};
console.log(dog.age);
dog.aboie();
for(var property in dog){
    console.log(dog[property]); // dog.property ne fonctionne pas car les attribus de dog ne sont pas de même type.
}


function Dog(name, color, age){ // Constructeur d'Object chien
    this.name = name;
    this.color = color;
    this.age = age;
    this.aboie = function(){
        console.log("Whaouf " + this.name);
    }
}

var petitChien = new Dog("Choupette","red", 50);
console.log(petitChien);
petitChien.aboie();