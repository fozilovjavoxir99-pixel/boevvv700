const STORAGE_KEY = 'clothing-store-items';
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

function readProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveProducts(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function toStars(value) {
  const rating = Number(value) || 0;
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function renderProducts() {
  const products = readProducts();

  if (!products.length) {
    productList.innerHTML = '<p>Hozircha mahsulotlar mavjud emas.</p>';
    return;
  }

  productList.innerHTML = products
    .map(
      (product, index) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <div class="card-body">
            <h3 class="product-name">${product.name}</h3>
            <p class="price">${Number(product.price).toLocaleString('uz-UZ')} so'm</p>
            <p class="meta"><strong>O'lcham:</strong> ${product.sizes}</p>
            <div class="rating">${toStars(product.rating)}</div>
            <p class="review">${product.review || 'Izoh mavjud emas.'}</p>
            <button class="delete-btn" data-index="${index}">O'chirish</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const items = readProducts();
      const idx = Number(event.target.dataset.index);
      items.splice(idx, 1);
      saveProducts(items);
      renderProducts();
    });
  });
}

productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('image');
  const file = fileInput.files[0];

  if (!file) {
    alert('Rasm tanlang!');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const products = readProducts();

    products.unshift({
      name: document.getElementById('name').value.trim(),
      price: Number(document.getElementById('price').value),
      sizes: document.getElementById('sizes').value.trim(),
      rating: Number(document.getElementById('rating').value),
      review: document.getElementById('review').value.trim(),
      image: reader.result,
    });

    saveProducts(products);
    productForm.reset();
    renderProducts();
  };

  reader.readAsDataURL(file);
});

renderProducts();
