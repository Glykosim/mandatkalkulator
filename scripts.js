let selectedParties = [];

parties.sort((a, b) => b.mandates - a.mandates);

// Generer knapper basert på config.js data
parties.forEach(party => {
  let btn = document.createElement("button");
  btn.innerHTML = `${party.name} (${party.mandates})`;
  
    if (party.secondaryColor) {
    btn.style.background = `linear-gradient(90deg, ${party.color} 0%, ${party.color} 40%, ${party.secondaryColor} 60%, ${party.secondaryColor} 100%)`;
  } else {
    btn.style.backgroundColor = party.color;
  }
  

  btn.onclick = function() {
    if (selectedParties.includes(party)) {
      selectedParties = selectedParties.filter(p => p !== party);
      btn.style.opacity = '1';
    } else {
      selectedParties.push(party);
      btn.style.opacity = '0.5';
    }

    updateMandateBar();
  };

  document.getElementById("partyButtons").appendChild(btn);
});


const buttonHeight = 45; // Høyden av en knapp som definert i CSS
const buttonMargin = 10; // Margin definert i CSS (topp og bunn)
const totalButtonHeight = parties.length * (buttonHeight + 2*buttonMargin); // Total høyde = antall knapper * (høyde + 2*margin)
document.getElementById('mandateBar').style.height = `${totalButtonHeight}px`;


function updateMandateBar() {
  const totalMandates = parties.reduce((acc, party) => acc + party.mandates, 0);
  const selectedTotalMandates = selectedParties.reduce((acc, party) => acc + party.mandates, 0);

  const mandateBar = document.getElementById("mandateBar");

  // Renser eksisterende innhold
  mandateBar.innerHTML = "";

  let currentHeight = 0;
  selectedParties.forEach(party => {
    let partyBar = document.createElement("div");
    let percentage = (party.mandates / totalMandates) * 100;
    partyBar.style.height = `${percentage}%`;
    partyBar.style.backgroundColor = party.color;
    partyBar.style.position = "absolute";
    partyBar.style.bottom = `${currentHeight}%`;
    partyBar.style.width = "100%";
    mandateBar.appendChild(partyBar);

    currentHeight += percentage;
  });

  let flertallMarker = document.createElement("div");
  flertallMarker.className = "flertallMarker";
  
  // Ny beregning for flertallsmarkørens posisjon
  let flertallPercentage = (majorityMandates / totalMandates) * 100;
  flertallMarker.style.bottom = `${flertallPercentage}%`;
  
  mandateBar.appendChild(flertallMarker);

  const status = document.getElementById("majorityStatus");
  if (selectedTotalMandates >= majorityMandates) {
    status.textContent = `Sammensetningen av partiene "${selectedParties.map(p => p.name).join('+')}" gir flertall!`;
  } else {
    const diff = majorityMandates - selectedTotalMandates;
    if (selectedParties.length === 1) {
      status.textContent = `Partiet ${selectedParties[0].name} kan ikke styre alene, det mangler ${diff} mandat for flertall.`;
    } else {
      status.textContent = `Partiene ${selectedParties.map(p => p.name).join('+')} kan ikke styre alene, de mangler ${diff} mandater for flertall.`;
    }
  }
}
