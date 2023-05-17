const express = require("express");
var path = require("path");
const bodyParser = require("body-parser");

const app = express();

const fs = require("fs");
const data = require("./data.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// ############## HTML ##############

// Définition de la route pour la page d'accueil et les pages alternatives
app.get("/", function (req, res) {
  // Renvoi du fichier index.html
  res.sendFile(path.resolve("indexpage/index.html"));
});

app.use("/dashboard.html", function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

app.use("/login.html", function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "login.html"));
});

app.use("/inscription.html", function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "inscription.html"));
});

app.use('/modifier.html', function (req, res) {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'modifier.html'));
});

app.get("/ajout.html", (req, res) => {
  res.sendFile(path.join(__dirname, "ajout.html"));
});




// ############## STYLES ##############

app.use("/style.css", function (req, res) {
  res.set("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "style.css"));
});

// ------------ CSS "inutile" ------------
app.use("/bootstrap.min.css", function (req, res) {
  res.set("Content-Type", "text/css");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/bootstrap/bootstrap.min.css")
  );
});
app.use('/bootstrap.min.css', function (req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname,  'indexpage/css/bootstrap.min.css'));
});
app.use("/select2.min.css", function (req, res) {
  res.set("Content-Type", "text/css");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/select2/select2.min.css")
  );
});
app.use("/owl.carousel.min.css", function (req, res) {
  res.set("Content-Type", "text/css");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/owlcarousel/owl.carousel.min.css")
  );
});
app.use("/lightcase.css", function (req, res) {
  res.set("Content-Type", "text/css");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/lightcase/lightcase.css")
  );
});
app.use("/style.min.css", function (req, res) {
  res.set("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "indexpage/css/style.min.css"));
});
// ------------ Fin CSS inutile ------------

// ############## JS ##############

app.use("/dashboard.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "dashboard.js"));
});

app.get("/data.json", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

app.get("/equipments", (req, res) => {
  res.json(data.equipments);
});

app.get("/equipments/:id", (req, res) => {
  const { id } = req.params;
  const equipment = data.equipments.find((equip) => equip.id == id);
  if (equipment) {
    res.json(equipment);
  } else {
    res.status(404).send("Equipment not found");
  }
});


// ------------ JS "inutile" ------------
app.use("/popper.min.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/bootstrap/popper.min.js")
  );
});
app.use("/bootstrap.min.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/bootstrap/bootstrap.min.js")
  );
});
app.use("/select2.min.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "indexpage/vendor/select2/select2.min.js"));
});
app.use("/owl.carousel.min.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/owlcarousel/owl.carousel.min.js")
  );
});
app.use("/jquery.stellar.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/stellar/jquery.stellar.js")
  );
});
app.use("/isotope.min.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "indexpage/vendor/isotope/isotope.min.js"));
});
app.use("/lightcase.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "indexpage/vendor/lightcase/lightcase.js"));
});
app.use("/waypoint.min.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(
    path.join(__dirname, "indexpage/vendor/waypoints/waypoint.min.js")
  );
});
app.use("/app.min.js", function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.sendFile(path.join(__dirname, "indexpage/js/app.min.js"));
});
// ------------ Fin JS inutile ------------

// ############## IMG ##############

app.use("/obj_triangle.png", function (req, res) {
  res.set("Content-Type", "img/png");
  res.sendFile(path.join(__dirname, "indexpage/img/obj_triangle.png"));
});

app.use("/background.png", function (req, res) {
  res.set("Content-Type", "img/png");
  res.sendFile(path.join(__dirname, "indexpage/img/background.png"));
});
// ---------------------------------------------------------------------------------------------------------------------------

// ############## Méthodes ##############

// Logging in
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const entreprise = data.entreprises.find(
    (entreprise) =>
      entreprise.username === username && entreprise.password === password
  );
  if (entreprise) {
    res.redirect(`/dashboard.html?name=${entreprise.name}`);
  } else {
    res.send("Identifiant ou mot de passe incorrect.");
  }
});

// Inscription
function getNewId() {
  // Recherche de l'ID le plus élevé dans la liste des entreprises
  let maxId = 0;
  data.entreprises.forEach((entreprise) => {
    if (entreprise.id > maxId) {
      maxId = entreprise.id;
    }
  });
  // Ajout de 1 à l'ID le plus élevé pour créer un nouvel ID unique
  return maxId + 1;
}




// Ajout équipement
function getNewIdEquip() {
  // Recherche de l'ID le plus élevé dans la liste
  let maxId = 0;
  data.equipments.forEach((equipment) => {
    if (equipment.id > maxId) {
      maxId = equipment.id;
    }
  });
  // Ajout de 1 à l'ID le plus élevé pour créer un nouvel ID unique
  return maxId + 1;
}


app.post("/inscription", (req, res) => {
  const { name, username, password } = req.body;
  const newEntreprise = { id: getNewId(), name, username, password };
  data.entreprises.push(newEntreprise);
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur serveur");
    } else {
      res.locals.message = "Inscription réussie ! Veuillez vous connecter.";
      res.redirect("/login.html?inscription=success");
    }
  });
});

// Ajout d'un équipement
app.post("/ajouter", (req, res) => {
  const { name, description, status, location, owner } = req.body;
  const newEquipment = { id: getNewIdEquip(), name, description, status, location, owner };
  data.equipments.push(newEquipment);
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur serveur");
    } else {
      res.locals.message = "Ajout d'équipement réussi ! Veuillez vous connecter.";
      res.redirect(`dashboard.html?name=${owner}`);
    }
  });
});


app.delete("/equipments/:id", (req, res) => {
  const { id } = req.params;
  const index = data.equipments.findIndex((equip) => equip.id == id);
  if (index !== -1) {
    data.equipments.splice(index, 1);
    fs.writeFile("./data.json", JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server error");
      } else {
        res.status(204).send();
      }
    });
  } else {
    res.status(404).send("Equipment not found");
  }
});

app.get("/api/panne", function (req, res) {
  const panneEquipments = data.equipments.filter(
    (equipment) => equipment.status == "En panne"
  );
  res.json(panneEquipments);
});



// Server
app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
