// --- Animação Stagger ao rolar ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("animate__animated", "animate__zoomIn");
      }, i * 200);
      observer.unobserve(entry.target); // só anima uma vez
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".card-stagger").forEach(card => {
  observer.observe(card);
});

// --- PREÇOS ---
const prices = {
  copo: 8,
  cone: 10,
  morango: 6
};

let quantities = {
  copo: 0,
  cone: 0,
  morango: 0
};

// Atualiza total
function updateTotal() {
  let total = (quantities.copo * prices.copo) +
              (quantities.cone * prices.cone) +
              (quantities.morango * prices.morango);
  document.getElementById("total").textContent = 
    "R$ " + total.toFixed(2).replace(".", ",");
}

// Botões + e -
document.querySelectorAll(".plus-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    let product = btn.dataset.product;
    quantities[product]++;
    document.getElementById(`qty-${product}`).textContent = quantities[product];
    updateTotal();
  });
});

document.querySelectorAll(".minus-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    let product = btn.dataset.product;
    if (quantities[product] > 0) {
      quantities[product]--;
    }
    document.getElementById(`qty-${product}`).textContent = quantities[product];
    updateTotal();
  });
});

// Troca imagens pelo sabor
document.querySelectorAll(".flavor-select").forEach(select => {
  select.addEventListener("change", e => {
    let img = select.closest(".card").querySelector(".sweet-img");
    let newImg = select.options[select.selectedIndex].dataset.img;
    img.classList.add("animate__animated", "animate__fadeOut");
    setTimeout(() => {
      img.src = newImg;
      img.classList.remove("animate__fadeOut");
      img.classList.add("animate__fadeIn");
    }, 300);
    setTimeout(() => img.classList.remove("animate__fadeIn", "animate__animated"), 1000);
  });
});

// PIX
function copiarPix() {
  navigator.clipboard.writeText("doceria@pix.com").then(() => {
    alert("Chave PIX copiada!");
  });
}
