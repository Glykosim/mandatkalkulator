let selectedParties = [];

parties.sort((a, b) => b.mandates - a.mandates);

// Generer knapper basert på config.js data
parties.forEach(party => {
  let btn = document.createElement("button");
  btn.innerHTML = `${party.name} (${party.mandates})`;
  
  if (party.txtColor) {
    btn.style.color = party.txtColor;
  }
  
    if (party.secondaryColor) {
    btn.style.background = `linear-gradient(90deg, ${party.color} 0%, ${party.color} 40%, ${party.secondaryColor} 60%, ${party.secondaryColor} 100%)`;
  } else {
    btn.style.backgroundColor = party.color;
  }

updateMandateBar();  

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

function launchConfetti() {
  for (let i = 0; i < 100; i++) { 
    let confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = `50vw`;
    confetti.style.top = `50vh`;

    const rotation = Math.random() * 360;  // Initialiser rotasjonen først
    confetti.dataset.rotation = rotation;
    confetti.style.setProperty('--rotation', `${rotation}deg`);

    const distance = 100;  
    const radianRotation = rotation * Math.PI / 180;  // Konverterer rotasjonen til radianer
    const xOffset = distance * Math.cos(radianRotation);
    const yOffset = distance * Math.sin(radianRotation);
    confetti.style.setProperty('--xOffset', `${xOffset}vw`);
    confetti.style.setProperty('--yOffset', `${yOffset}vh`);

    confetti.style.backgroundColor = getRandomColor();
    document.body.appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
    }, 2000);
  }
}




// const buttonHeight = 45; // Høyden av en knapp som definert i CSS
// const buttonMargin = 10; // Margin definert i CSS (topp og bunn)
// const totalButtonHeight = parties.length * (buttonHeight + 2*buttonMargin); // Total høyde = antall knapper * (høyde + 2*margin)
// document.getElementById('mandateBar').style.height = `${totalButtonHeight}px`;

function getRandomColor() {
  // Hent alle farger fra de valgte partiene
  const colors = selectedParties.flatMap(party => {
    if(party.secondaryColor) {
      return [party.color, party.secondaryColor];
    }
    return [party.color];
  });

  return colors[Math.floor(Math.random() * colors.length)];
}


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

    // Legg til tekstetikett for flertallsmarkeringen
    let flertallLabel = document.createElement("div");
    flertallLabel.innerHTML = `Flertall ved ${majorityMandates} mandat`;
    flertallLabel.style.position = "absolute";
    flertallLabel.style.bottom = `${flertallPercentage - 5}%`;  // litt over flertallsmarkeringen
    flertallLabel.style.left = "105%";  // litt til høyre for søylen
    flertallLabel.style.fontSize = "0.8rem";

    mandateBar.appendChild(flertallLabel);

  const status = document.getElementById("majorityStatus");
  
  if (selectedParties.length === 0) {
    // Ingen partier er valgt
    status.textContent = "";
	 status.style.display = "none";
  } else {
	  status.style.display = "block";
	  
	  if (selectedTotalMandates >= majorityMandates) {
		status.textContent = `Sammensetningen av partiene ${selectedParties.map(p => p.name).join('+')} gir flertall!`;
		launchConfetti();
	  } else {
		const diff = majorityMandates - selectedTotalMandates;
		if (selectedParties.length === 1) {
		  status.textContent = `${selectedParties[0].name} kan ikke styre alene, det mangler ${diff} mandat for flertall.`;
		} else {
		  status.textContent = `Partiene ${selectedParties.map(p => p.name).join('+')} kan ikke styre alene, de mangler ${diff} mandat for flertall.`;
		}
	  }
  }
}
