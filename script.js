// MetaDentalLink® MVP – logique simple côté navigateur
// Pas de stockage serveur, tout est simulé localement.

let laboBalance = 0;
let modeleurBalance = 0;

// ---- Changement de vue (Labo / Modélisateur) ----
function switchView(view) {
  const labo = document.getElementById("view-labo");
  const mod = document.getElementById("view-modeleur");

  if (!labo || !mod) return;

  if (view === "labo") {
    labo.classList.remove("hidden");
    mod.classList.add("hidden");
  } else {
    mod.classList.remove("hidden");
    labo.classList.add("hidden");
  }
}

// Gestion des clics sur les boutons de navigation
document.querySelectorAll("[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const view = btn.getAttribute("data-view");
    switchView(view);
  });
});

// ---- Espace Labo : recharge de points ----
const laboBalanceSpan = document.getElementById("labo-balance");
const laboRechargeSelect = document.getElementById("labo-recharge");
const btnLaboRecharge = document.getElementById("btn-labo-recharge");

if (btnLaboRecharge && laboBalanceSpan && laboRechargeSelect) {
  btnLaboRecharge.addEventListener("click", () => {
    const value = parseInt(laboRechargeSelect.value, 10);
    if (!value || value <= 0) {
      alert("Merci de choisir un pack de points.");
      return;
    }
    laboBalance += value;
    laboBalanceSpan.textContent = laboBalance;
    laboRechargeSelect.value = "";
  });
}

// ---- Espace Labo : fiche de travail ----
const formFicheLabo = document.getElementById("form-fiche-labo");
const btnResetFicheLabo = document.getElementById("btn-reset-fiche-labo");
const laboResultBlock = document.getElementById("labo-result");
const laboResumePre = document.getElementById("labo-resume");
const laboJsonPre = document.getElementById("labo-json");

if (formFicheLabo && laboResultBlock && laboResumePre && laboJsonPre) {
  formFicheLabo.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(formFicheLabo);

    const fiche = {
      patient: {
        nom: data.get("patient_nom") || "",
        reference: data.get("patient_ref") || "",
        date: data.get("date") || "",
      },
      prescripteur: {
        structure: data.get("prescripteur_nom") || "",
        reference_interne: data.get("prescripteur_ref") || "",
      },
      travail: {
        type: data.get("type_travail") || "",
        arcade: data.get("arcade") || "",
        dents: (data.get("dents") || "").trim(),
      },
      technique: {
        materiau: data.get("materiau") || "",
        crochets: data.get("crochets") || "",
        points_estimes: parseInt(data.get("points_cas") || "0", 10) || 0,
      },
      observations: data.get("observations") || "",
      metadonnees: {
        cree_le: new Date().toISOString(),
        source: "MetaDentalLink-MVP",
      },
    };

    // Débit des points si possible
    const cout = fiche.technique.points_estimes || 0;
    if (cout > 0) {
      if (laboBalance < cout) {
        alert(
          `Solde insuffisant : il vous manque ${
            cout - laboBalance
          } points pour ce cas. Rechargez votre compte ou diminuez le nombre de points estimés.`
        );
      } else {
        laboBalance -= cout;
        if (laboBalanceSpan) laboBalanceSpan.textContent = laboBalance;
      }
    }

    // Résumé lisible
    const resume = [
      `Patient : ${fiche.patient.nom || "-"} (ref : ${
        fiche.patient.reference || "-"
      })`,
      `Date : ${fiche.patient.date || "-"}`,
      `Structure : ${fiche.prescripteur.structure || "-"} (ref interne : ${
        fiche.prescripteur.reference_interne || "-"
      })`,
      "",
      `Type de travail : ${fiche.travail.type || "-"}`,
      `Arcade : ${fiche.travail.arcade || "-"}`,
      `Dents concernées : ${fiche.travail.dents || "-"}`,
      "",
      `Matériau : ${fiche.technique.materiau || "-"}`,
      `Crochets / appuis : ${fiche.technique.crochets || "-"}`,
      `Points estimés : ${fiche.technique.points_estimes || 0} pts`,
      "",
      `Observations :`,
      fiche.observations || "-",
    ].join("\n");

    laboResumePre.textContent = resume;
    laboJsonPre.textContent = JSON.stringify(fiche, null, 2);
    laboResultBlock.classList.remove("hidden");
  });

  if (btnResetFicheLabo) {
    btnResetFicheLabo.addEventListener("click", () => {
      formFicheLabo.reset();
      laboResultBlock.classList.add("hidden");
      laboResumePre.textContent = "";
      laboJsonPre.textContent = "";
    });
  }
}

// ---- Espace Modélisateur : points gagnés ----
const modeleurBalanceSpan = document.getElementById("modeleur-balance");
const modeleurGainSelect = document.getElementById("modeleur-gain");
const btnModeleurGain = document.getElementById("btn-modeleur-gain");

if (btnModeleurGain && modeleurBalanceSpan && modeleurGainSelect) {
  btnModeleurGain.addEventListener("click", () => {
    const gain = parseInt(modeleurGainSelect.value, 10);
    if (!gain || gain <= 0) {
      alert("Merci de choisir un type de cas pour simuler les points gagnés.");
      return;
    }
    modeleurBalance += gain;
    modeleurBalanceSpan.textContent = modeleurBalance;
    modeleurGainSelect.value = "";
  });
}

// Vue par défaut : Labo
switchView("labo");
console.log("MetaDentalLink® MVP chargé.");
