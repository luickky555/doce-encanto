document.addEventListener('DOMContentLoaded', () => {
  // --- Animação Stagger ao rolar ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("animate__animated", "animate__zoomIn");
        }, i * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".card-stagger").forEach(card => {
    observer.observe(card);
  });

  // --- PREÇOS ---
  const prices = { copo: 12, cone: 12, morango: 8 };
  let quantities = { copo: 0, cone: 0, morango: 0 };

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  // Atualiza total
  function updateTotal() {
    let total = (quantities.copo * prices.copo) +
                (quantities.cone * prices.cone) +
                (quantities.morango * prices.morango);
    document.getElementById("total").textContent = formatter.format(total);
    return total;
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
      if (quantities[product] > 0) quantities[product]--;
      document.getElementById(`qty-${product}`).textContent = quantities[product];
      updateTotal();
    });
  });



  // PIX
  window.copiarPix = function copiarPix() {
    navigator.clipboard.writeText("doceria@pix.com").then(() => {
      alert("Chave PIX copiada!");
    }).catch(()=> {
      alert("Não foi possível copiar automaticamente. Copie manualmente: doceria@pix.com");
    });
  };

  // --- CARRINHO / RESUMO ---
  const productNames = { copo: 'Copo Doce', cone: 'Cone Trufado', morango: 'Morango do Amor' };

  function getCartItems() {
    const items = [];
    for (let produto in quantities) {
      if (quantities[produto] > 0) {
        const flavorSelect = document.querySelector(`.flavor-select[data-product="${produto}"]`);
        const sabor = flavorSelect ? flavorSelect.options[flavorSelect.selectedIndex].text : '';
        items.push({
          name: productNames[produto],
          flavor: sabor,
          quantity: quantities[produto],
          lineTotal: quantities[produto] * prices[produto]
        });
      }
    }
    return items;
  }

  // FINALIZAR PEDIDO
  function finalizarPedido() {
    const total = updateTotal();
    if (total === 0) {
      alert("Adicione ao menos 1 item ao carrinho!");
      return;
    }

    const items = getCartItems();
    const summaryEl = document.getElementById('order-summary');
    if (summaryEl) {
      let html = '<h4>Resumo do pedido</h4><ul class="list-unstyled text-start mx-auto" style="max-width:420px;">';
      items.forEach(it => {
        html += `<li>${it.quantity}x <strong>${it.name}</strong> (${it.flavor}) — ${formatter.format(it.lineTotal)}</li>`;
      });
      html += `</ul><p><strong>Total: ${formatter.format(total)}</strong></p>`;
      summaryEl.innerHTML = html;
    }

    document.querySelector('main').style.display = 'none';
    document.getElementById('agradecimento').style.display = 'block';
    setTimeout(()=> document.getElementById('agradecimento').scrollIntoView({behavior:'smooth'}), 100);
  }

  // VOLTAR AO INÍCIO
  function voltarInicio() {
    for (let produto in quantities) {
      quantities[produto] = 0;
      document.getElementById(`qty-${produto}`).textContent = "0";
    }
    updateTotal();
    document.getElementById('agradecimento').style.display = 'none';
    document.querySelector('main').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Conectar botões
  document.getElementById('finalizarBtn').addEventListener('click', finalizarPedido);
  document.getElementById('btnVoltar').addEventListener('click', voltarInicio);

  updateTotal(); // inicializa total
});
