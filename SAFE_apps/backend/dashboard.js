// Récupérer le nom de l'entreprise depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const companyName = urlParams.get("name");
let jsonData;

document.getElementById(
  "entreprise"
).innerText = `Welcome back, ${companyName} !`;

// Récupérer les données des équipements depuis le fichier JSON
fetch("/data.json")
  .then((response) => response.json())
  .then((data) => {
    // Filtrer les équipements appartenant à l'entreprise
    const companyEquipments = data.equipments.filter(
      (equipment) => equipment.owner === companyName
    );
    equipments = companyEquipments;

    // Créer les lignes du tableau
    const tableRows = companyEquipments.map(
      (equipment) => `
      <tr>
        <td>${equipment.id}</td>
        <td>${equipment.name}</td>
        <td>${equipment.description}</td>
        <td>${equipment.status}</td>
        <td>${equipment.location}</td>
        <td>${equipment.owner}</td>
        <td id="deletebutton">
            <button  type="button" class="btn btn-danger delete-button" method="delete" data-id="${equipment.id}" onclick="deleteEquipment(${equipment.id})">
            Delete
          </button>
      
        </td>
      </tr>
    `
    );

    // Ajouter les lignes au tableau dans le HTML
    document.getElementById("equipments-table").innerHTML = tableRows.join("");

    // Créer un tableau contenant les différentes localisations
    const locations = Array.from(
      new Set(companyEquipments.map((e) => e.location))
    );

   // Créer les div de localisations
const locationsContainer = document.querySelector(".locations-container");
locationsContainer.innerHTML = ""; // Clear the container to remove previous content
locations.forEach((location) => {
  const locationDiv = document.createElement("div");
  locationDiv.classList.add("location-box");
  locationDiv.innerHTML = `
    <div id="single-loc">
      <label for="${location}-checkbox" class="location-name">${location}</label>
      <div id="${location}-equipments" class="location-equipments"></div>
    </div>
  `;
  locationsContainer.appendChild(locationDiv);
});

// Ajouter les équipements aux div de localisations
companyEquipments.forEach((equipment) => {
  const equipmentDiv = document.createElement("div");
  equipmentDiv.classList.add("equipment");
  equipmentDiv.innerText = equipment.name;
  const locationEquipments = document.getElementById(
    `${equipment.location}-equipments`
  );
  locationEquipments.appendChild(equipmentDiv);
});



// Ajouter le style CSS
const style = document.createElement("style");
style.innerHTML = `
  .locations-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    border: 1px solid white; /* Ajout d'une bordure blanche */
    padding: 10px; /* Ajout d'un espace intérieur */
  }

  .location-box {
    width: calc(33.33% - 20px);
    padding: 10px;
    box-sizing: border-box;
    background-color: #121212; /* Couleur de fond */
    border: 1px solid white; /* Bordure blanche */
    border-radius: 5px; /* Coins arrondis */
    margin: 10px; /* Espacement entre les localisations */
  }

  .location-name {
    color: #7f718b;
    font-weight: bold;
    text-transform: uppercase;

  }

  .location-equipments {
    margin-top: 10px;
    width: 100%;
  }
`;
document.head.appendChild(style);

    // Ajouter un gestionnaire d'événement "click" à la table
    document
      .getElementById("equipments-table")
      .addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-button")) {
          const equipmentId = event.target.dataset.id;
          deleteEquipment(equipmentId);
        }
      });
  })
  .catch((error) => console.error(error));

function deleteEquipment(id) {
  fetch(`/equipments/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Recharger la page pour mettre à jour le tableau
        window.location.reload();
      } else {
        console.error(
          `Error deleting equipment ${id}: ${response.status} ${response.statusText}`
        );
      }
    })
    .catch((error) =>
      console.error(`Error deleting equipment ${id}: ${error}`)
    );
}

function getEquipmentsPanne() {
  const notifications = document.getElementById("notifications");
  notifications.innerHTML = "";
  fetch("/api/panne")
    .then((response) => response.json())
    .then((panneEquipments) => {
      if (panneEquipments.length === 0) {
        notifications.innerHTML = "<p>Aucun équipement en panne.</p>";
      } else {
        panneEquipments.forEach((equipment) => {
          if (equipment.owner == companyName) {
            const notification = document.createElement("div");
            notification.classList.add("notification");
            notification.innerHTML = `
              <p><b>L'équipement <i id="equid"> ${equipment.id} </i></b> est <b id="panne">en panne</b> <p> <i>à ${equipment.location}.</i></p></p>
            `;
            notifications.appendChild(notification);
          }
        });
      }
    })
    .catch((error) => console.error(error));
}

window.onload = function () {
  getEquipmentsPanne();
  updateLocationEquipments();
};

function getEquipmentsByCompany(equipments, company) {
  return equipments.filter((e) => e.owner === company);
}

function countEquipmentsByStatus(equipments, status) {
  return equipments.filter((e) => e.status === status).length;
}

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    jsonData = data; // stocker les données dans une variable globale
    updateEtatEquipementsChart();
  })
  .catch((error) => console.error(error));

function createEtatEquipementsChart(equipments) {
  const data = {
    labels: ["En panne", "En fonctionnement", "Hors service"],
    datasets: [
      {
        label: "Etat des équipements",
        backgroundColor: ["#4a355c", "#705a98", "#c092ca"],
        borderColor: "#fff",
        data: [
          countEquipmentsByStatus(equipments, "En panne"),
          countEquipmentsByStatus(equipments, "En fonctionnement"),
          countEquipmentsByStatus(equipments, "Hors service"),
        ],
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: false, // désactiver la redimension automatique
      maintainAspectRatio: false, // permettre de modifier la hauteur et la largeur indépendamment
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
    width: 400, // largeur fixe en pixels
    height: 300, // hauteur fixe en pixels
  };

  const chartElement = document.getElementById("etat-equipements-chart");
  if (window.equipementsChart) {
    window.equipementsChart.destroy();
  }
  window.equipementsChart = new Chart(chartElement, config);
}

function updateEtatEquipementsChart() {
  const params = new URLSearchParams(window.location.search);
  const company = params.get("name");
  const allEquipments = jsonData.equipments; // accéder à la variable globale jsonData

  // Récupérer les équipements de la compagnie correspondant au nom dans l'URL
  const equipments = allEquipments.filter((e) => e.owner == company);

  // Mettre à jour le graphique circulaire
  const etatEquipementsChart = createEtatEquipementsChart(equipments);
  etatEquipementsChart.update();
}

function updateLocationEquipments() {
  const locationEquipments = document.querySelectorAll(".location-equipments");
  locationEquipments.forEach((location) => {
    const locationName = location.id.split("-")[0];
    const locationEquipmentsDiv = location.querySelector(".location-equipments-div");
    locationEquipmentsDiv.innerHTML = "";

    companyEquipments
      .filter((equipment) => equipment.location === locationName)
      .forEach((equipment) => {
        const equipmentDiv = document.createElement("div");
        equipmentDiv.classList.add("equipment");
        equipmentDiv.innerText = equipment.name;
        locationEquipmentsDiv.appendChild(equipmentDiv);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {});
