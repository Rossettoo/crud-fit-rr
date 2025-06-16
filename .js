let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
let editandoIndex = null;

function calcularValorTotal(tipo, quantidade, restricoes) {
  let preco = 25 * quantidade;
  if (tipo === 'Vegetariana') preco *= 0.9;
  if (restricoes.length > 0) preco += quantidade * 5;
  return preco;
}

function salvarPedidos() {
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

function renderizarTabela() {
  const tabela = document.getElementById('tabelaPedidos');
  tabela.innerHTML = '';
  pedidos.forEach((p, index) => {
    const row = `<tr>
      <td>${p.nome}</td>
      <td>${p.tipo}</td>
      <td>${p.quantidade}</td>
      <td>${p.restricoes.join(', ')}</td>
      <td>R$${p.valorTotal.toFixed(2)}</td>
      <td>
        <button onclick="editarPedido(${index})">Editar</button>
        <button onclick="excluirPedido(${index})">Excluir</button>
      </td>
    </tr>`;
    tabela.innerHTML += row;
  });
}

function editarPedido(index) {
  const p = pedidos[index];
  document.getElementById('nome').value = p.nome;
  document.getElementById('tipo').value = p.tipo;
  document.getElementById('quantidade').value = p.quantidade;
  document.querySelectorAll('.restricao').forEach(cb => {
    cb.checked = p.restricoes.includes(cb.value);
  });
  editandoIndex = index;
}

function excluirPedido(index) {
  pedidos.splice(index, 1);
  salvarPedidos();
  renderizarTabela();
}

document.getElementById('pedidoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const tipo = document.getElementById('tipo').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const restricoes = Array.from(document.querySelectorAll('.restricao'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  const valorTotal = calcularValorTotal(tipo, quantidade, restricoes);
  const novoPedido = { nome, tipo, quantidade, restricoes, valorTotal };

  if (editandoIndex !== null) {
    pedidos[editandoIndex] = novoPedido;
    editandoIndex = null;
  } else {
    pedidos.push(novoPedido);
  }

  salvarPedidos();
  renderizarTabela();
  document.getElementById('pedidoForm').reset();
  document.getElementById('mensagem').textContent = 'Pedido salvo com sucesso!';
  setTimeout(() => document.getElementById('mensagem').textContent = '', 3000);
});

renderizarTabela();
