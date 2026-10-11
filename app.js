const kpis = [
  { label: 'Valor total stock', value: '$4.8M', trend: '+12.4%', type: 'up' },
  { label: 'Pick completados', value: '1,284', trend: '+7.1%', type: 'up' },
  { label: 'SKU bajo stock', value: '34', trend: '-2.8%', type: 'down' },
  { label: 'Eficiencia', value: '96.2%', trend: '+1.6%', type: 'up' }
];

const warehouseData = [
  { name: 'A1', utilization: 78, status: 'ok' },
  { name: 'A2', utilization: 92, status: 'warning' },
  { name: 'A3', utilization: 65, status: 'ok' },
  { name: 'A4', utilization: 88, status: 'warning' },
  { name: 'B1', utilization: 96, status: 'critical' },
  { name: 'B2', utilization: 71, status: 'ok' },
  { name: 'B3', utilization: 84, status: 'warning' },
  { name: 'B4', utilization: 57, status: 'ok' }
];

const queue = [
  { id: 'OP-1043', task: 'Picking de componentes', eta: '12 min' },
  { id: 'OP-1048', task: 'Preparación de envío', eta: '18 min' },
  { id: 'OP-1062', task: 'Reubicación de pallets', eta: '31 min' }
];

const inventory = [
  { sku: 'XK-4102', product: 'Batería 12V', location: 'A2-03', stock: 126, rotation: '4.8x', status: 'healthy' },
  { sku: 'LM-2201', product: 'Motor lineal 230V', location: 'B1-12', stock: 18, rotation: '1.9x', status: 'warning' },
  { sku: 'RT-3310', product: 'Sensores de proximidad', location: 'A1-07', stock: 245, rotation: '7.2x', status: 'healthy' },
  { sku: 'QF-9004', product: 'Rodamiento industrial', location: 'B3-02', stock: 9, rotation: '1.1x', status: 'critical' },
  { sku: 'NV-7788', product: 'Panel HMI 7"', location: 'A4-09', stock: 61, rotation: '3.4x', status: 'healthy' },
  { sku: 'PL-1102', product: 'Cables de control', location: 'B4-06', stock: 42, rotation: '2.5x', status: 'warning' }
];

const alerts = [
  { title: 'Pedido crítico', detail: 'SKU QF-9004 bajo 2 días de cobertura', level: 'critical' },
  { title: 'Ajuste de ubicación', detail: 'A2 requiere reubicación por alta rotación', level: 'warning' },
  { title: 'Ciclo de inventario', detail: 'Conteo programado en 2h en zona B', level: 'ok' }
];

const kpiEl = document.getElementById('kpis');
const warehouseGrid = document.getElementById('warehouseGrid');
const pickingQueue = document.getElementById('pickingQueue');
const inventoryTable = document.getElementById('inventoryTable');
const alertList = document.getElementById('alertList');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

function renderKpis() {
  kpiEl.innerHTML = kpis.map((kpi) => `
    <article class="kpi-card">
      <p class="eyebrow">${kpi.label}</p>
      <div class="kpi-value">
        <h3>${kpi.value}</h3>
        <span class="kpi-trend ${kpi.type === 'up' ? 'trend-up' : 'trend-down'}">
          ${kpi.type === 'up' ? '↗' : '↘'} ${kpi.trend}
        </span>
      </div>
    </article>
  `).join('');
}

function renderWarehouse() {
  warehouseGrid.innerHTML = warehouseData.map((cell) => {
    const statusClass = cell.status === 'critical' ? 'critical' : cell.status === 'warning' ? 'warning' : 'ok';
    const bars = Array.from({ length: 4 }, (_, index) => {
      const level = Math.max(24, Math.min(100, cell.utilization - index * 16));
      return `<span class="bar ${statusClass}" style="height:${level}%"></span>`;
    }).join('');

    return `
      <div class="warehouse-cell">
        <div class="warehouse-cell-header">
          <span>${cell.name}</span>
          <span>${cell.utilization}%</span>
        </div>
        <div class="warehouse-bars">${bars}</div>
        <div class="warehouse-cell-footer">
          <span>Capacidad</span>
          <span>${cell.status === 'critical' ? 'Crítico' : cell.status === 'warning' ? 'Alerta' : 'Normal'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderQueue() {
  pickingQueue.innerHTML = queue.map((item) => `
    <div class="queue-item">
      <div class="queue-badge">${item.id.split('-')[1]}</div>
      <div class="queue-meta">
        <strong>${item.id}</strong>
        <span>${item.task}</span>
        <small>ETA ${item.eta}</small>
      </div>
    </div>
  `).join('');
}

function getStatusClass(status) {
  if (status === 'warning') return 'warning';
  if (status === 'critical') return 'critical';
  return 'ok';
}

function renderInventory() {
  const search = searchInput.value.toLowerCase();
  const filtered = inventory.filter((item) => {
    const matchesText = [item.sku, item.product, item.location].join(' ').toLowerCase().includes(search);
    const selectedStatus = statusFilter.value;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesText && matchesStatus;
  });

  inventoryTable.innerHTML = filtered.map((item) => `
    <tr>
      <td>${item.sku}</td>
      <td>${item.product}</td>
      <td>${item.location}</td>
      <td>${item.stock}</td>
      <td>${item.rotation}</td>
      <td><span class="tag ${getStatusClass(item.status)}">${item.status === 'healthy' ? 'OK' : item.status === 'warning' ? 'Bajo stock' : 'Crítico'}</span></td>
    </tr>
  `).join('');
}

function renderAlerts() {
  alertList.innerHTML = alerts.map((item) => `
    <div class="alert-item">
      <div>
        <strong>${item.title}</strong>
        <span>${item.detail}</span>
      </div>
      <div class="status-dot ${item.level}"></div>
    </div>
  `).join('');
}

searchInput.addEventListener('input', renderInventory);
statusFilter.addEventListener('change', renderInventory);

renderKpis();
renderWarehouse();
renderQueue();
renderInventory();
renderAlerts();
